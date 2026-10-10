import React, { useMemo, useState } from "react";
import { AlertCircle, Check, Clipboard, Code2, Download, FileCode2, FileText, RefreshCw, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import { generateCode, validateSchema } from "../../lib/schema";

export default function CodePreview({ nodes, edges, database, setPage, showToast }) {
  const [activeFile, setActiveFile] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const errors = validateSchema(nodes, edges);
  const code = useMemo(() => generateCode(nodes, edges, database), [nodes, edges, database]);
  const files = database === "MongoDB"
    ? nodes.map((node) => ({ name: `${node.data.name.replace(/[^a-zA-Z0-9]/g, "") || "model"}.model.js`, code: generateCode([node], edges, database) }))
    : [{ name: "schema.prisma", code }];
  const current = files[Math.min(activeFile, Math.max(0, files.length - 1))];
  const copy = async () => {
    try { await navigator.clipboard.writeText(current?.code || code); showToast("Code copied to clipboard"); }
    catch { showToast("Clipboard access unavailable. Select and copy the code."); }
  };
  const download = () => {
    const blob = new Blob([current?.code || code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = current?.name || "schema.txt"; a.click(); URL.revokeObjectURL(url);
    showToast("File download started");
  };
  const lines = (current?.code || "").split("\n");
  return <div className="mx-auto max-w-[1180px]">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-medium text-accent">CODE GENERATOR</p><h1 className="text-[28px] font-semibold tracking-[-.045em] sm:text-[32px]">Generated code</h1><p className="mt-2 text-sm text-muted">Review the output for your selected database.</p></div><div className="flex flex-wrap gap-2"><Button onClick={() => setPage("editor")}>Back to editor</Button><Button variant="primary" onClick={download}><Download size={15}/> Download file</Button></div></div>
    {showNotes && <div className="mb-5 flex gap-3 rounded-2xl border border-[#e3eee6] bg-[#f7fbf8] p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-accent"><Sparkles size={17}/></div><div className="flex-1"><p className="text-xs font-semibold">Schema translated into {database}</p><p className="mt-1 text-xs leading-5 text-muted">This preview is generated locally from your current entities. Review database-specific relations and defaults before using it in production.</p></div><button onClick={() => setShowNotes(false)} className="text-[10px] text-muted hover:text-ink">Dismiss</button></div>}
    <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
      <aside className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="border-b border-line px-4 py-4"><p className="text-xs font-semibold">Project files</p><p className="mt-1 text-[10px] text-muted">{files.length} generated {files.length === 1 ? "file" : "files"}</p></div>
        <div className="p-2">
          {files.map((file, i) => <button key={file.name} onClick={() => setActiveFile(i)} className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left ${activeFile === i ? "bg-accent-soft text-accent" : "text-[#667269] hover:bg-canvas"}`}><FileCode2 size={15}/><span className="min-w-0 flex-1 truncate text-[11px] font-medium">{file.name}</span>{activeFile === i && <span className="h-1.5 w-1.5 rounded-full bg-accent"/>}</button>)}
          {files.length === 0 && <p className="p-3 text-xs text-muted">Add an entity to generate a file.</p>}
        </div>
        <div className="border-t border-line p-4"><p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted">Target</p><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-canvas"><Code2 size={15} className="text-accent"/></span><div><p className="text-xs font-semibold">{database}</p><p className="mt-0.5 text-[10px] text-muted">{database === "MongoDB" ? "Mongoose · JavaScript" : "Prisma · schema"}</p></div></div></div>
      </aside>
      <section className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3"><div className="flex items-center gap-2.5"><FileText size={16} className="text-muted"/><span className="text-xs font-semibold">{current?.name || "No file selected"}</span><span className="rounded-md bg-canvas px-2 py-1 text-[9px] text-muted">{database === "MongoDB" ? "JAVASCRIPT" : "PRISMA"}</span></div><div className="flex gap-1.5"><Button size="sm" onClick={copy}><Clipboard size={13}/> Copy</Button><Button size="sm" variant="ghost" onClick={() => { setActiveFile(0); showToast("Preview refreshed"); }}><RefreshCw size={13}/></Button></div></div>
        {errors.length > 0 && <div className="flex items-start gap-2 border-b border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800"><AlertCircle size={15} className="mt-0.5 shrink-0"/><div><p className="font-semibold">Review schema warnings</p><p className="mt-1">{errors.slice(0, 3).join(" ")}</p></div></div>}
        <div className="code-scroll overflow-auto bg-[#fbfcfb] py-4">
          {lines.map((line, i) => <div key={i} className="flex min-h-[23px] text-[11px] leading-[23px] hover:bg-[#f2f6f3]"><span className="sticky left-0 w-12 shrink-0 select-none border-r border-line bg-[#fbfcfb] pr-3 text-right font-mono text-[#a2aca5]">{i + 1}</span><pre className="min-w-0 whitespace-pre px-4 font-mono text-[#425148]">{line || " "}</pre></div>)}
          {lines.length <= 1 && !lines[0] && <div className="p-10 text-center text-xs text-muted">No code yet. Add an entity in the editor.</div>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3"><span className="text-[10px] text-muted">{lines.length} lines · {nodes.length} entities · Local preview</span><span className="flex items-center gap-1.5 text-[10px] text-[#678071]"><Check size={12}/> Ready to review</span></div>
      </section>
    </div>
    <div className="mt-5 rounded-2xl border border-line bg-white p-5"><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-canvas text-muted"><AlertCircle size={17}/></div><div><p className="text-xs font-semibold">Before you ship</p><p className="mt-1 text-xs leading-5 text-muted">This MVP produces a local deterministic preview, not AI-verified production code. Check relation mappings, migrations, naming conventions, and database-specific constraints before using generated files in an application.</p></div></div></div>
  </div>;
}