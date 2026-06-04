"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  rot: number;
};

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // params — ajuste pra experimentar
  const params = {
    maxParticles: 800,
    baseSize: 28,
    lifeDecay: 0.016,
    velocityDamping: 0.96,
    curl: 0.01,
    fadeAlpha: 0.04, // trail persistence (smaller = longer trail)
    useImage: true, // usar /images/2.png como textura
  };

  useEffect(() => {
    if (params.useImage) {
      const img = new Image();
      img.src = "/images/2.png";
      imgRef.current = img;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth));
      const h = Math.max(1, Math.floor(window.innerHeight));
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastPointer = { x: -9999, y: -9999, t: performance.now() };

    const onPointer = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastPointer.t);
      const dx = e.clientX - lastPointer.x;
      const dy = e.clientY - lastPointer.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      // create a few particles proportional to speed
      const count = Math.min(6, Math.max(1, Math.round(1 + speed * 30)));
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 2 + dx * 0.02,
          vy: (Math.random() - 0.5) * 2 + dy * 0.02,
          life: 1,
          size: params.baseSize * (0.6 + Math.random() * 1.2),
          rot: Math.random() * Math.PI * 2,
        });
      }

      lastPointer = { x: e.clientX, y: e.clientY, t: now };
    };

    window.addEventListener("pointermove", onPointer);

    const draw = () => {
      // fade (keeps trails)
      ctx.fillStyle = `rgba(0,0,0,${params.fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width / DPR, canvas.height / DPR);

      // settings for nicer blending
      ctx.globalCompositeOperation = "lighter";

      const img = imgRef.current;
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // physics
        p.vx *= params.velocityDamping;
        p.vy *= params.velocityDamping;

        // curl/flow
        p.vx += Math.sin(p.y * 0.01 + p.x * 0.01) * params.curl;
        p.vy += Math.cos(p.x * 0.01 - p.y * 0.01) * params.curl;

        p.x += p.vx;
        p.y += p.vy;
        p.rot += (p.vx + p.vy) * 0.01;

        p.life -= params.lifeDecay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.pow(p.life, 1.1) * 0.9;

        if (img && img.complete && img.naturalWidth > 0) {
          // draw image stamp
          const size = p.size * (1 + (1 - p.life) * 0.5);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          // slight blur to mimic fiber softness
          ctx.filter = "blur(1px)";
          ctx.drawImage(img, -size / 2, -size / 2, size, size);
          ctx.filter = "none";
          ctx.restore();
        } else {
          // fallback: radial gradient
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          g.addColorStop(0, `rgba(255,255,255,${alpha})`);
          g.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // limit count
      if (particles.length > params.maxParticles) {
        particles.splice(0, particles.length - params.maxParticles);
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
