import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";

function getOrCreateUUID() {
  let useruuid = localStorage.getItem("useruuid");
  if (!useruuid) {
    useruuid = uuid();
    localStorage.setItem("useruuid", useruuid);
  }

  console.log(useruuid);
  return useruuid;
}

export default function App() {
  useEffect(() => {
    getOrCreateUUID();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
          Inquisitive Client Workspace
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Monorepo structure successfully initialized.
        </p>
      </div>
    </div>
  );
}
