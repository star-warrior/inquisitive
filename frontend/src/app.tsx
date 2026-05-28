import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getOrCreateUUID } from "./lib/device";
import HomePage from "./pages/HomePage";
import NotebookPage from "./pages/NotebookPage";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  useEffect(() => {
    getOrCreateUUID();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<HomePage />} />
        <Route path="/notebook/:notebookId" element={<NotebookPage />} />
        <Route path="/notebooks/:id" element={<NotebookPage />} />
        {/* Fallback wildcard router */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
