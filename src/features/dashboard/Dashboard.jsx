import React from "react";
import { ArrowRight, ArrowUpRight, Clock3, Database, Plus, Sparkles, Workflow } from "lucide-react";
import Button from "../../components/ui/Button";

export default function Dashboard({ projectName, setProjectName, setPage, nodes, database, onNewProject }) {
  return <div className="mx-auto max-w-[1180px]">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-xs font-medium text-accent">YOUR WORKSPACE</p><h1 className="text-[28px] font-semibold tracking-[-.045em] sm:text-[32px]">Good to see you.</h1><p className="mt-2 text-sm text-muted">Bring your data models to life, one entity at a time.</p></div>
      <Button variant="primary" onClick={onNewProject}><Plus size={16}/> New project</Button>
    </div>
    <div className="mb-8 grid gap-3 sm:grid-cols-3">
      {[{label:"Total entities",value:nodes.length,sub:"In current schema",icon:Workflow},{label:"Database target",value:database,sub:"Active configuration",icon:Database},{label:"Workspace",value:"Local",sub:"Saved on this device",icon:Clock3}].map((item) => <div key={item.label} className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="mb-5 flex items-center justify-between"><span className="text-xs text-muted">{item.label}</span><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas text-[#7d8a80]"><item.icon size={16}/></span></div>
        <p className="text-[22px] font-semibold tracking-tight">{item.value}</p><p className="mt-1 text-[11px] text-muted">{item.sub}</p>
      </div>)}
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="text-sm font-semibold">Recent project</h2><p className="mt-1 text-xs text-muted">Pick up where you left off</p></div><span className="rounded-lg bg-accent-soft px-2.5 py-1 text-[10px] font-medium text-accent">Active</span></div>
        <button onClick={() => setPage("editor")} className="group flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[#fcfdfc]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-canvas text-accent"><Workflow size={21}/></div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{projectName}</p><p className="mt-1 text-xs text-muted">{nodes.length} entities · {database}</p><p className="mt-2 text-[10px] text-muted">Saved in this browser</p></div>
          <ArrowUpRight size={17} className="text-[#9aa59d] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>
        </button>
        <div className="border-t border-line px-5 py-3"><button onClick={() => setPage("editor")} className="inline-flex items-center gap-2 text-xs font-semibold text-accent">Open schema editor <ArrowRight size={14}/></button></div>
      </section>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f2ff] text-[#6d70b8]"><Sparkles size={18}/></div>
        <h2 className="text-sm font-semibold">From idea to schema</h2><p className="mt-2 text-xs leading-5 text-muted">Design entities visually, connect relationships, and prepare clean model code for your stack.</p>
        <div className="mt-5 space-y-3">
          {[["01","Create entities"],["02","Connect relationships"],["03","Generate model code"]].map(([n,label],i)=><button key={n} onClick={() => setPage(i === 2 ? "code" : "editor")} className="flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left transition-colors hover:border-[#cbd8cf] hover:bg-canvas"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-canvas text-[10px] font-semibold text-muted">{n}</span><span className="flex-1 text-xs font-medium">{label}</span><ArrowRight size={14} className="text-[#a2aca5]"/></button>)}
        </div>
      </section>
    </div>
    <div className="mt-8 flex items-center gap-3 rounded-xl border border-dashed border-[#d9e1da] bg-white/60 p-4"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent"><Sparkles size={15}/></div><p className="text-xs leading-5 text-muted">Start with the shape of your data. You can refine field types and relationships any time.</p><button onClick={() => setPage("editor")} className="ml-auto shrink-0 text-xs font-semibold text-accent">Get started</button></div>
  </div>;
}