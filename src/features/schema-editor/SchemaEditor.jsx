import React, { useCallback, useMemo, useState } from "react";
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, BackgroundVariant, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import { Braces, Check, ChevronDown, CircleHelp, Code2, Copy, Database, GitBranch, Grip, Plus, Search, Settings2, Sparkles, Trash2, ZoomIn } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import EntityNode from "../entities/EntityNode";
import { makeField, safeName, validateSchema } from "../../lib/schema";

const nodeTypes = { entity: EntityNode };
const types = ["String", "Number", "Boolean", "Date", "ObjectId", "Mixed", "Array"];

export default function SchemaEditor({ nodes, setNodes, edges, setEdges, projectName, setProjectName, database, setDatabase, setPage, showToast }) {
  const [selectedId, setSelectedId] = useState("user");
  const [modal, setModal] = useState("");
  const [entityName, setEntityName] = useState("");
  const [search, setSearch] = useState("");
  const [relationType, setRelationType] = useState("one-to-many");
  const [showMinimap, setShowMinimap] = useState(false);
  const selected = nodes.find((node) => node.id === selectedId) || null;
  const errors = useMemo(() => validateSchema(nodes, edges), [nodes, edges]);
  // Apply every React Flow node change (dragging, position, selection, dimensions, removal).
  // Handling only position/removal manually can cause nodes to jump or disappear while dragging.
  const onNodesChange = useCallback((changes) => {
    if (changes.some((change) => change.type === "remove" && change.id === selectedId)) {
      setSelectedId("");
    }
    setNodes((current) => applyNodeChanges(changes, current));
  }, [setNodes, selectedId]);

  // Keep edge state in sync with React Flow so relationship edits/removals are reliable.
  const onEdgesChange = useCallback((changes) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  }, [setEdges]);
  const onConnect = useCallback((connection) => {
    const edge = { ...connection, id: crypto.randomUUID(), type: "smoothstep", label: relationType, style: { stroke: "#9aa9a0", strokeWidth: 1.5 }, labelStyle: { fill: "#758079", fontSize: 11 }, labelBgStyle: { fill: "#f7f9f7", fillOpacity: .96 }, labelBgPadding: [7, 4], labelBgBorderRadius: 5 };
    setEdges((current) => addEdge(edge, current));
    showToast("Relationship connected");
  }, [setEdges, relationType, showToast]);
  const addEntity = () => {
    const name = safeName(entityName || `Entity${nodes.length + 1}`);
    const id = `${name.toLowerCase()}-${crypto.randomUUID().slice(0, 5)}`;

    setNodes((current) => [
      ...current,
      {
        id,
        type: "entity",
        position: {
          x: 100 + (current.length % 3) * 330,
          y: 100 + Math.floor(current.length / 3) * 250,
        },
        data: {
          name,
          fields: [
            makeField("id", "String"),
            makeField("createdAt", "Date"),
          ],
        },
      },
    ]);

    setSelectedId(id);
    setEntityName("");
    setModal("");
    showToast("Entity created");
  };
  const updateSelected = (patch) => setNodes((current) => current.map((node) => node.id === selectedId ? { ...node, data: { ...node.data, ...patch } } : node));
  const updateField = (fieldId, patch) => updateSelected({ fields: selected.data.fields.map((field) => field.id === fieldId ? { ...field, ...patch } : field) });
  const addField = () => {
    if (!selected) return;
    updateSelected({ fields: [...selected.data.fields, makeField(`field${selected.data.fields.length + 1}`)] });
  };
  const deleteSelected = () => {
    if (!selected) return;
    setNodes((current) => current.filter((node) => node.id !== selectedId));
    setEdges((current) => current.filter((edge) => edge.source !== selectedId && edge.target !== selectedId));
    setSelectedId(""); showToast("Entity deleted");
  };
  const filteredNodes = nodes.filter((node) => node.data.name.toLowerCase().includes(search.toLowerCase()));
  return <div className="flex h-[calc(100vh-108px)] min-h-[610px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"><GitBranch size={17}/></div><div className="min-w-0"><input aria-label="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full max-w-[240px] truncate bg-transparent text-sm font-semibold outline-none focus:text-accent"/><p className="mt-0.5 text-[10px] text-muted">Schema workspace <span className="mx-1">/</span> {nodes.length} entities</p></div></div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-9 items-center gap-2 rounded-xl border border-line bg-white px-2.5"><Database size={14} className="text-muted"/><select aria-label="Database target" value={database} onChange={(e) => setDatabase(e.target.value)} className="max-w-[125px] bg-transparent text-xs font-medium outline-none"><option>MongoDB</option><option>PostgreSQL</option></select><ChevronDown size={12} className="text-muted"/></div>
        <Button size="sm" onClick={() => setModal("entity")}><Plus size={14}/> Add entity</Button>
        <Button size="sm" variant="primary" onClick={() => setPage("code")}><Code2 size={14}/> Generate code</Button>
      </div>
    </div>
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-line bg-[#fcfdfc] lg:flex">
        <div className="border-b border-line p-4"><div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-semibold">Entities <span className="ml-1 text-muted">{nodes.length}</span></p><button onClick={() => setModal("entity")} className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink" aria-label="Add entity"><Plus size={14}/></button></div><div className="flex h-8 items-center gap-2 rounded-lg border border-line bg-white px-2"><Search size={13} className="text-muted"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find entity..." className="w-full bg-transparent text-[11px] outline-none"/></div></div>
        <div className="flex-1 overflow-y-auto p-2">
          {filteredNodes.map((node) => <button key={node.id} onClick={() => setSelectedId(node.id)} className={`mb-1 flex w-full items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${selectedId === node.id ? "border-[#cbded1] bg-accent-soft" : "border-transparent hover:border-line hover:bg-white"}`}><span className={`flex h-7 w-7 items-center justify-center rounded-lg ${selectedId === node.id ? "bg-white text-accent" : "bg-[#f0f3f0] text-muted"}`}><Braces size={14}/></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{node.data.name}</span><span className="mt-0.5 block text-[10px] text-muted">{node.data.fields.length} fields</span></span><Grip size={12} className="text-[#b4beb6]"/></button>)}
          {filteredNodes.length === 0 && <p className="px-3 py-5 text-center text-xs text-muted">No entities found.</p>}
        </div>
        <div className="border-t border-line p-3"><div className="rounded-xl bg-white p-3"><p className="flex items-center gap-2 text-[10px] font-semibold"><CircleHelp size={13} className="text-accent"/> Quick tip</p><p className="mt-1.5 text-[10px] leading-4 text-muted">Drag a connection handle from one entity to another to create a relationship.</p></div></div>
      </aside>
      <div className="relative min-w-0 flex-1 bg-[#f9fbf9]">
        <div className="pointer-events-none absolute inset-0 z-0" />
        <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white/95 px-3 py-2 shadow-sm backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/><span className="text-[10px] font-medium text-[#69756c]">Canvas ready</span><span className="h-3 w-px bg-line"/><span className="text-[10px] text-muted">{edges.length} relationships</span><span className="h-3 w-px bg-line"/><label className="text-[10px] text-muted" htmlFor="relationship-type">Type</label><select id="relationship-type" aria-label="Relationship type" value={relationType} onChange={(event) => setRelationType(event.target.value)} className="max-w-[118px] bg-transparent text-[10px] font-medium text-[#526158] outline-none"><option value="one-to-one">One-to-one</option><option value="one-to-many">One-to-many</option><option value="many-to-many">Many-to-many</option></select></div>
        <div className="absolute right-4 top-4 z-10 flex gap-1 rounded-xl border border-line bg-white p-1 shadow-sm"><button title="Toggle minimap" onClick={() => setShowMinimap((v) => !v)} className={`flex h-7 w-7 items-center justify-center rounded-lg ${showMinimap ? "bg-accent-soft text-accent" : "text-muted hover:bg-canvas"}`}><ZoomIn size={14}/></button><button title="Add entity" onClick={() => setModal("entity")} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-canvas"><Plus size={14}/></button></div>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={(_, node) => setSelectedId(node.id)} onPaneClick={() => setSelectedId("")} fitView fitViewOptions={{ padding: .2 }} minZoom={.25} maxZoom={1.5} deleteKeyCode={null} proOptions={{ hideAttribution: true }}>
          <Background variant={BackgroundVariant.Dots} gap={19} size={1} color="#dfe6e0"/>
          <Controls position="bottom-left" showInteractive={false} className="!overflow-hidden !rounded-xl !border-line !bg-white !shadow-sm [&>button]:!border-line [&>button]:!fill-[#758079]"/>
          {showMinimap && <MiniMap position="bottom-right" pannable zoomable nodeColor="#c7dbcc" maskColor="rgba(247,249,247,0.65)" className="!rounded-xl !border-line !bg-white"/>}
        </ReactFlow>
        {nodes.length === 0 && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"><div className="rounded-2xl border border-line bg-white p-8 text-center shadow-soft"><Braces className="mx-auto mb-3 text-accent" size={25}/><p className="text-sm font-semibold">Your canvas is ready</p><p className="mt-1 text-xs text-muted">Create your first entity to get started.</p></div></div>}
        <div className="absolute bottom-4 right-4 z-10 hidden items-center gap-2 rounded-lg border border-line bg-white/90 px-3 py-2 text-[10px] text-muted sm:flex"><span className="font-medium text-[#526158]">Tip</span> Select a card to edit its fields</div>
      </div>
      <aside className="hidden w-[282px] shrink-0 flex-col border-l border-line bg-white xl:flex">
        <div className="flex items-center justify-between border-b border-line px-4 py-4"><div><p className="text-xs font-semibold">Entity properties</p><p className="mt-1 text-[10px] text-muted">Configure fields and types</p></div><Settings2 size={16} className="text-muted"/></div>
        {selected ? <div className="flex-1 overflow-y-auto p-4">
          <label className="mb-1.5 block text-[10px] font-semibold text-[#657169]">ENTITY NAME</label><input value={selected.data.name} onChange={(e) => updateSelected({ name: e.target.value })} className="h-9 w-full rounded-lg border border-line px-3 text-xs outline-none transition focus:border-accent"/>
          <div className="mb-2 mt-6 flex items-center justify-between"><p className="text-[11px] font-semibold">Fields <span className="ml-1 text-muted">{selected.data.fields.length}</span></p><button onClick={addField} className="flex h-7 items-center gap-1 rounded-lg px-2 text-[10px] font-semibold text-accent hover:bg-accent-soft"><Plus size={12}/> Add field</button></div>
          <div className="space-y-2">
            {selected.data.fields.map((field) => <div key={field.id} className="rounded-xl border border-line p-2.5">
              <div className="flex items-center gap-1.5"><input aria-label="Field name" value={field.name} onChange={(e) => updateField(field.id, { name: e.target.value })} className="h-7 min-w-0 flex-1 rounded-md bg-canvas px-2 text-[11px] font-medium outline-none focus:ring-1 focus:ring-accent/30"/><button title="Remove field" onClick={() => updateSelected({ fields: selected.data.fields.filter((f) => f.id !== field.id) })} className="flex h-7 w-7 items-center justify-center rounded-md text-[#a1aaa4] hover:bg-rose-50 hover:text-rose-500"><Trash2 size={12}/></button></div>
              <select aria-label="Field data type" value={field.type} onChange={(e) => updateField(field.id, { type: e.target.value })} className="mt-2 h-7 w-full rounded-md border border-line bg-white px-2 text-[10px] text-muted outline-none">{types.map((type) => <option key={type}>{type}</option>)}</select>
              <div className="mt-2 flex gap-3"><label className="flex items-center gap-1.5 text-[10px] text-muted"><input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })} className="accent-accent"/> Required</label><label className="flex items-center gap-1.5 text-[10px] text-muted"><input type="checkbox" checked={field.unique} onChange={(e) => updateField(field.id, { unique: e.target.checked })} className="accent-accent"/> Unique</label></div>
            </div>)}
          </div>
          <div className="mt-6 rounded-xl border border-[#e3eee6] bg-[#f7fbf8] p-3"><p className="flex items-center gap-2 text-[10px] font-semibold text-accent"><Sparkles size={13}/> Schema check</p>{errors.length ? <p className="mt-2 text-[10px] leading-4 text-rose-600">{errors[0]}</p> : <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#64776a]"><Check size={12}/> No structural issues found.</p>}</div>
          <Button variant="danger" className="mt-4 w-full" onClick={deleteSelected}><Trash2 size={13}/> Delete entity</Button>
        </div> : <div className="flex flex-1 flex-col items-center justify-center px-7 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-[#a1aaa4]"><Braces size={20}/></div><p className="text-xs font-semibold">Nothing selected</p><p className="mt-1.5 text-[11px] leading-5 text-muted">Select an entity card on the canvas to edit its fields.</p></div>}
        <div className="border-t border-line p-3"><Button className="w-full" variant="primary" onClick={() => setPage("code")}><Code2 size={14}/> Preview generated code</Button></div>
      </aside>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-white px-4 py-2.5 text-[10px] text-muted sm:px-5"><div className="flex items-center gap-3"><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Autosaved locally</span><span className="hidden sm:inline">·</span><span className="hidden sm:inline">{nodes.length} entities / {edges.length} relationships</span></div><button onClick={() => setPage("code")} className="flex items-center gap-1.5 font-semibold text-accent hover:underline">Review schema <Code2 size={12}/></button></div>
    {modal === "entity" && <Modal title="Create an entity" description="Entities represent the main objects in your application." onClose={() => setModal("")} footer={<><Button onClick={() => setModal("")}>Cancel</Button><Button variant="primary" onClick={addEntity}><Plus size={14}/> Create entity</Button></>}><label className="mb-1.5 block text-xs font-medium">Entity name</label><input autoFocus value={entityName} onChange={(e) => setEntityName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addEntity()} placeholder="e.g. Customer, Product, Invoice" className="h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-accent"/><p className="mt-2 text-[11px] text-muted">Start with a singular noun, like User or Product.</p></Modal>}
  </div>;
}