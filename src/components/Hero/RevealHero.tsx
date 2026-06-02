"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type RevealHeroProps = {
  beforeSrc?: string;
  afterSrc?: string;
};

type Point = {
  x: number;
  y: number;
};

type RevealStyle = React.CSSProperties & {
  "--mask-x"?: string;
  "--mask-y"?: string;
  "--mask-size"?: string;
  "--mask-main-w"?: string;
  "--mask-main-h"?: string;
  "--mask-a-w"?: string;
  "--mask-a-h"?: string;
  "--mask-a-x"?: string;
  "--mask-a-y"?: string;
  "--mask-b-w"?: string;
  "--mask-b-h"?: string;
  "--mask-b-x"?: string;
  "--mask-b-y"?: string;
  "--glow-w"?: string;
  "--glow-h"?: string;
  "--glow-x"?: string;
  "--glow-y"?: string;
  "--drag-x"?: string;
  "--drag-y"?: string;
  "--cloth-tilt"?: string;
  "--reveal-progress"?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export default function RevealHero({
  beforeSrc = "/images/one.png",
  afterSrc = "/images/two.png",
}: RevealHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    if (!section || !stage) return;

    const target: Point = {
      x: window.innerWidth * 0.52,
      y: window.innerHeight * 0.46,
    };
    const current: Point = { ...target };
    const previous: Point = { ...target };

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let isAutomatic = coarsePointer.matches;
    let raf = 0;

    const setIsAutomatic = () => {
      isAutomatic = coarsePointer.matches;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isAutomatic) return;

      const rect = stage.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
    };

    const animate = (time: number) => {
      const stageRect = stage.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const width = Math.max(stageRect.width, 1);
      const height = Math.max(stageRect.height, 1);
      const elapsed = time * 0.001;

      if (isAutomatic) {
        target.x =
          width *
          (0.5 +
            Math.sin(elapsed * 0.52) * 0.22 +
            Math.sin(elapsed * 1.08) * 0.055);
        target.y =
          height *
          (0.5 +
            Math.cos(elapsed * 0.43) * 0.17 +
            Math.sin(elapsed * 0.78) * 0.045);
      }

      const scrollRange = Math.max(sectionRect.height - window.innerHeight, 1);
      const scrollProgress = clamp(-sectionRect.top / scrollRange, 0, 1);
      const easedProgress = easeOutCubic(scrollProgress);
      const scrollRevealActive = scrollProgress > 0.015;
      const revealComplete = easedProgress >= 0.985;

      const followStrength = isAutomatic ? 0.045 : 0.085;
      const settledTargetX = width * 0.5;
      const settledTargetY = height * 0.5;
      const nextTargetX = scrollRevealActive ? settledTargetX : target.x;
      const nextTargetY = scrollRevealActive ? settledTargetY : target.y;

      current.x += (nextTargetX - current.x) * followStrength;
      current.y += (nextTargetY - current.y) * followStrength;

      const velocityX = current.x - previous.x;
      const velocityY = current.y - previous.y;
      const speed = Math.hypot(velocityX, velocityY);
      const baseSize = isAutomatic ? 550 : 530;
      const finalSize = Math.max(width, height) * 2.25;
      const maskSize = baseSize + (finalSize - baseSize) * easedProgress;
      const dragPower = clamp(speed * 8, 0, 90);
      const dragX = scrollRevealActive ? 0 : clamp(-velocityX * 10, -dragPower, dragPower);
      const dragY = scrollRevealActive ? 0 : clamp(-velocityY * 10, -dragPower, dragPower);
      const tilt = scrollRevealActive ? 0 : clamp(velocityX * 0.18, -10, 10);
      const lobeAX = current.x + dragX + maskSize * 0.15;
      const lobeAY = current.y + dragY - maskSize * 0.09;
      const lobeBX = current.x + dragX - maskSize * 0.12;
      const lobeBY = current.y + dragY + maskSize * 0.13;
      const glowX = current.x + dragX * 0.45;
      const glowY = current.y + dragY * 0.45;

      stage.style.setProperty("--mask-x", `${current.x}px`);
      stage.style.setProperty("--mask-y", `${current.y}px`);
      stage.style.setProperty("--mask-size", `${maskSize}px`);
      stage.style.setProperty("--mask-main-w", `${maskSize * 0.58}px`);
      stage.style.setProperty("--mask-main-h", `${maskSize * 0.42}px`);
      stage.style.setProperty("--mask-a-w", `${maskSize * 0.42}px`);
      stage.style.setProperty("--mask-a-h", `${maskSize * 0.32}px`);
      stage.style.setProperty("--mask-a-x", `${lobeAX}px`);
      stage.style.setProperty("--mask-a-y", `${lobeAY}px`);
      stage.style.setProperty("--mask-b-w", `${maskSize * 0.35}px`);
      stage.style.setProperty("--mask-b-h", `${maskSize * 0.46}px`);
      stage.style.setProperty("--mask-b-x", `${lobeBX}px`);
      stage.style.setProperty("--mask-b-y", `${lobeBY}px`);
      stage.style.setProperty("--glow-w", `${maskSize * 0.52}px`);
      stage.style.setProperty("--glow-h", `${maskSize * 0.38}px`);
      stage.style.setProperty("--glow-x", `${glowX}px`);
      stage.style.setProperty("--glow-y", `${glowY}px`);
      stage.style.setProperty("--drag-x", `${dragX}px`);
      stage.style.setProperty("--drag-y", `${dragY}px`);
      stage.style.setProperty("--cloth-tilt", `${tilt}deg`);
      stage.style.setProperty("--reveal-progress", `${easedProgress}`);
      stage.dataset.scrollRevealActive = scrollRevealActive ? "true" : "false";
      stage.dataset.revealComplete = revealComplete ? "true" : "false";

      previous.x = current.x;
      previous.y = current.y;

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    coarsePointer.addEventListener("change", setIsAutomatic);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      coarsePointer.removeEventListener("change", setIsAutomatic);
      cancelAnimationFrame(raf);
    };
  }, []);

  const initialStyle: RevealStyle = {
    "--mask-x": "52vw",
    "--mask-y": "46vh",
    "--mask-size": "330px",
    "--mask-main-w": "191px",
    "--mask-main-h": "139px",
    "--mask-a-w": "139px",
    "--mask-a-h": "106px",
    "--mask-a-x": "calc(52vw + 50px)",
    "--mask-a-y": "calc(46vh - 30px)",
    "--mask-b-w": "116px",
    "--mask-b-h": "152px",
    "--mask-b-x": "calc(52vw - 40px)",
    "--mask-b-y": "calc(46vh + 43px)",
    "--glow-w": "172px",
    "--glow-h": "125px",
    "--glow-x": "52vw",
    "--glow-y": "46vh",
    "--drag-x": "0px",
    "--drag-y": "0px",
    "--cloth-tilt": "0deg",
    "--reveal-progress": "0",
  };

  return (
    <section ref={sectionRef} className="reveal-hero relative min-h-[175vh] w-full">
      <div
        ref={stageRef}
        className="reveal-hero__stage sticky top-0 h-screen w-full overflow-hidden"
        style={initialStyle}
      >
        <Image
          src={beforeSrc}
          alt="Mulher antes da transformacao visual"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />

        <Image
          src={afterSrc}
          alt="Mulher apos a transformacao visual"
          fill
          priority
          sizes="100vw"
          className="reveal-hero__after absolute inset-0 object-cover"
        />

        <div className="reveal-hero__glow pointer-events-none absolute inset-0" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-black/55 via-black/18 to-transparent" />

        <div className="relative z-20 flex h-full w-full items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-14 text-white sm:px-8 lg:pb-20">
            <p className="mb-4 max-w-xl text-sm uppercase tracking-[0.28em] text-white/70">
              Imagem pessoal e autoestima
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] sm:text-6xl lg:text-7xl">
              Revele a versao mais confiante de voce
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Uma experiencia visual criada para traduzir presenca, elegancia e
              transformacao em cada detalhe da sua imagem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
