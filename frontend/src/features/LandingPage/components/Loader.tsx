import React, { useState, useEffect } from "react";
import axios from "axios";
import heroBg from "../../../assets/images/hero-page.png";
import loaderGif from "../../../assets/gif/loader_gif.gif";

interface LoaderProps {
  onReady: () => void;
}

export default function Loader({ onReady }: LoaderProps) {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing Inquisitive...");

  useEffect(() => {
    let active = true;
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const checkHealth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        if (response.status === 200 && response.data?.status === "OK") {
          if (active) {
            setIsBackendReady(true);
          }
        } else {
          if (active) {
            setTimeout(checkHealth, 1500);
          }
        }
      } catch (err) {
        if (active) {
          setTimeout(checkHealth, 1500);
        }
      }
    };

    checkHealth();

    // Preload hero image
    const img = new Image();
    img.src = heroBg;
    img.onload = () => {
      if (active) {
        setIsHeroImageLoaded(true);
      }
    };
    img.onerror = () => {
      // Don't block forever if image fails to load
      if (active) {
        setIsHeroImageLoaded(true);
      }
    };

    // Cycle messages to keep user informed
    const messages = [
      "Waking up learning servers...",
      "Establishing secure lanes...",
      "Preloading high-fidelity assets...",
      "Preparing your interactive workbench...",
      "Booting learning recommendation engines..."
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      if (active) {
        setLoadingText(messages[msgIdx]);
        msgIdx = (msgIdx + 1) % messages.length;
      }
    }, 2500);

    return () => {
      active = false;
      clearInterval(msgInterval);
    };
  }, []);

  // When both the backend is online and the hero image is loaded, trigger onReady
  useEffect(() => {
    if (isBackendReady && isHeroImageLoaded) {
      onReady();
    }
  }, [isBackendReady, isHeroImageLoaded, onReady]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bento-warm text-[var(--bento-text-title)] font-sora select-none overflow-hidden">
      {/* Editorial Grid pattern */}
      <div className="absolute inset-0 editorial-grid opacity-100 pointer-events-none" />

      {/* Abstract Glowing Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="max-w-md w-full px-6 flex flex-col items-center text-center space-y-12 relative z-10">
        {/* GIF Loader */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <img
            src={loaderGif}
            alt="Loading..."
            className="w-28 h-28 object-contain"
          />
        </div>

        {/* Informative Text Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--bento-text-title)] tracking-tight">
            Inquisitive
          </h2>

          {/* Carousel Status Update Banner */}
          <div className="h-16 flex items-center justify-center px-4">
            <p className="text-sm font-medium text-[var(--bento-text-body)] italic leading-relaxed transition-all duration-500 animate-drop-in">
              {loadingText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
