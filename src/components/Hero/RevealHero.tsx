"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import Header from "@/src/components/common/Header";
import Button from "../common/Button";

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
  "--glow-w"?: string;
  "--glow-h"?: string;
  "--glow-x"?: string;
  "--glow-y"?: string;
  "--drag-x"?: string;
  "--drag-y"?: string;
  "--reveal-progress"?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export default function RevealHero({
  beforeSrc = "/images/onee-hero.png",
  afterSrc = "/images/2-hero.png",
}: RevealHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    if (!section || !stage) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let isAutomatic = coarsePointer.matches;
    let hasPointerMoved = isAutomatic;
    const initialX = isAutomatic ? window.innerWidth * 0.52 : -window.innerWidth;
    const initialY = isAutomatic ? window.innerHeight * 0.46 : -window.innerHeight;
    const target: Point = {
      x: initialX,
      y: initialY,
    };
    const current: Point = { ...target };
    const previous: Point = { ...target };

    let raf = 0;

    const setIsAutomatic = () => {
      isAutomatic = coarsePointer.matches;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isAutomatic) return;

      const rect = stage.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;

      if (!hasPointerMoved) {
        current.x = target.x;
        current.y = target.y;
        previous.x = target.x;
        previous.y = target.y;
        hasPointerMoved = true;
      }
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
      const baseSize = isAutomatic ? 500 : 470;
      const finalSize = Math.max(width, height) * 2.7;
      const maskSize = baseSize + (finalSize - baseSize) * easedProgress;
      const dragPower = clamp(speed * 5, 0, 45);
      const dragX = scrollRevealActive ? 0 : clamp(-velocityX * 5, -dragPower, dragPower);
      const dragY = scrollRevealActive ? 0 : clamp(-velocityY * 5, -dragPower, dragPower);
      const glowX = current.x + dragX;
      const glowY = current.y + dragY;

      stage.style.setProperty("--mask-x", `${current.x}px`);
      stage.style.setProperty("--mask-y", `${current.y}px`);
      stage.style.setProperty("--mask-size", `${maskSize}px`);
      stage.style.setProperty("--mask-main-w", `${maskSize * 0.52}px`);
      stage.style.setProperty("--mask-main-h", `${maskSize * 0.48}px`);
      stage.style.setProperty("--glow-w", `${maskSize * 0.59}px`);
      stage.style.setProperty("--glow-h", `${maskSize * 0.55}px`);
      stage.style.setProperty("--glow-x", `${glowX}px`);
      stage.style.setProperty("--glow-y", `${glowY}px`);
      stage.style.setProperty("--drag-x", `${dragX}px`);
      stage.style.setProperty("--drag-y", `${dragY}px`);
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
    "--mask-x": "-100vw",
    "--mask-y": "-100vh",
    "--mask-size": "330px",
    "--mask-main-w": "245px",
    "--mask-main-h": "225px",
    "--glow-w": "278px",
    "--glow-h": "258px",
    "--glow-x": "-100vw",
    "--glow-y": "-100vh",
    "--drag-x": "0px",
    "--drag-y": "0px",
    "--reveal-progress": "0",
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="header-title relativo reveal-hero relative min-h-[175vh] w-full"
    >
      <Header />
      <div
        ref={stageRef}
        className="reveal-hero__stage sticky top-0 h-[100svh] w-full overflow-hidden"
        style={initialStyle}
      >
        <Image
          src={beforeSrc}
          alt="Mulher antes da transformação visual"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />

        <Image
          src={afterSrc}
          alt="Mulher após a transformação visual"
          fill
          priority
          sizes="100vw"
          className="reveal-hero__after absolute inset-0 object-cover"
        />

        <div className="reveal-hero__glow pointer-events-none absolute inset-0" />

        <div className="reveal-hero__copy-shade pointer-events-none absolute inset-0 z-10" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-black/55 via-black/18 to-transparent" />

        <div className="relative z-20 flex h-full w-full items-center px-5 sm:px-6">
          <div className="reveal-hero__copy site-container pb-8 pt-24 text-[#fff8ef] sm:pb-10 lg:pb-12 lg:pt-20 xl:pb-20 xl:pt-0">
            <h1 className="max-w-4xl text-[clamp(1.9rem,9.6vw,3.45rem)] font-semibold leading-[1.04] sm:text-5xl sm:leading-[1.03] lg:text-5xl xl:text-6xl">
              Tem roupa que<br/>  
              serve no seu corpo,<br/> 
              mas não cabe<br/>  
              mais na sua vida.
            </h1>
            <p className="mb-6 mt-4 max-w-3xl text-base leading-7 text-[#fff8ef]/82 sm:mb-8 sm:mt-5 xl:mb-10 xl:text-xl">
              Descubra o que te representa.<br />
              Traduza em escolhas visuais a mulher<br /> que você é hoje.
            </p>
            <Button href="#mudanca" duration={50} offset={0} className="gap-2 text-lg">
              Quero conhecer
              <ArrowDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
