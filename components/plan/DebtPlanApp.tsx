'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Upload, ShieldCheck, NotebookPen } from 'lucide-react';
import {
  DRAFT_KEY,
  STORAGE_KEY,
  applyCheckIn,
  monthKey,
  clearPlan,
  decodeBackup,
  loadPlan,
  sanitizePlan,
  savePlan,
  undoLastCheckIn,
  type CheckIn,
  type CheckInInput,
  type DebtPlan,
  type PlanStrategy,
} from '@/lib/debt-plan';
import PlanEditor, { type DraftDebt } from './PlanEditor';
import PlanDashboard from './PlanDashboard';

type Draft = { debts: DraftDebt[]; budget?: number; strategy?: PlanStrategy };
type Mode = 'loading' | 'empty' | 'editing' | 'dashboard';

function readDraft(): Draft | null {
  try {
    let raw: string | null = null;
    for (const store of [window.localStorage, window.sessionStorage]) {
      try {
        raw = raw ?? store.getItem(DRAFT_KEY);
        store.removeItem(DRAFT_KEY);
      } catch {
        /* bộ nhớ này bị chặn, thử bộ nhớ còn lại */
      }
    }
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    return Array.isArray(d.debts) && d.debts.length > 0 ? d : null;
  } catch {
    return null;
  }
}

export default function DebtPlanApp() {
  const [mode, setMode] = useState<Mode>('loading');
  const [plan, setPlan] = useState<DebtPlan | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pendingRestore, setPendingRestore] = useState<DebtPlan | null>(null);
  const [storageOk, setStorageOk] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CheckIn | null>(null);
  const [today, setToday] = useState<Date>(() => new Date());

  useEffect(() => {
    const loaded = loadPlan();
    setStorageOk(loaded.storageOk);
    setPlan(loaded.plan);
    setToday(new Date());

    // Link khôi phục: dữ liệu nằm sau dấu #, không bao giờ được gửi lên máy chủ.
    if (window.location.hash.startsWith('#khoi-phuc=')) {
      const match = window.location.hash.match(/^#khoi-phuc=([A-Za-z0-9_-]+)/);
      history.replaceState(null, '', window.location.pathname);
      const restored = match ? decodeBackup(match[1]) : null;
      if (!restored) setNotice('Link khôi phục không hợp lệ hoặc đã bị cắt mất một phần. Hãy sao chép lại toàn bộ link.');
      else if (loaded.plan) setPendingRestore(restored);
      else {
        persist(restored);
        setNotice('Đã khôi phục sổ từ link.');
        setMode('dashboard');
        return;
      }
    }

    const fromTool = readDraft();
    if (fromTool && !loaded.plan) {
      setDraft(fromTool);
      setMode('editing');
      return;
    }
    if (fromTool && loaded.plan)
      setNotice('Bạn đã có sổ trên máy này, nên các khoản vừa nhập ở công cụ so sánh chưa được thêm vào sổ. Bấm “Sửa sổ” để thêm từng khoản.');
    setMode(loaded.plan ? 'dashboard' : 'empty');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Ứng dụng để mở lâu (nhất là khi thêm vào Màn hình chính) vẫn phải biết đã sang tháng mới.
    const refresh = () => {
      if (document.visibilityState === 'visible') setToday(new Date());
    };
    // Dán link khôi phục vào tab đang mở sổ: tải lại để đọc link.
    const onHash = () => {
      if (window.location.hash.startsWith('#khoi-phuc=')) window.location.reload();
    };
    // Sổ được sửa ở tab khác: đọc lại để không ghi đè dữ liệu mới bằng dữ liệu cũ.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const loaded = loadPlan();
      setPlan(loaded.plan);
      setLastResult(null);
      setToday(new Date());
      setMode((m) => (loaded.plan ? (m === 'editing' ? m : 'dashboard') : 'empty'));
    };
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('storage', onStorage);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  function persist(next: DebtPlan): boolean {
    setPlan(next);
    const ok = savePlan(next);
    if (!ok) setStorageOk(false);
    return ok;
  }

  const scrollToTop = () =>
    requestAnimationFrame(() => document.getElementById('so-tra-no-top')?.scrollIntoView({ block: 'start', behavior: 'smooth' }));

  const importFile = async (file: File) => {
    try {
      const restored = sanitizePlan(JSON.parse(await file.text()));
      if (!restored) throw new Error('invalid');
      if (plan && !window.confirm('Thay sổ hiện tại bằng sổ trong tệp sao lưu?')) return;
      persist(restored);
      setLastResult(null);
      setNotice('Đã mở sổ từ tệp sao lưu.');
      setMode('dashboard');
    } catch {
      setNotice('Tệp này không phải tệp sao lưu sổ trả nợ của HowDoI.');
    }
  };

  const onCheckIn = (input: CheckInInput) => {
    if (!plan) return;
    const now = new Date();
    if (monthKey(now) !== monthKey(today)) {
      // Trang mở từ tháng trước: cập nhật lại để người dùng xem đúng tháng trước khi ghi.
      setToday(now);
      setNotice('Đã sang tháng mới. Hãy xem lại số tiền rồi ghi sổ.');
      return;
    }
    const { plan: next, checkIn } = applyCheckIn(plan, input, now);
    const ok = persist(next);
    setToday(now);
    setLastResult(checkIn);
    setNotice(ok ? null : 'Đã ghi sổ cho lần mở trang này nhưng trình duyệt không cho lưu. Hãy bấm “Tải tệp sao lưu” ở bên dưới.');
    scrollToTop();
  };

  if (mode === 'loading') {
    return <div className="p-8 rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">Đang mở sổ…</div>;
  }

  const standalone =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);

  return (
    <div id="so-tra-no-top" className="space-y-5 scroll-mt-24">
      {!storageOk && (
        <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
          Trình duyệt này không cho lưu dữ liệu (có thể bạn đang dùng chế độ ẩn danh). Sổ sẽ mất khi đóng trang, hãy dùng “Tải tệp
          sao lưu” trước khi rời đi.
        </p>
      )}
      {notice && (
        <p role="status" className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-700">
          {notice}
        </p>
      )}
      {pendingRestore && (
        <div role="alert" className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-950 space-y-2">
          <p>Link khôi phục chứa một sổ khác. Thay sổ hiện tại trên máy này bằng sổ trong link?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                persist(pendingRestore);
                setPendingRestore(null);
                setLastResult(null);
                setNotice('Đã khôi phục sổ từ link.');
              }}
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
            >
              Thay bằng sổ trong link
            </button>
            <button type="button" onClick={() => setPendingRestore(null)} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
              Giữ sổ hiện tại
            </button>
          </div>
        </div>
      )}

      {mode === 'empty' && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white space-y-5">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">Lập sổ trả nợ trong khoảng 3 phút</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nhập các khoản nợ và số tiền bạn dành được mỗi tháng. Sổ cho bạn biết ngày hết nợ, tháng này trả khoản nào bao
              nhiêu, và mỗi tháng bạn chỉ cần ghi lại số đã trả.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" /> Số liệu chỉ lưu trên máy bạn, HowDoI không nhận được.
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Không cần tài khoản, không hỏi số điện thoại.
            </li>
            <li className="flex items-start gap-2">
              <NotebookPen className="w-4 h-4 text-emerald-600 shrink-0" /> Mỗi tháng ghi sổ khoảng 1 phút.
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMode('editing')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
            >
              Bắt đầu lập sổ
            </button>
            <label className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 cursor-pointer hover:border-slate-300">
              <Upload className="w-4 h-4" /> Đã có sổ? Mở tệp sao lưu
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) importFile(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
          {standalone && (
            <p className="text-xs text-slate-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Sổ bạn lập trong Safari không tự chuyển sang đây. Trong Safari, bấm “Tải tệp sao lưu”, rồi quay lại đây và bấm “Đã có
              sổ? Mở tệp sao lưu”.
            </p>
          )}
          <p className="text-[11px] text-slate-500">
            Có link khôi phục? Chỉ cần mở link đó trên máy này. Muốn so sánh cách trả trước khi lập sổ, hãy thử{' '}
            <Link href="/cong-cu/ke-hoach-tra-no" className="underline hover:text-emerald-700">
              công cụ so sánh cách trả nợ
            </Link>
            .
          </p>
        </div>
      )}

      {mode === 'editing' && (
        <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 bg-white">
          <PlanEditor
            plan={plan}
            draft={draft}
            today={today}
            onSave={(next) => {
              const ok = persist(next);
              setDraft(null);
              setLastResult(null);
              setNotice(
                !ok
                  ? 'Đã lập sổ cho lần mở trang này nhưng trình duyệt không cho lưu. Hãy bấm “Tải tệp sao lưu” ở bên dưới trước khi rời trang.'
                  : plan
                    ? 'Đã lưu thay đổi.'
                    : 'Đã lưu sổ trên máy này. Hãy thêm lịch nhắc và tải bản sao lưu ở bên dưới.',
              );
              setMode('dashboard');
              scrollToTop();
            }}
            onCancel={plan ? () => setMode('dashboard') : () => setMode('empty')}
          />
        </div>
      )}

      {mode === 'dashboard' && plan && (
        <PlanDashboard
          plan={plan}
          today={today}
          lastResult={lastResult}
          onCheckIn={onCheckIn}
          onUndo={() => {
            persist(undoLastCheckIn(plan, new Date()));
            setLastResult(null);
            setNotice('Đã hoàn tác lần ghi sổ gần nhất.');
          }}
          onEdit={() => {
            setNotice(null);
            setMode('editing');
          }}
          onUpdate={persist}
          onImport={importFile}
          onDelete={() => {
            clearPlan();
            setPlan(null);
            setLastResult(null);
            setNotice('Đã xóa sổ trên máy này.');
            setMode('empty');
          }}
        />
      )}
    </div>
  );
}
