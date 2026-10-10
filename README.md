# Schema Studio — Backend Model Builder

A minimal, responsive React + JavaScript + Tailwind starter for visually designing database models. It includes draggable entity cards, editable fields, relationship connections, database selection, schema validation, and a local demo code generator.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Included in this MVP

- Minimal dashboard and project creation
- Drag-and-drop schema canvas powered by React Flow
- Create, edit, duplicate, and delete entities
- Add and configure entity fields
- Connect entities and select relationship cardinality
- MongoDB / Mongoose and PostgreSQL / Prisma demo code output
- Schema validation and copy-to-clipboard
- Local browser persistence for the current schema
- Responsive layout and consistent design tokens

## Important scope note

This is a frontend MVP. The code generator is a deterministic local demo, not an AI integration. It does not call an AI provider or connect to a live database. To enable production AI generation, add a server API, validate the schema on the server, keep provider API keys in server environment variables, and return structured generated files. Never put secret API keys in frontend code.

## Project structure

```text
src/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── dashboard/
│   ├── entities/
│   ├── schema-editor/
│   ├── relationships/
│   ├── code-generator/
│   └── database-config/
├── hooks/
├── lib/
├── styles/
├── App.jsx
└── main.jsx
```
# model-builder
