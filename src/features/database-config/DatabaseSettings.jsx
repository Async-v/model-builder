import React from "react";
import { Check, Database, Info, Layers3 } from "lucide-react";

export default function DatabaseSettings({ database, setDatabase, showToast }) {
  const options = [
    { name: "MongoDB", subtitle: "Document database", detail: "Mongoose models · JavaScript", tag: "Available", icon: "M" },
    { name: "PostgreSQL", subtitle: "Relational database", detail: "Prisma schema · schema.prisma", tag: "Available", icon: "P" }
  ];
  return <div className="mx-auto max-w-[900px]">
    <div className="mb-8"><p className="mb-2 text-xs font-medium text-accent">CONFIGURATION</p><h1 className="text-[28px] font-semibold tracking-[-.045em] sm:text-[32px]">Database setup</h1><p className="mt-2 text-sm text-muted">Choose the target your model code should be prepared for.</p></div>
    <section className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent"><Database size={18}/></div><div><h2 className="text-sm font-semibold">Database target</h2><p className="mt-1 text-xs text-muted">You can change this at any time.</p></div></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => <button key={option.name} onClick={() => { setDatabase(option.name); showToast(`${option.name} selected`); }} className={`rounded-2xl border p-5 text-left transition-all ${database === option.name ? "border-accent bg-[#f8fbf8] ring-2 ring-accent/10" : "border-line hover:border-[#cdd9d0] hover:bg-canvas"}`}><div className="mb-5 flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-sm font-semibold">{option.icon}</div>{database === option.name ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white"><Check size={13}/></span> : <span className="h-6 w-6 rounded-full border border-line"/>}</div><p className="text-sm font-semibold">{option.name}</p><p className="mt-1 text-xs text-muted">{option.subtitle}</p><p className="mt-4 border-t border-line pt-3 text-[11px] text-[#68766d]">{option.detail}</p></button>)}
      </div>
      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-canvas p-3.5"><Info size={15} className="mt-0.5 shrink-0 text-muted"/><p className="text-[11px] leading-5 text-muted">Changing the target changes the code preview format. It does not connect to or modify a live database.</p></div>
    </section>
    <section className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-soft"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-canvas text-muted"><Layers3 size={17}/></div><div><h2 className="text-sm font-semibold">Generation options</h2><p className="mt-1 text-xs text-muted">Current local preview defaults</p></div></div><div className="mt-4 divide-y divide-line">{[["Language","JavaScript"],["Schema validation","Enabled"],["Live database connection","Not configured"]].map(([label,value])=><div key={label} className="flex items-center justify-between gap-4 py-3"><span className="text-xs text-muted">{label}</span><span className="text-xs font-medium">{value}</span></div>)}</div></section>
  </div>;
}