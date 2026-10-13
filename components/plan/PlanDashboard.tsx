'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CalendarPlus,
  Download,
  Link2,
  Upload,
  Pencil,
  Trash2,
  Undo2,
  PartyPopper,
  HeartHandshake,
  Smartphone,
  Lock,
} from 'lucide-react';
import { formatMonths, formatVND } from '@/lib/finance-math';
import {
  DEBT_TYPES,
  buildReminderIcs,
  canUndoLastCheckIn,
  computeStatus,
  encodeBackup,
  firstReminderDate,
  monthLabel,
  monthsBetween,
  type CheckIn,
  type CheckInInput,
  type DebtPlan,
} from '@/lib/debt-plan';
import { SITE } from '@/lib/site';
import CheckInPanel from './CheckInPanel';

const card = 'p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white';

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CheckInResult({ checkIn, plan }: { checkIn: CheckIn; plan: DebtPlan }) {
  const { debtFreeBefore: before, debtFreeAfter: after } = checkIn;
  const status = computeStatus(plan, new Date());
  // Khoản đứng đầu thứ tự ưu tiên là khoản nhận tiền dồn sang.
  const nextTarget = status.sim?.items[0];
  const cleared = checkIn.cleared.map((id) => checkIn.prevDebts.find((d) => d.id === id)).filter(Boolean);
  const behind = checkIn.totalPaid < checkIn.plannedTotal;

  let dateLine: React.ReactNode = null;
  if (before && after) {
    const diff = monthsBetween(after, before);
    if (diff > 0)
      dateLine = (
        <>
          Ngày hết nợ: {monthLabel(before)} → <strong>{monthLabel(after)}</strong> (sớm hơn {formatMonths(diff)}).
        </>
      );
    else if (diff === 0) dateLine = <>Đúng kế hoạch. Ngày hết nợ vẫn là <strong>{monthLabel(after)}</strong>.</>;
    else
      dateLine = (
        <>
          Tháng này khó hơn dự tính. Kế hoạch đã tự điều chỉnh: hết nợ vào <strong>{monthLabel(after)}</strong>. Ghi sổ đều
          đặn là bước quan trọng nhất, bạn đang làm đúng.
        </>
      );
  } else if (after) {
    dateLine = <>Ngày hết nợ dự kiến: <strong>{monthLabel(after)}</strong>.</>;
  } else if (behind) {
    dateLine = <>Tháng này khó hơn dự tính. Không sao, ghi sổ thật là bước quan trọng nhất.</>;
  }

  return (
    <div role="status" className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-sm text-emerald-950">
      <p className="font-bold">Đã ghi sổ {monthLabel(checkIn.month).toLowerCase()}. Bạn đã trả {formatVND(checkIn.totalPaid)}.</p>
      {dateLine && <p>{dateLine}</p>}
      {cleared.map((d) => (
        <p key={d!.id} className="flex items-start gap-2 font-semibold">
          <PartyPopper className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Xóa sổ: {d!.name}!
            {nextTarget && nextTarget.id !== d!.id && d!.minPayment > 0 && (
              <span className="font-normal">
                {' '}
                Khoản {formatVND(d!.minPayment)}/tháng của nó giờ dồn sang {plan.debts.find((x) => x.id === nextTarget.id)?.name}.
              </span>
            )}
          </span>
        </p>
      ))}
      {checkIn.newDebt && <p>Bạn có khoản nợ mới: bấm “Sửa sổ” để thêm vào kế hoạch.</p>}
    </div>
  );
}

export default function PlanDashboard({
  plan,
  today,
  lastResult,
  onCheckIn,
  onUndo,
  onEdit,
  onUpdate,
  onImport,
  onDelete,
}: {
  plan: DebtPlan;
  today: Date;
  lastResult: CheckIn | null;
  onCheckIn: (input: CheckInInput) => void;
  onUndo: () => void;
  onEdit: () => void;
  onUpdate: (plan: DebtPlan) => void;
  onImport: (file: File) => void;
  onDelete: () => void;
}) {
  const status = computeStatus(plan, today);
  const [checkingIn, setCheckingIn] = useState(false);
  const [reminderDay, setReminderDay] = useState<number>(plan.reminderDay ?? 10);
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const last = plan.checkIns[plan.checkIns.length - 1];
  // Khoản nhận tiền dư: chỉ có khi ngân sách lớn hơn tổng tối thiểu và khoản đó thực sự được trả thêm.
  const target =
    plan.budget > status.totalMinimum
      ? status.sim?.items.find((it) => {
          const d = plan.debts.find((x) => x.id === it.id);
          return !!d && it.firstMonthPayment > Math.min(d.minPayment, d.balance);
        })
      : undefined;
  const canUndo = canUndoLastCheckIn(plan, today);
  const undo = () => {
    if (
      last?.editedAfter &&
      !window.confirm('Bạn đã sửa sổ sau lần ghi sổ này. Hoàn tác sẽ đưa dư nợ các khoản về như trước lần ghi sổ; các khoản mới thêm vẫn được giữ.')
    )
      return;
    onUndo();
  };
  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));
  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);

  const restoreUrl = () => `${SITE.url}/so-tra-no#khoi-phuc=${encodeBackup(plan)}`;
  const copyRestoreLink = async () => {
    try {
      await navigator.clipboard.writeText(restoreUrl());
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
  };

  return (
    <div className="space-y-5">
      {/* Headline */}
      <section className={`${card} space-y-4`}>
        {status.done ? (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-2xl font-extrabold text-emerald-700">
              <PartyPopper className="w-7 h-7" /> Bạn đã hết nợ!
            </p>
            <p className="text-sm text-slate-700">
              Bước tiếp theo: giữ thói quen này nhưng chuyển tiền sang quỹ phòng thân, để lần sau có việc gấp không phải vay.
            </p>
            <Link href="/huong-dan/quy-khan-cap-3-6-thang" className="inline-block text-sm font-semibold text-emerald-700 underline">
              Cách xây quỹ khẩn cấp 3–6 tháng
            </Link>
            {canUndo && last && (
              <button type="button" onClick={undo} className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
                <Undo2 className="w-3.5 h-3.5" /> Hoàn tác lần ghi sổ {monthLabel(last.month).toLowerCase()}
              </button>
            )}
          </div>
        ) : status.gap > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Mục tiêu đầu tiên</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Còn thiếu {formatVND(status.gap)} mỗi tháng để trả đủ mức tối thiểu
            </p>
            <p className="text-sm text-slate-600">
              Bạn dành {formatVND(plan.budget)}/tháng, tổng mức tối thiểu là {formatVND(status.totalMinimum)}. Chưa tính được
              ngày hết nợ cho tới khi lấp được khoảng thiếu này. Những việc nên làm ngay:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Ngừng vay khoản mới để trả khoản cũ, vì nợ sẽ chỉ lớn thêm.</li>
              <li>Gọi cho bên cho vay trước ngày đến hạn, hỏi về giãn nợ hoặc giảm số tiền trả mỗi kỳ.</li>
              <li>Tìm khoản chi có thể cắt hoặc đồ có thể bán để lấp khoảng thiếu.</li>
              <li>Nói chuyện với một người thân bạn tin tưởng. Bạn không phải gánh một mình.</li>
            </ul>
            <p className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-3">
              <HeartHandshake className="w-4 h-4 shrink-0 text-slate-500 mt-px" />
              <span>
                Nếu áp lực nợ khiến bạn thấy quá sức chịu đựng, hãy gọi Đường dây nóng Ngày Mai (hỗ trợ tâm lý):{' '}
                <a href="tel:0963061414" className="font-semibold underline">
                  096 306 1414
                </a>{' '}
                (giờ trực có hạn). Trường hợp khẩn cấp, gọi 115.
              </span>
            </p>
          </div>
        ) : status.debtFreeMonth ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ngày hết nợ dự kiến</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">{status.debtFreeMonth && monthLabel(status.debtFreeMonth)}</p>
            <p className="text-sm text-slate-600 mt-1">
              Còn {formatMonths(status.monthsLeft ?? 0)} nếu mỗi tháng trả {formatVND(plan.budget)}.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xl font-extrabold text-slate-900">Với {formatVND(plan.budget)}/tháng, nợ không trả hết được trong 50 năm</p>
            <p className="text-sm text-slate-600">
              Tiền lãi đang ăn gần hết số tiền bạn trả. Hãy tăng số tiền dành trả nợ, hoặc liên hệ bên cho vay để hỏi về giãn
              nợ, giảm lãi.
            </p>
          </div>
        )}

        {!status.done && (
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>Đã trả {Math.round(status.progress * 100)}% số nợ</span>
              <span className="tabular-nums">Còn {formatVND(status.totalBalance)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuenow={Math.round(status.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ trả nợ">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${status.progress * 100}%` }} />
            </div>
            {plan.checkIns.length > 0 && <p className="text-[11px] text-slate-500 mt-1.5">Bạn đã ghi sổ {plan.checkIns.length} lần.</p>}
          </div>
        )}
      </section>

      {lastResult && <CheckInResult checkIn={lastResult} plan={plan} />}

      {/* This month */}
      {!status.done && (
        <section className={`${card} space-y-3`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {monthLabel(status.nextMonth)}
              {status.gap > 0 ? ': mức tối thiểu phải trả' : ' trả gì'}
            </h2>
            {target && (
              <span className="text-xs text-slate-600">
                Dồn tiền dư vào: <strong>{plan.debts.find((d) => d.id === target.id)?.name}</strong>
              </span>
            )}
          </div>
          <ul className="divide-y divide-slate-100 text-sm">
            {status.active.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-2">
                <span>
                  <span className="font-semibold text-slate-800">{d.name}</span>
                  <span className="block text-[11px] text-slate-500">
                    {[DEBT_TYPES.find((t) => t.id === d.type)?.label]
                      .filter((label) => label && label !== d.name)
                      .concat(`còn ${formatVND(d.balance)}`)
                      .join(' · ')}
                    {d.annualRate > 0 && ` · lãi ${String(Math.round(d.annualRate * 100) / 100).replace('.', ',')}%/năm`}
                  </span>
                </span>
                <span className="font-bold text-slate-900 tabular-nums">{formatVND(status.planned[d.id] ?? 0)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
            <span>Tổng</span>
            <span className="tabular-nums">{formatVND(Object.values(status.planned).reduce((s, v) => s + v, 0))}</span>
          </div>

          {!status.canCheckIn ? (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 text-sm text-slate-700">
              <span className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                {status.checkedInThisMonth && last
                  ? `Đã ghi sổ ${monthLabel(last.month).toLowerCase()}. Hẹn bạn tháng sau.`
                  : `Lần ghi sổ đầu tiên: ${monthLabel(status.nextMonth).toLowerCase()}, sau ngày lương.`}
              </span>
              {canUndo && (
                <button type="button" onClick={undo} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
                  <Undo2 className="w-3.5 h-3.5" /> Hoàn tác lần ghi sổ này
                </button>
              )}
            </div>
          ) : checkingIn ? (
            <CheckInPanel
              status={status}
              onSubmit={(input) => {
                setCheckingIn(false);
                onCheckIn(input);
              }}
              onCancel={() => setCheckingIn(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setCheckingIn(true)}
              className="w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
            >
              Ghi sổ {monthLabel(status.nextMonth).toLowerCase()}
            </button>
          )}
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-slate-300">
          <Pencil className="w-4 h-4" /> Sửa sổ (thêm khoản, đổi số tiền)
        </button>
      </div>

      {/* Reminder */}
      <section className={`${card} space-y-3`}>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CalendarPlus className="w-5 h-5 text-emerald-600" /> Nhắc ghi sổ mỗi tháng
        </h2>
        <p className="text-sm text-slate-600">
          Chọn ngày bạn nhận lương. Lịch trên điện thoại sẽ nhắc “HowDoI: ghi sổ tháng này”, không ghi số tiền hay tên khoản nợ
          nào.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="reminder-day" className="text-[11px] font-semibold text-slate-500 block mb-1">
              Ngày nhận lương
            </label>
            <select
              id="reminder-day"
              value={reminderDay}
              onChange={(e) => setReminderDay(Number(e.target.value))}
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Ngày {d}
                </option>
              ))}
              <option value={-1}>Cuối tháng</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              const uid = `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2)}@howdoi.id.vn`;
              download('HowDoI-nhac-ghi-so.ics', buildReminderIcs(reminderDay, now, `${SITE.url}/so-tra-no`, uid, status.nextMonth), 'text/calendar;charset=utf-8');
              onUpdate({ ...plan, reminderDay, updatedAt: now.toISOString() });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
          >
            <CalendarPlus className="w-4 h-4" /> Thêm vào lịch
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Lần nhắc đầu tiên: {firstReminderDate(reminderDay, today, status.nextMonth).toLocaleDateString('vi-VN')}, sau đó lặp lại hằng tháng. Mở tệp
          vừa tải để thêm vào ứng dụng Lịch.
        </p>
      </section>

      {/* Backup */}
      <section className={`${card} space-y-3`}>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" /> Sổ chỉ nằm trên máy này
        </h2>
        <p className="text-sm text-slate-600">
          HowDoI không có máy chủ lưu số nợ của bạn. Đổi điện thoại, xóa dữ liệu trình duyệt, hoặc lâu không mở trang trên
          iPhone đều có thể làm mất sổ. Hãy giữ một bản sao lưu. Tệp và link chỉ lưu sổ ở thời điểm bạn bấm, nên sau mỗi lần
          ghi sổ hãy sao lưu lại.
        </p>
        {isIOS && !isStandalone && (
          <p className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <Smartphone className="w-4 h-4 shrink-0 mt-px text-amber-700" />
            <span>
              Trên iPhone, Safari có thể xóa dữ liệu của trang nếu bạn không mở trang này trong 7 ngày, nên hãy tải tệp sao lưu
              sau mỗi lần ghi sổ. Nếu bạn “Thêm vào MH chính”, biểu tượng đó có bộ nhớ riêng và chưa có sổ: hãy tải tệp sao lưu
              trước, rồi mở biểu tượng và chọn “Đã có sổ? Mở tệp sao lưu”. Từ đó chỉ ghi sổ trong biểu tượng này.
            </span>
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => download(`HowDoI-so-tra-no-${today.toISOString().slice(0, 10)}.json`, JSON.stringify(plan, null, 2), 'application/json')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            <Download className="w-4 h-4" /> Tải tệp sao lưu
          </button>
          <button
            type="button"
            onClick={copyRestoreLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            <Link2 className="w-4 h-4" /> Sao chép link khôi phục
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            <Upload className="w-4 h-4" /> Mở tệp sao lưu
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Chọn tệp sao lưu"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
              e.target.value = '';
            }}
          />
        </div>
        {copied === 'ok' && (
          <p role="status" className="text-xs text-slate-700">
            Đã sao chép. Link này chứa số nợ của bạn: chỉ lưu ở nơi riêng tư (ví dụ Zalo “Cloud của tôi” hoặc ghi chú trên điện
            thoại), đừng gửi cho người khác. Mở link trên máy mới để khôi phục sổ. Link chỉ chứa sổ ở thời điểm sao chép, và
            link đã mở trên máy nào sẽ nằm lại trong lịch sử trình duyệt của máy đó.
          </p>
        )}
        {copied === 'fail' && (
          <p role="status" className="text-xs text-rose-700">
            Không sao chép được trên trình duyệt này. Hãy dùng “Tải tệp sao lưu”.
          </p>
        )}
      </section>

      {/* History */}
      {plan.checkIns.length > 0 && (
        <section className={`${card} space-y-2`}>
          <h2 className="text-base font-bold text-slate-900">Lịch sử ghi sổ</h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {[...plan.checkIns].reverse().map((c) => (
              <li key={c.at} className="flex flex-wrap justify-between gap-2 py-2">
                <span className="font-semibold text-slate-800">{monthLabel(c.month)}</span>
                <span className="text-slate-600 tabular-nums">
                  Trả {formatVND(c.totalPaid)}
                  {c.cleared.length > 0 && ` · xóa sổ ${c.cleared.length} khoản`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm(
                'Xóa toàn bộ sổ trả nợ trên máy này? Không thể hoàn tác nếu bạn chưa có bản sao lưu. Nếu bạn từng mở link khôi phục trên máy này, link đó vẫn nằm trong lịch sử trình duyệt: hãy xóa lịch sử duyệt web của howdoi.id.vn.',
              )) onDelete();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800"
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa toàn bộ dữ liệu trên máy này
        </button>
      </div>
    </div>
  );
}
