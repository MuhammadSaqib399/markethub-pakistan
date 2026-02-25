"use client";

import { useState, useEffect, useRef } from "react";

export default function SplashIntro({ onComplete }) {
  const [phase, setPhase] = useState("typing-name"); // typing-name → typing-slogan → zoom → done
  const [nameText, setNameText] = useState("");
  const [sloganText, setSloganText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [zoomStart, setZoomStart] = useState(false);
  const phaseRef = useRef("typing-name");

  const BRAND_NAME = "ELYNDRA";
  const SLOGAN = "We won't praise it. You'll experience it.";

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  // Typing sequence
  useEffect(() => {
    let timeout;

    // Phase 1: Type the brand name
    if (phase === "typing-name") {
      let i = 0;
      const typeChar = () => {
        if (i < BRAND_NAME.length) {
          setNameText(BRAND_NAME.slice(0, i + 1));
          i++;
          timeout = setTimeout(typeChar, 120);
        } else {
          // Pause then start slogan
          timeout = setTimeout(() => {
            phaseRef.current = "typing-slogan";
            setPhase("typing-slogan");
          }, 400);
        }
      };
      timeout = setTimeout(typeChar, 600);
    }

    // Phase 2: Type the slogan
    if (phase === "typing-slogan") {
      let i = 0;
      const typeChar = () => {
        if (i < SLOGAN.length) {
          setSloganText(SLOGAN.slice(0, i + 1));
          i++;
          timeout = setTimeout(typeChar, 40);
        } else {
          // Pause then zoom
          timeout = setTimeout(() => {
            phaseRef.current = "zoom";
            setPhase("zoom");
            setZoomStart(true);
          }, 600);
        }
      };
      timeout = setTimeout(typeChar, 300);
    }

    // Phase 3: Zoom in and fade out
    if (phase === "zoom") {
      timeout = setTimeout(() => {
        phaseRef.current = "done";
        setPhase("done");
        onComplete();
      }, 1200);
    }

    return () => clearTimeout(timeout);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        zoomStart ? "opacity-0" : "opacity-100"
      }`}
      style={{ perspective: "1000px" }}
    >
      {/* Subtle background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-red-500/20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `splashFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content — zooms towards user */}
      <div
        className="relative text-center transition-all ease-in"
        style={{
          transform: zoomStart
            ? "scale(8) translateZ(500px)"
            : "scale(1) translateZ(0px)",
          transitionDuration: "1.2s",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: zoomStart ? 0 : 1,
        }}
      >
        {/* Brand Name */}
        <h1 className="brand-name text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
          {nameText.split("").map((char, i) => (
            <span
              key={i}
              className={`inline-block ${
                char === "E" || char === "D"
                  ? "text-red-500"
                  : "text-white"
              }`}
              style={{
                animation: `splashLetterPop 0.3s ease-out both`,
                animationDelay: `${i * 0.12 + 0.6}s`,
              }}
            >
              {char}
            </span>
          ))}
          {/* Typing cursor */}
          {phase === "typing-name" && (
            <span
              className={`inline-block w-[3px] sm:w-1 h-12 sm:h-16 lg:h-20 bg-red-500 ml-1 align-middle transition-opacity duration-100 ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </h1>

        {/* Slogan */}
        <div className="mt-4 sm:mt-6 min-h-[2rem] sm:min-h-[2.5rem]">
          {(phase === "typing-slogan" || phase === "zoom") && (
            <p className="brand-slogan text-sm sm:text-lg lg:text-xl text-white/70 font-light tracking-widest">
              {sloganText}
              {phase === "typing-slogan" && (
                <span
                  className={`inline-block w-[2px] h-4 sm:h-5 bg-red-400 ml-0.5 align-middle transition-opacity duration-100 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </p>
          )}
        </div>

        {/* Subtle decorative line under name */}
        {nameText.length === BRAND_NAME.length && (
          <div
            className="mx-auto mt-3 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"
            style={{
              animation: "splashLineExpand 0.6s ease-out both",
              width: "0%",
            }}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes splashFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes splashLetterPop {
          from { transform: scale(0.3) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes splashLineExpand {
          from { width: 0%; }
          to { width: 60%; }
        }
      `}</style>
    </div>
  );
}
