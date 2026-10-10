export const makeField = (name = "newField", type = "String") => ({
  id: crypto.randomUUID(), name, type, required: false, unique: false
});

export const initialEntities = [
  {
    id: "user", type: "entity", position: { x: 90, y: 110 },
    data: { name: "User", fields: [
      { id: "u1", name: "_id", type: "ObjectId", required: true, unique: true },
      { id: "u2", name: "fullName", type: "String", required: true, unique: false },
      { id: "u3", name: "email", type: "String", required: true, unique: true },
      { id: "u4", name: "createdAt", type: "Date", required: true, unique: false }
    ]}
  },
  {
    id: "order", type: "entity", position: { x: 490, y: 230 },
    data: { name: "Order", fields: [
      { id: "o1", name: "_id", type: "ObjectId", required: true, unique: true },
      { id: "o2", name: "userId", type: "ObjectId", required: true, unique: false },
      { id: "o3", name: "total", type: "Number", required: true, unique: false },
      { id: "o4", name: "status", type: "String", required: true, unique: false }
    ]}
  }
];

export const initialEdges = [{
  id: "user-order", source: "user", target: "order",
  type: "smoothstep", animated: false,
  label: "one-to-many",
  style: { stroke: "#9aa9a0", strokeWidth: 1.5 },
  labelStyle: { fill: "#758079", fontSize: 11 },
  labelBgStyle: { fill: "#f7f9f7", fillOpacity: 0.96 },
  labelBgPadding: [7, 4], labelBgBorderRadius: 5
}];

export const safeName = (value) => {
  const clean = value.trim().replace(/[^a-zA-Z0-9_]/g, "");
  return clean || "Untitled";
};

export function validateSchema(nodes, edges) {
  const errors = [];
  const names = new Set();
  nodes.forEach((node) => {
    const name = node.data.name.trim();
    if (!name) errors.push("An entity is missing a name.");
    const key = name.toLowerCase();
    if (names.has(key)) errors.push(`Entity name "${name}" is duplicated.`);
    names.add(key);
    const fieldNames = new Set();
    node.data.fields.forEach((field) => {
      if (!field.name.trim()) errors.push(`${name || "Entity"} has a field without a name.`);
      const fieldKey = field.name.toLowerCase();
      if (fieldNames.has(fieldKey)) errors.push(`${name}: field "${field.name}" is duplicated.`);
      fieldNames.add(fieldKey);
    });
  });
  edges.forEach((edge) => {
    if (!nodes.some((n) => n.id === edge.source) || !nodes.some((n) => n.id === edge.target)) {
      errors.push("A relationship references an entity that no longer exists.");
    }
  });
  return [...new Set(errors)];
}

const mongoType = (type) => ({
  String: "String", Number: "Number", Boolean: "Boolean", Date: "Date",
  ObjectId: "mongoose.Schema.Types.ObjectId", Mixed: "mongoose.Schema.Types.Mixed",
  Array: "[mongoose.Schema.Types.Mixed]"
}[type] || "String");

export function generateCode(nodes, edges, database) {
  if (database === "MongoDB") {
    return nodes.map((node) => {
      const name = safeName(node.data.name);
      const fields = node.data.fields.map((field) => {
        const opts = [`type: ${mongoType(field.type)}`];
        if (field.required) opts.push("required: true");
        if (field.unique) opts.push("unique: true");
        const refEdge = edges.find((edge) => edge.target === node.id && field.name.toLowerCase().endsWith("id"));
        if (refEdge && field.type === "ObjectId") {
          const source = nodes.find((n) => n.id === refEdge.source);
          if (source) opts.push(`ref: "${safeName(source.data.name)}"`);
        }
        return `  ${JSON.stringify(field.name)}: { ${opts.join(", ")} }`;
      }).join(",\n");
      return `import mongoose from "mongoose";\n\nconst ${name}Schema = new mongoose.Schema({\n${fields}\n}, { timestamps: true });\n\nexport default mongoose.model("${name}", ${name}Schema);\n`;
    }).join("\n// ─────────────────────────────────────────\n\n");
  }
  const blocks = nodes.map((node) => {
    const name = safeName(node.data.name);
    const fields = node.data.fields.map((field) => {
      const type = ({ String: "String", Number: "Float", Boolean: "Boolean", Date: "DateTime", ObjectId: "String", Mixed: "Json", Array: "Json" })[field.type] || "String";
      const isId = field.name === "id";
      const isMongoId = field.name === "_id";
      const dbName = isMongoId ? '@map("_id") ' : "";
      return `  ${field.name} ${type}${field.required || isId ? "" : "?"}${field.unique ? " @unique" : ""}${isId ? " @id @default(cuid())" : ""}${dbName}`;
    });
    if (!node.data.fields.some((field) => ["id", "_id"].includes(field.name))) fields.unshift("  id String @id @default(cuid())");
    return `model ${name} {\n${fields.join("\n")}\n}`;
  });
  return `// schema.prisma\n// Review relation fields and provider-specific types before production use.\n\n${blocks.join("\n\n")}\n`;
}