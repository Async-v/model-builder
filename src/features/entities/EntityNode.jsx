import React from "react";
import { Handle, Position } from "@xyflow/react";
import { KeyRound, ShieldCheck, MoreHorizontal, Braces } from "lucide-react";

export default function EntityNode({ data, selected }) {
  return <div className={`entity-node w-[258px] overflow-hidden rounded-2xl border bg-white transition-shadow ${selected ? "border-accent shadow-[0_0_0_3px_rgba(36,120,91,.10),0_8px_24px_rgba(23,33,29,.07)]" : "border-[#e2e8e3] shadow-[0_5px_18px_rgba(23,33,29,.045)]"}`}>
    <Handle id="top-target" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-[#7d9b8b]"/>
    <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent"><Braces size={16}/></div>
      <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-semibold text-ink">{data.name || "Untitled entity"}</div><div className="mt-0.5 text-[10px] text-muted">{data.fields.length} fields</div></div>
      <MoreHorizontal size={17} className="text-[#a0aaa3]"/>
    </div>
    <div className="px-2 py-1.5">
      {data.fields.slice(0, 7).map((field) => <div key={field.id} className="flex min-h-[30px] items-center gap-2 rounded-lg px-2 text-[11px] hover:bg-canvas">
        <span className={`w-4 shrink-0 ${field.name === "_id" || field.name === "id" ? "text-amber-600" : "text-[#a0aaa3]"}`}>{field.name === "_id" || field.name === "id" ? <KeyRound size={12}/> : field.unique ? <ShieldCheck size={12}/> : <span className="block h-1 w-1 rounded-full bg-[#b8c2bb]"/>}</span>
        <span className="min-w-0 flex-1 truncate font-medium text-[#47544b]">{field.name || "unnamed"}</span>
        <span className="rounded-md bg-[#f5f7f5] px-1.5 py-1 font-mono text-[9px] text-[#7a867e]">{field.type}</span>
        {field.required && <span className="text-[9px] text-rose-400">*</span>}
      </div>)}
      {data.fields.length > 7 && <div className="px-2 py-2 text-[10px] text-muted">+ {data.fields.length - 7} more fields</div>}
    </div>
    <div className="flex items-center justify-between border-t border-line bg-[#fbfcfb] px-4 py-2">
      <span className="text-[10px] text-muted">Entity</span><span className="rounded-md border border-line bg-white px-1.5 py-0.5 text-[9px] text-[#7a867e]">MODEL</span>
    </div>
    <Handle id="bottom-source" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-accent"/>
    <Handle id="left-target" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-[#7d9b8b]"/>
    <Handle id="right-source" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-accent"/>
  </div>;
}