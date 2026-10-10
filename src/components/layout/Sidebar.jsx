import React from "react";
import { Boxes, Code2, CircleHelp, Database, LayoutDashboard, Settings2, Workflow, X } from "lucide-react";

const nav = [
  { label: "Workspace", items: [{ label: "Overview", icon: LayoutDashboard, id: "dashboard" }, { label: "Schema editor", icon: Workflow, id: "editor" }, { label: "Generated code", icon: Code2, id: "code" }] },
  { label: "Manage", items: [{ label: "Database setup", icon: Database, id: "database" }, { label: "Preferences", icon: Settings2, id: "settings" }] }
];

export default function Sidebar({ page, setPage, mobileOpen, setMobileOpen }) {
  return <>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-ink/25 md:hidden" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-line bg-white transition-transform md:static md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-[76px] items-center justify-between border-b border-line px-6">
        <button className="flex items-center gap-3 text-left" onClick={() => setPage("dashboard")}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white"><Boxes size={19}/></span>
          <span><span className="block text-[15px] font-semibold tracking-tight">Schema Studio</span><span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[.16em] text-muted">Model builder</span></span>
        </button>
        <button className="md:hidden text-muted" onClick={() => setMobileOpen(false)} aria-label="Close sidebar"><X size={18}/></button>
      </div>
      <div className="px-3 py-6">
        {nav.map((group) => <div className="mb-7" key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#9aa39d]">{group.label}</p>
          {group.items.map(({ label, icon: Icon, id }) => <button key={id} onClick={() => { setPage(id); setMobileOpen(false); }} className={`mb-1 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors ${page === id ? "bg-accent-soft text-accent" : "text-[#69746d] hover:bg-canvas hover:text-ink"}`}><Icon size={17} strokeWidth={1.8}/>{label}{id === "code" && <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[10px] text-muted">NEW</span>}</button>)}
        </div>)}
      </div>
      <div className="mt-auto p-3">
        <div className="rounded-2xl border border-line bg-canvas p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-accent"><CircleHelp size={16}/></div>
          <p className="text-xs font-semibold">Need a hand?</p>
          <p className="mt-1 text-[11px] leading-4 text-muted">Keep your schema clear and your models consistent.</p>
          <button onClick={() => setPage("settings")} className="mt-3 text-xs font-semibold text-accent hover:underline">Explore settings ↗</button>
        </div>
        <div className="mt-4 flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6ece7] text-xs font-semibold text-[#526158]">S</div>
          <div className="min-w-0"><p className="truncate text-xs font-semibold">Local workspace</p><p className="mt-0.5 text-[10px] text-muted">Saved in this browser</p></div>
          <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500"/>
        </div>
      </div>
    </aside>
  </>;
}