"use client";

import { useEffect, useRef, useCallback } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 150;
  const MOUSE_RADIUS = 200;

  const createParticle = useCallback((w, h) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    size: Math.random() * 2.5 + 1,
    opacity: Math.random() * 0.5 + 0.3,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;

      // Re-init particles on resize
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      );
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion/attraction — particles gently orbit cursor
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          // Attract towards cursor with a slight tangential push for swirl
          p.vx += (dx / dist) * force * 0.04 + (-dy / dist) * force * 0.02;
          p.vy += (dy / dist) * force * 0.04 + (dx / dist) * force * 0.02;
        }

        // Apply velocity with damping
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Glow near cursor
        const glowFactor = dist < MOUSE_RADIUS ? 1 - dist / MOUSE_RADIUS : 0;
        const finalOpacity = p.opacity + glowFactor * 0.5;
        const finalSize = p.size + glowFactor * 2;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.fill();

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < CONNECT_DIST) {
            const lineOpacity = (1 - cdist / CONNECT_DIST) * 0.25;
            // Brighter lines near cursor
            const midX = (p.x + p2.x) / 2;
            const midY = (p.y + p2.y) / 2;
            const mdx = mx - midX;
            const mdy = my - midY;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            const mouseGlow = mDist < MOUSE_RADIUS ? (1 - mDist / MOUSE_RADIUS) * 0.4 : 0;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(200, 255, 220, ${lineOpacity + mouseGlow})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw a soft glow ring around cursor
      if (mx > 0 && my > 0) {
        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS * 0.6);
        gradient.addColorStop(0, "rgba(134, 239, 172, 0.12)");
        gradient.addColorStop(0.5, "rgba(134, 239, 172, 0.04)");
        gradient.addColorStop(1, "rgba(134, 239, 172, 0)");
        ctx.beginPath();
        ctx.arc(mx, my, MOUSE_RADIUS * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto" }}
    />
  );
}
