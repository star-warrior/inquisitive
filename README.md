# 🔮 Inquisitive — AI-Powered Dynamic Knowledge Mapping

Inquisitive is a state-of-the-art greenfield workspace built to structure dynamic, AI-enriched mindmaps and research notebooks. Powered by **Express.js**, **React 18**, **TypeScript**, **Vite**, **Groq (Llama 3.3)**, and **Tavily Search**, it enables recursive branching research logs.

This repository is architected as a highly modular monorepo using **npm Workspaces**.

---

## 🏗️ Monorepo Architecture

```
inquisitive/
├── packages/
│   ├── frontend/             # React.js SPA (Vite)
│   │   ├── src/              # App.tsx, index.css, main.tsx
│   │   ├── package.json      # Frontend-specific scripts & assets
│   │   └── vite.config.ts    # Dev proxy server to port 3001
│   ├── backend/              # Node.js Express API
│   │   ├── src/              # index.ts REST router and simulated AI planner
│   │   ├── package.json      # Express, CORS, and ts-node-dev scripts
│   │   └── tsconfig.json     # NodeNext TS rules
│   └── shared/               # Shared TS types, utils, and schemas
│       ├── src/              # index.ts Zod schemas & inferred types
│       ├── package.json      # Bundler for shared modules
│       └── tsconfig.json     # Strict TS modules compiler
├── package.json              # Monorepo root configuration (npm workspaces)
├── tsconfig.base.json        # Unified TypeScript base compiler settings
└── README.md                 # Project handbook & system guides
```

### Key Modules

1. **`@inquisitive/shared`**  
   The single-source-of-truth containing structural Zod schemas and inferred TypeScript types representing `Notebooks`, `ResearchNodes`, and `ResearchResources`. Shared seamlessly between client and server, guaranteeing total type-safety.

2. **`@inquisitive/backend`**  
   A lightning-fast REST API server built on Node.js and Express. It parses request bodies using Zod schemas from the shared module and exposes endpoints for workspace notebook curation and recursive AI search simulation.

3. **`@inquisitive/frontend`**  
   A beautiful, high-fidelity Single Page Application engineered with React 18, Vite, Lucide React icons, and a custom **Glassmorphic Vanilla CSS** theme with dynamic glowing effects. Integrates directly with the backend with full offline-resilient simulators.

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** 20.x (LTS) or higher
- **npm** 10.x or higher

### 1. Installation
Install all workspaces dependencies concurrently from the root directory:
```bash
npm install
```

### 2. Development Mode
Run the backend Express API and the Vite frontend application simultaneously in hot-reloading development mode:
```bash
npm run dev
```
- **Frontend Workspace:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001](http://localhost:3001)

### 3. Build & Production Pack
Compile and transpile the entire monorepo stack:
```bash
npm run build
```

---

## 🚀 Unified Scripts Index

These scripts can be executed directly from the monorepo root:

| Command | Action | Scope |
| :--- | :--- | :--- |
| `npm run dev` | Boots both the API server (3001) and Frontend portal (3000) simultaneously with live reloading. | All Workspaces |
| `npm run build` | Transpiles TypeScript modules and builds optimized client assets. | All Workspaces |
| `npm run dev:frontend` | Direct boot of the React + Vite frontend environment. | `@inquisitive/frontend` |
| `npm run dev:backend` | Direct boot of the Express + ts-node API environment. | `@inquisitive/backend` |
| `npm run build:shared` | Transpiles shared Zod schemas to clean JS declarations. | `@inquisitive/shared` |

---

## 🎨 Premium Visual Specs (Vanilla CSS)
The frontend utilizes a customized, highly performant **Glassmorphic styling system** using custom-tailored CSS.
- **Color System:** Elegant space deep-navy bases (`#080b11`), glowing violet key accents (`#7c3aed`), and vibrant teal indicators (`#06b6d4`).
- **Typography:** Highly readable header elements utilizing **Outfit** and beautiful bodies in **Plus Jakarta Sans**.
- **Special Effects:** Radial ambient back-glows, custom responsive panels with backing micro-shadows, pulsing status nodes, and dynamic hover animations.
