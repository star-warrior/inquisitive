import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import posthog from "posthog-js";
import { getOrCreateUUID } from "./lib/device";
import HomePage from "./pages/HomePage";
import NotebookPage from "./pages/NotebookPage";
import LandingPage from "./pages/LandingPage";
import HowToPage from "./pages/HowToPage";
import NotFoundPage from "./pages/NotFoundPage";

function PostHogPageView() {
  const location = useLocation();
  useEffect(() => {
    posthog.capture("$pageview");
  }, [location]);
  return null;
}

export default function App() {
  useEffect(() => {
    const deviceId = getOrCreateUUID();
    posthog.identify(deviceId);
  }, []);

  return (
    <BrowserRouter>
      <PostHogPageView />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-to" element={<HowToPage />} />
        <Route path="/app" element={<HomePage />} />
        <Route path="/notebook/:notebookId" element={<NotebookPage />} />
        <Route path="/notebooks/:id" element={<NotebookPage />} />
        {/* Fallback wildcard router */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
