"use client";

import { useEffect, useRef, useCallback } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const iconsRef = useRef([]);
  const animFrameRef = useRef(null);

  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 150;
  const MOUSE_RADIUS = 200;
  const ICON_COUNT = 22;

  // Marketplace icon SVG paths (drawn on canvas)
  const ICON_PATHS = [
    // Car
    { draw: (ctx, s) => { ctx.beginPath(); ctx.moveTo(-s*0.9,-s*0.1); ctx.lineTo(-s*0.7,-s*0.5); ctx.lineTo(-s*0.2,-s*0.55); ctx.lineTo(s*0.1,-s*0.8); ctx.lineTo(s*0.7,-s*0.8); ctx.lineTo(s*0.9,-s*0.5); ctx.lineTo(s*0.9,-s*0.1); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(-s*0.5, s*0.1, s*0.22, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.55, s*0.1, s*0.22, 0, Math.PI*2); ctx.fill(); } },
    // Mobile Phone
    { draw: (ctx, s) => { const r=s*0.12; ctx.beginPath(); ctx.roundRect(-s*0.35,-s*0.7,s*0.7,s*1.4,r); ctx.fill(); ctx.fillStyle="rgba(255,255,255,0.15)"; ctx.beginPath(); ctx.roundRect(-s*0.25,-s*0.55,s*0.5,s*0.9,r*0.5); ctx.fill(); ctx.fillStyle="rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.arc(0,s*0.52,s*0.08,0,Math.PI*2); ctx.fill(); } },
    // House
    { draw: (ctx, s) => { ctx.beginPath(); ctx.moveTo(0,-s*0.85); ctx.lineTo(-s*0.8,s*0.05); ctx.lineTo(-s*0.6,s*0.05); ctx.lineTo(-s*0.6,s*0.7); ctx.lineTo(s*0.6,s*0.7); ctx.lineTo(s*0.6,s*0.05); ctx.lineTo(s*0.8,s*0.05); ctx.closePath(); ctx.fill(); ctx.fillStyle="rgba(255,255,255,0.15)"; ctx.fillRect(-s*0.15,s*0.2,s*0.3,s*0.5); ctx.fillRect(-s*0.45,s*0.15,s*0.2,s*0.2); ctx.fillRect(s*0.25,s*0.15,s*0.2,s*0.2); } },
    // Laptop
    { draw: (ctx, s) => { ctx.beginPath(); ctx.roundRect(-s*0.65,-s*0.6,s*1.3,s*0.85,s*0.08); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s*0.85,s*0.3); ctx.lineTo(s*0.85,s*0.3); ctx.lineTo(s*0.75,s*0.55); ctx.lineTo(-s*0.75,s*0.55); ctx.closePath(); ctx.fill(); ctx.fillStyle="rgba(255,255,255,0.12)"; ctx.beginPath(); ctx.roundRect(-s*0.5,-s*0.45,s*1.0,s*0.6,s*0.04); ctx.fill(); } },
    // Sofa / Furniture
    { draw: (ctx, s) => { ctx.fillRect(-s*0.8,-s*0.2,s*1.6,s*0.65); ctx.fillRect(-s*0.85,-s*0.6,s*0.2,s*0.8); ctx.fillRect(s*0.65,-s*0.6,s*0.2,s*0.8); ctx.fillRect(-s*0.7,-s*0.35,s*1.4,s*0.2); ctx.fillStyle="rgba(255,255,255,0.1)"; ctx.fillRect(-s*0.75,s*0.45,s*0.15,s*0.25); ctx.fillRect(s*0.6,s*0.45,s*0.15,s*0.25); } },
    // Shirt / Fashion
    { draw: (ctx, s) => { ctx.beginPath(); ctx.moveTo(-s*0.15,-s*0.8); ctx.lineTo(-s*0.5,-s*0.5); ctx.lineTo(-s*0.7,-s*0.7); ctx.lineTo(-s*0.85,-s*0.4); ctx.lineTo(-s*0.55,-s*0.2); ctx.lineTo(-s*0.55,s*0.75); ctx.lineTo(s*0.55,s*0.75); ctx.lineTo(s*0.55,-s*0.2); ctx.lineTo(s*0.85,-s*0.4); ctx.lineTo(s*0.7,-s*0.7); ctx.lineTo(s*0.5,-s*0.5); ctx.lineTo(s*0.15,-s*0.8); ctx.quadraticCurveTo(0,-s*0.5,-s*0.15,-s*0.8); ctx.closePath(); ctx.fill(); } },
    // Motorcycle / Bike
    { draw: (ctx, s) => { ctx.beginPath(); ctx.arc(-s*0.5,s*0.2,s*0.35,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.5,s*0.2,s*0.35,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s*0.3,-s*0.1); ctx.lineTo(s*0.1,-s*0.55); ctx.lineTo(s*0.5,-s*0.55); ctx.lineTo(s*0.35,-s*0.1); ctx.closePath(); ctx.fill(); ctx.fillRect(-s*0.05,-s*0.6,s*0.3,s*0.08); } },
    // Camera
    { draw: (ctx, s) => { ctx.beginPath(); ctx.roundRect(-s*0.75,-s*0.45,s*1.5,s*0.95,s*0.1); ctx.fill(); ctx.fillRect(-s*0.2,-s*0.6,s*0.4,s*0.18); ctx.fillStyle="rgba(255,255,255,0.15)"; ctx.beginPath(); ctx.arc(0,0,s*0.3,0,Math.PI*2); ctx.fill(); ctx.fillStyle="rgba(255,255,255,0.1)"; ctx.beginPath(); ctx.arc(0,0,s*0.18,0,Math.PI*2); ctx.fill(); } },
    // Book
    { draw: (ctx, s) => { ctx.fillRect(-s*0.55,-s*0.7,s*1.1,s*1.4); ctx.fillStyle="rgba(255,255,255,0.12)"; ctx.fillRect(-s*0.45,-s*0.6,s*0.9,s*0.06); ctx.fillRect(-s*0.45,-s*0.45,s*0.6,s*0.04); ctx.fillRect(-s*0.55,-s*0.7,s*0.06,s*1.4); } },
    // Watch / Clock
    { draw: (ctx, s) => { ctx.beginPath(); ctx.arc(0,0,s*0.6,0,Math.PI*2); ctx.fill(); ctx.fillRect(-s*0.12,-s*0.85,s*0.24,s*0.28); ctx.fillRect(-s*0.12,s*0.58,s*0.24,s*0.28); ctx.fillStyle="rgba(255,255,255,0.15)"; ctx.beginPath(); ctx.arc(0,0,s*0.45,0,Math.PI*2); ctx.fill(); ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-s*0.3); ctx.moveTo(0,0); ctx.lineTo(s*0.2,s*0.1); ctx.stroke(); } },
    // Shopping Bag
    { draw: (ctx, s) => { ctx.beginPath(); ctx.moveTo(-s*0.55,-s*0.3); ctx.lineTo(-s*0.45,s*0.75); ctx.lineTo(s*0.45,s*0.75); ctx.lineTo(s*0.55,-s*0.3); ctx.closePath(); ctx.fill(); ctx.strokeStyle="rgba(255,255,255,0.2)"; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,-s*0.3,s*0.25,-Math.PI,0,false); ctx.stroke(); } },
    // Gamepad
    { draw: (ctx, s) => { ctx.beginPath(); ctx.roundRect(-s*0.8,-s*0.4,s*1.6,s*0.8,s*0.3); ctx.fill(); ctx.fillStyle="rgba(255,255,255,0.15)"; ctx.fillRect(-s*0.55,-s*0.12,s*0.3,s*0.06); ctx.fillRect(-s*0.48,-s*0.22,s*0.06,s*0.3); ctx.beginPath(); ctx.arc(s*0.35,-s*0.08,s*0.07,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.5,s*0.05,s*0.07,0,Math.PI*2); ctx.fill(); } },
  ];

  const createParticle = useCallback((w, h) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    size: Math.random() * 2.5 + 1,
    opacity: Math.random() * 0.5 + 0.3,
  }), []);

  const createIcon = useCallback((w, h) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 10 + 10,
    opacity: Math.random() * 0.06 + 0.04, // very subtle: 0.04 - 0.10
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.008,
    iconIndex: Math.floor(Math.random() * ICON_PATHS.length),
    pulsePhase: Math.random() * Math.PI * 2,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;

      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      );
      iconsRef.current = Array.from({ length: ICON_COUNT }, () =>
        createIcon(canvas.width, canvas.height)
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

    let time = 0;

    const animate = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const particles = particlesRef.current;
      const icons = iconsRef.current;

      ctx.clearRect(0, 0, w, h);

      // ── Draw floating marketplace icons (behind particles) ────
      for (let i = 0; i < icons.length; i++) {
        const ic = icons[i];

        // Gentle floating motion
        ic.x += ic.vx;
        ic.y += ic.vy;
        ic.rotation += ic.rotSpeed;

        // Wrap around edges
        if (ic.x < -30) ic.x = w + 30;
        if (ic.x > w + 30) ic.x = -30;
        if (ic.y < -30) ic.y = h + 30;
        if (ic.y > h + 30) ic.y = -30;

        // Mouse interaction — icons glow when cursor is near
        const idx = mx - ic.x;
        const idy = my - ic.y;
        const idist = Math.sqrt(idx * idx + idy * idy);
        const mouseGlow = idist < MOUSE_RADIUS * 1.5
          ? (1 - idist / (MOUSE_RADIUS * 1.5)) * 0.18
          : 0;

        // Subtle pulse
        const pulse = Math.sin(time * 1.5 + ic.pulsePhase) * 0.02;
        const finalOpacity = ic.opacity + mouseGlow + pulse;
        const finalSize = ic.size + (mouseGlow > 0 ? mouseGlow * 8 : 0);

        // Mouse push — gently push icons away from cursor
        if (idist < MOUSE_RADIUS && idist > 0) {
          const pushForce = (MOUSE_RADIUS - idist) / MOUSE_RADIUS;
          ic.vx -= (idx / idist) * pushForce * 0.015;
          ic.vy -= (idy / idist) * pushForce * 0.015;
        }

        // Damping
        ic.vx *= 0.995;
        ic.vy *= 0.995;

        // Speed limit
        const speed = Math.sqrt(ic.vx * ic.vx + ic.vy * ic.vy);
        if (speed > 0.6) {
          ic.vx = (ic.vx / speed) * 0.6;
          ic.vy = (ic.vy / speed) * 0.6;
        }

        ctx.save();
        ctx.translate(ic.x, ic.y);
        ctx.rotate(ic.rotation);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;

        try {
          ICON_PATHS[ic.iconIndex].draw(ctx, finalSize);
        } catch(e) {
          // fallback circle
          ctx.beginPath();
          ctx.arc(0, 0, finalSize * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // ── Draw particles ────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx += (dx / dist) * force * 0.04 + (-dy / dist) * force * 0.02;
          p.vy += (dy / dist) * force * 0.04 + (dx / dist) * force * 0.02;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const glowFactor = dist < MOUSE_RADIUS ? 1 - dist / MOUSE_RADIUS : 0;
        const finalOpacity = p.opacity + glowFactor * 0.5;
        const finalSize = p.size + glowFactor * 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < CONNECT_DIST) {
            const lineOpacity = (1 - cdist / CONNECT_DIST) * 0.25;
            const midX = (p.x + p2.x) / 2;
            const midY = (p.y + p2.y) / 2;
            const mdx = mx - midX;
            const mdy = my - midY;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            const mouseLineGlow = mDist < MOUSE_RADIUS ? (1 - mDist / MOUSE_RADIUS) * 0.4 : 0;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(200, 255, 220, ${lineOpacity + mouseLineGlow})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // ── Cursor glow ring ──────────────────────────────────────
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
  }, [createParticle, createIcon]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto" }}
    />
  );
}
