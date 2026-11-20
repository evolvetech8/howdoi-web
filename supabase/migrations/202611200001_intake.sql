create table public.intake_requests (
 id uuid primary key default gen_random_uuid(), code text unique not null default ('DG-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,12))),
 kind text not null check(kind in ('contact','report','support','subscribe')), submission_id uuid not null unique, payload_hash text not null,
 payload jsonb not null, status text not null default 'requested' check(status in ('requested','awaiting_payment','paid','in_review','delivered','declined','cancelled','refunded')),
 paid_vnd integer not null default 0 check(paid_vnd>=0), refunded_vnd integer not null default 0 check(refunded_vnd>=0 and refunded_vnd<=paid_vnd),
 history jsonb not null default '[]', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.notification_outbox (
 id uuid primary key default gen_random_uuid(), request_id uuid not null unique references public.intake_requests(id),
 status text not null default 'pending' check(status in ('pending','sending','sent','manual_review')),
 attempts integer not null default 0, provider_id text, lease_until timestamptz, created_at timestamptz not null default now()
);
create table public.rate_limit_buckets (key text not null, hour timestamptz not null, count integer not null, primary key(key,hour));
alter table public.intake_requests enable row level security;
alter table public.notification_outbox enable row level security;
alter table public.rate_limit_buckets enable row level security;
revoke all on public.intake_requests, public.notification_outbox, public.rate_limit_buckets from anon, authenticated;

create function public.receive_intake(p_kind text,p_submission uuid,p_hash text,p_payload jsonb,p_rate_key text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r intake_requests; n integer;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_submission::text,0));
 select * into r from intake_requests where submission_id=p_submission;
 if found then
  if p_kind='subscribe' and r.kind='subscribe' then
   update intake_requests set payload=payload||jsonb_build_object('targets',
    (select jsonb_agg(distinct v) from jsonb_array_elements(coalesce(r.payload->'targets',jsonb_build_array(r.payload->>'target'))||jsonb_build_array(p_payload->>'target')) as t(v))),updated_at=now() where id=r.id;
  elsif r.payload_hash<>p_hash or r.kind<>p_kind then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
  return jsonb_build_object('id',r.id,'code',r.code,'duplicate',true);
 end if;
 insert into rate_limit_buckets values(p_rate_key,date_trunc('hour',now()),1)
 on conflict(key,hour) do update set count=rate_limit_buckets.count+1 returning count into n;
 if n>5 then raise exception 'RATE_LIMITED'; end if;
 delete from rate_limit_buckets where hour<now()-interval '24 hours';
 insert into intake_requests(kind,submission_id,payload_hash,payload) values(p_kind,p_submission,p_hash,p_payload) returning * into r;
 insert into notification_outbox(request_id) values(r.id);
 return jsonb_build_object('id',r.id,'code',r.code,'duplicate',false);
end $$;
create function public.claim_notifications(p_request uuid default null)
returns table(id uuid,code text) language plpgsql security definer set search_path=public as $$
begin
 update notification_outbox set status='manual_review' where status in ('pending','sending') and (created_at<now()-interval '23 hours' or attempts>=5);
 return query with candidates as (
 select o.id from notification_outbox o where (p_request is null or o.request_id=p_request) and
 (o.status='pending' or (o.status='sending' and o.lease_until<now())) order by o.created_at limit 10 for update skip locked
 ), claimed as (
 update notification_outbox o set status='sending', attempts=attempts+1, lease_until=now()+interval '2 minutes' from candidates c where o.id=c.id returning o.id,o.request_id
 ) select c.id,r.code from claimed c join intake_requests r on r.id=c.request_id;
end $$;
revoke all on function public.receive_intake(text,uuid,text,jsonb,text) from public,anon,authenticated;
revoke all on function public.claim_notifications(uuid) from public,anon,authenticated;
grant execute on function public.receive_intake(text,uuid,text,jsonb,text),public.claim_notifications(uuid) to service_role;
create function public.subscriber_count() returns bigint language sql security definer set search_path=public as $$ select count(*) from intake_requests where kind='subscribe' $$;
revoke all on function public.subscriber_count() from public,anon,authenticated;
grant execute on function public.subscriber_count() to service_role;
create table public.analytics_events(id bigint generated always as identity primary key,event text not null check(event in ('landing_viewed','wizard_started','wizard_completed','sample_viewed','service_viewed','service_cta_clicked')),source text not null check(source in ('direct','community','search','referral')),created_at timestamptz not null default now());
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon,authenticated;
create function public.record_event(p_event text,p_source text,p_key text) returns void language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 insert into rate_limit_buckets values(p_key,date_trunc('hour',now()),1) on conflict(key,hour) do update set count=rate_limit_buckets.count+1 returning count into n;
 if n>120 then raise exception 'RATE_LIMITED';end if;
 insert into analytics_events(event,source) values(p_event,p_source);
end $$;
revoke all on function public.record_event(text,text,text) from public,anon,authenticated;
grant execute on function public.record_event(text,text,text) to service_role;

create function public.transition_request(p_code text,p_action text,p_amount integer default 0,p_reference text default '') returns text language plpgsql security definer set search_path=public as $$
declare r intake_requests; next_status text;
begin
 select * into r from intake_requests where code=p_code and kind='report' for update;
 if not found then raise exception 'Request not found';end if;
 next_status=case
 when p_action='accept' and r.status='requested' then 'awaiting_payment'
 when p_action='mark-paid' and r.status='awaiting_payment' and p_amount=(r.payload->>'priceVnd')::integer and length(p_reference)>0 then 'paid'
 when p_action='start' and r.status='paid' then 'in_review'
 when p_action='deliver' and r.status='in_review' then 'delivered'
 when p_action='decline' and r.status='requested' then 'declined'
 when p_action='cancel' and r.status in ('requested','awaiting_payment') then 'cancelled'
 when p_action='refund' and r.status in ('paid','in_review','delivered') and p_amount=r.paid_vnd and length(p_reference)>0 then 'refunded'
 else null end;
 if next_status is null then raise exception 'Invalid transition or amount';end if;
 update intake_requests set status=next_status,updated_at=now(),
 paid_vnd=case when p_action='mark-paid' then p_amount else paid_vnd end,
 refunded_vnd=case when p_action='refund' then p_amount else refunded_vnd end,
 history=history||jsonb_build_array(jsonb_build_object('action',p_action,'at',now(),'amount',p_amount,'reference',p_reference)) where id=r.id;
 return next_status;
end $$;
revoke all on function public.transition_request(text,text,integer,text) from public,anon,authenticated;
grant execute on function public.transition_request(text,text,integer,text) to service_role;
create function public.cleanup_intake() returns void language plpgsql security definer set search_path=public as $$
begin
 delete from analytics_events where created_at<now()-interval '30 days';
 delete from rate_limit_buckets where hour<now()-interval '24 hours';
 -- Preserve financial records; only closed non-transactional contacts are purged.
 delete from notification_outbox where request_id in(select id from intake_requests where kind in ('contact','support') and status='cancelled' and updated_at<now()-interval '90 days');
 delete from intake_requests where kind in ('contact','support') and status='cancelled' and updated_at<now()-interval '90 days';
end $$;
revoke all on function public.cleanup_intake() from public,anon,authenticated;
grant execute on function public.cleanup_intake() to service_role;
