import React from 'react';

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
        ?
      </span>
      <span>
        <span className="block font-extrabold text-lg tracking-tight text-slate-900 leading-tight">HowDoI</span>
        <span className="block text-[11px] text-slate-500 font-medium leading-tight">Làm sao để hết nợ</span>
      </span>
    </span>
  );
}
