import React, { useEffect, useState } from "react";
import { Bell, ChevronDown, Menu, Search, Workflow } from "lucide-react";
import Sidebar from "./components/layout/Sidebar";
import Button from "./components/ui/Button";
import Modal from "./components/ui/Modal";
import Dashboard from "./features/dashboard/Dashboard";
import Preferences from "./features/dashboard/Preferences";
import SchemaEditor from "./features/schema-editor/SchemaEditor";
import CodePreview from "./features/code-generator/CodePreview";
import DatabaseSettings from "./features/database-config/DatabaseSettings";
import { initialEdges, initialEntities } from "./lib/schema";

const STORAGE_KEY = "schema-studio-v1";
const pageTitles = { dashboard: "Overview", editor: "Schema editor", code: "Generated code", database: "Database setup", settings: "Preferences" };

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

export default function App() {
  const [initial] = useState(loadState);
  const [nodes, setNodes] = useState(initial?.nodes || initialEntities);
  const [edges, setEdges] = useState(initial?.edges || initialEdges);
  const [database, setDatabase] = useState(initial?.database || "MongoDB");
  const [projectName, setProjectName] = useState(initial?.projectName || "My first schema");
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [toast, setToast] = useState("");
  const [savedAt, setSavedAt] = useState("Saved locally");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, database, projectName }));
      setSavedAt("Saved locally");
    } catch { setSavedAt("Local save unavailable"); }
  }, [nodes, edges, database, projectName]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const createProject = () => {
    setProjectName(draftName.trim() || "Untitled schema");
    setNodes([]); setEdges([]); setDraftName(""); setNewProjectOpen(false); setPage("editor");
    setToast("New project created");
  };

  return <div className="min-h-screen bg-canvas text-ink">
    <div className="flex min-h-screen">
      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-canvas md:hidden" aria-label="Open navigation"><Menu size={19}/></button><div className="min-w-0"><div className="flex items-center gap-2"><span className="hidden text-xs text-muted sm:inline">Workspace</span><span className="hidden text-xs text-[#bdc5bf] sm:inline">/</span><span className="truncate text-sm font-semibold">{pageTitles[page]}</span></div><p className="mt-1 truncate text-[10px] text-muted">{page === "editor" ? projectName : "Design your data. Build with confidence."}</p></div></div>
          <div className="flex items-center gap-2 sm:gap-3"><div className="hidden items-center gap-2 rounded-lg border border-line bg-canvas px-2.5 py-2 lg:flex"><Search size={13} className="text-muted"/><span className="text-[10px] text-muted">Private workspace</span><span className="rounded border border-line bg-white px-1 text-[9px] text-muted">LOCAL</span></div><button onClick={() => setToast(savedAt)} title={savedAt} className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white text-muted hover:bg-canvas"><Bell size={16}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500"/></button><div className="flex h-9 items-center gap-2 rounded-xl border border-line bg-white px-2.5"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e6ece7] text-[10px] font-semibold text-[#526158]">S</span><ChevronDown size={13} className="text-muted"/></div></div>
        </header>
        <div className={`p-4 sm:p-6 lg:p-9 ${page === "editor" ? "pb-5" : ""}`}>
          {page === "dashboard" && <Dashboard projectName={projectName} setProjectName={setProjectName} setPage={setPage} nodes={nodes} database={database} onNewProject={() => { setDraftName(""); setNewProjectOpen(true); }}/>}
          {page === "editor" && <SchemaEditor nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} projectName={projectName} setProjectName={setProjectName} database={database} setDatabase={setDatabase} setPage={setPage} showToast={setToast}/>}
          {page === "code" && <CodePreview nodes={nodes} edges={edges} database={database} setPage={setPage} showToast={setToast}/>}
          {page === "database" && <DatabaseSettings database={database} setDatabase={setDatabase} showToast={setToast}/>}
          {page === "settings" && <Preferences showToast={setToast}/>}
          {page !== "editor" && <footer className="mx-auto mt-10 flex max-w-[1180px] flex-wrap items-center justify-between gap-2 border-t border-line pt-5 text-[10px] text-muted"><span>Schema Studio <span className="mx-1.5 text-[#c1c9c2]">·</span> A calmer way to model data.</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>{savedAt}</span></footer>}
        </div>
      </main>
    </div>
    {newProjectOpen && <Modal title="Create a project" description="Give your schema a name. You can choose a database inside the editor." onClose={() => setNewProjectOpen(false)} footer={<><Button onClick={() => setNewProjectOpen(false)}>Cancel</Button><Button variant="primary" onClick={createProject}><Workflow size={14}/> Create project</Button></>}><label className="mb-1.5 block text-xs font-medium">Project name</label><input autoFocus value={draftName} onChange={(e) => setDraftName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && createProject()} placeholder="e.g. Store API, Learning platform" className="h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-accent"/><p className="mt-2 text-[11px] text-muted">Use a name that describes the backend you're building.</p></Modal>}
    {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-ink px-4 py-3 text-xs font-medium text-white shadow-xl"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/></span>{toast}</div>}
  </div>;
}