import React from 'react';

// Các thẻ văn bản dùng chung cho phần giải thích trên trang công cụ.
export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-4 scroll-mt-24">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-2">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-600 leading-relaxed">{children}</ul>
  );
}

export function Table({ head, rows }: { head: React.ReactNode[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-xs sm:text-sm text-left">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            {head.map((cell, i) => (
              <th key={i} className="px-3 py-2 font-semibold whitespace-nowrap">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
