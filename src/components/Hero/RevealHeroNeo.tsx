"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { trackInitiateContact } from "@/src/services/Meta/metaPixel";
import HeaderNeo from "@/src/components/common/HeaderNeo";

type RevealHeroNeoProps = {
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

const anaWhatsappUrl =
  "https://wa.me/556792373674?text=Ol%C3%A1%2C%20Ana%21%20Quero%20come%C3%A7ar%20minha%20Tradu%C3%A7%C3%A3o%20Visual.%20Pode%20me%20enviar%20o%20link%20para%20pagamento%3F";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

const readScale = (element: HTMLElement) => {
  const styles = getComputedStyle(element);
  const afterScale = Number.parseFloat(
    styles.getPropertyValue("--person-after-scale")
  );
  const imageScale = Number.parseFloat(
    styles.getPropertyValue("--person-image-scale")
  );

  if (Number.isFinite(afterScale)) return afterScale;
  if (Number.isFinite(imageScale)) return imageScale;
  return 1;
};

export default function RevealHeroNeo({
  beforeSrc = "/images/hero_001.png",
  afterSrc = "/images/hero_002.png",
}: RevealHeroNeoProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const personRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const person = personRef.current;

    if (!section || !stage || !person) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let isAutomatic = coarsePointer.matches;
    let hasPointerMoved = isAutomatic;
    const initialX = isAutomatic ? window.innerWidth * 0.5 : -window.innerWidth;
    const initialY = isAutomatic ? window.innerHeight * 0.44 : -window.innerHeight;
    const target: Point = { x: initialX, y: initialY };
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
      const personRect = person.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const personWidth = Math.max(personRect.width, 1);
      const personHeight = Math.max(personRect.height, 1);
      const elapsed = time * 0.001;

      if (isAutomatic) {
        const personOffsetX = personRect.left - stageRect.left;
        const personOffsetY = personRect.top - stageRect.top;
        target.x =
          personOffsetX +
          personWidth *
          (0.5 +
            Math.sin(elapsed * 0.46) * 0.2 +
            Math.sin(elapsed * 0.96) * 0.045);
        target.y =
          personOffsetY +
          personHeight *
          (0.43 +
            Math.cos(elapsed * 0.38) * 0.14 +
            Math.sin(elapsed * 0.72) * 0.04);
      }

      const scrollRange = Math.max(sectionRect.height - window.innerHeight, 1);
      const scrollProgress = clamp(-sectionRect.top / scrollRange, 0, 1);
      const easedProgress = easeOutCubic(scrollProgress);
      const scrollRevealActive = scrollProgress > 0.015;
      const revealComplete = easedProgress >= 0.985;

      const followStrength = isAutomatic ? 0.045 : 1;
      const settledTargetX = personRect.left - stageRect.left + personWidth * 0.5;
      const settledTargetY = personRect.top - stageRect.top + personHeight * 0.45;
      const nextTargetX = scrollRevealActive ? settledTargetX : target.x;
      const nextTargetY = scrollRevealActive ? settledTargetY : target.y;

      current.x += (nextTargetX - current.x) * followStrength;
      current.y += (nextTargetY - current.y) * followStrength;

      const velocityX = current.x - previous.x;
      const velocityY = current.y - previous.y;
      const speed = Math.hypot(velocityX, velocityY);
      const baseSize = Math.min(Math.max(personWidth * 0.72, 260), isAutomatic ? 460 : 420);
      const finalSize = Math.max(personWidth, personHeight) * 2.35;
      const maskSize = baseSize + (finalSize - baseSize) * easedProgress;
      const dragPower = clamp(speed * 5, 0, 45);
      const dragX = scrollRevealActive ? 0 : clamp(-velocityX * 5, -dragPower, dragPower);
      const dragY = scrollRevealActive ? 0 : clamp(-velocityY * 5, -dragPower, dragPower);
      const glowX = current.x + dragX;
      const glowY = current.y + dragY;
      const personOffsetX = personRect.left - stageRect.left;
      const personOffsetY = personRect.top - stageRect.top;
      const localMaskX = current.x - personOffsetX;
      const localMaskY = current.y - personOffsetY;
      const afterScale = readScale(person);
      const maskOriginX = personWidth * 0.5;
      const maskOriginY = personHeight;
      const maskX = maskOriginX + (localMaskX - maskOriginX) / afterScale;
      const maskY = maskOriginY + (localMaskY - maskOriginY) / afterScale;
      const personGlowX = glowX - personOffsetX;
      const personGlowY = glowY - personOffsetY;

      person.style.setProperty("--mask-x", `${maskX}px`);
      person.style.setProperty("--mask-y", `${maskY}px`);
      person.style.setProperty("--mask-size", `${maskSize}px`);
      person.style.setProperty("--mask-main-w", `${maskSize * 0.52}px`);
      person.style.setProperty("--mask-main-h", `${maskSize * 0.48}px`);
      person.style.setProperty("--glow-w", `${maskSize * 0.59}px`);
      person.style.setProperty("--glow-h", `${maskSize * 0.55}px`);
      person.style.setProperty("--glow-x", `${personGlowX}px`);
      person.style.setProperty("--glow-y", `${personGlowY}px`);
      person.style.setProperty("--drag-x", `${dragX}px`);
      person.style.setProperty("--drag-y", `${dragY}px`);
      person.style.setProperty("--reveal-progress", `${easedProgress}`);
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

  const trackAnaContact = () => {
    void trackInitiateContact({
      content_name: "Sua tradução visual aqui",
      content_category: "Hero Neo",
      placement: "hero bottom bar",
      destination: "Ana WhatsApp",
    });
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="reveal-hero reveal-hero-neo relative min-h-[175vh] w-full bg-[#c7b7b0]"
    >
      <HeaderNeo />

      <div
        ref={stageRef}
        className="reveal-hero__stage reveal-hero-neo__stage sticky top-0 h-[100svh] w-full overflow-hidden bg-[#c7b7b0]"
      >
        <div className="absolute inset-0 bg-[#c7b7b0]" />

        <div
          ref={personRef}
          className="reveal-hero-neo__person absolute bottom-14 left-1/2 top-72 z-10 w-[min(100vw,25rem)] -translate-x-1/2 sm:inset-x-0 sm:bottom-0 sm:top-24 sm:mx-auto sm:w-[min(76vw,42rem)] sm:translate-x-0 lg:-bottom-24 lg:top-28 lg:w-[min(46vw,42rem)]"
          style={initialStyle}
        >
          <Image
            src={beforeSrc}
            alt="Mulher com as maos vermelhas cobrindo os olhos"
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 76vw"
            className="reveal-hero-neo__image object-contain object-bottom"
          />

          <Image
            src={afterSrc}
            alt="Mulher após a tradução visual"
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 76vw"
            className="reveal-hero-neo__after object-contain object-bottom"
          />

          <div className="reveal-hero-neo__glow absolute inset-0" />
        </div>

        <div className="pointer-events-none relative z-20 grid h-full grid-rows-[1fr_auto] px-5 pt-28 sm:px-8 sm:pt-32 lg:px-12 xl:px-14">
          <div className="grid min-h-0 content-center justify-items-center gap-4 pb-24 pt-3 text-center sm:items-center sm:justify-items-stretch sm:gap-8 sm:pb-28 sm:pt-0 sm:text-left lg:grid-cols-[1fr_minmax(20rem,0.86fr)_1fr] lg:pb-20">
            <h1 className="max-w-[21rem] text-[clamp(1.18rem,5.3vw,1.38rem)] font-normal leading-[1.48] text-[var(--color-red)] sm:max-w-[8.6ch] sm:text-[clamp(2.4rem,7.8vw,5.45rem)] sm:leading-[1.48] lg:text-[clamp(2.75rem,4.85vw,5.55rem)]">
              <span className="sm:hidden">
                Abre o armário<br />
                cheio de roupas e<br />
                sente que não tem<br />
                nada para vestir, né?!
              </span>
              <span className="hidden sm:inline">
                Abre o<br />
                armário<br />
                cheio de<br />
                roupas e
              </span>
            </h1>

            <p className="max-w-[24ch] text-[0.68rem] font-bold leading-snug text-[#1c1514]/80 sm:hidden">
              É falta de clareza e critério para fazer escolhas que funcionem na sua vida.
            </p>

            <div className="hidden lg:block" />

            <h2 className="ml-auto hidden max-w-[9.2ch] text-right font-normal leading-[1.48] text-[var(--color-red)] sm:block sm:text-[clamp(2.3rem,7.4vw,5.25rem)] lg:text-[clamp(2.65rem,4.65vw,5.35rem)]">
              sente que<br />
              não tem<br />
              nada para<br />
              vestir, né?!
            </h2>
          </div>

          <a
            href={anaWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackAnaContact}
            className="pointer-events-auto relative -mx-5 flex h-16 items-center gap-4 bg-[var(--color-red)] px-6 text-white shadow-[0_-18px_60px_rgba(120,28,20,0.16)] transition-[background-color] duration-300 hover:bg-[#e83f3f] sm:-mx-8 sm:h-18 sm:px-10 lg:-mx-12 xl:-mx-14"
          >
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--color-red)] shadow-[0_10px_34px_rgba(120,28,20,0.22)] sm:h-20 sm:w-20">
              <Image
                src="/images/whatsApp.png"
                alt=""
                width={123}
                height={123}
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
            </span>
            <span className="text-base font-bold leading-none sm:text-xl">
              sua tradução visual aqui
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
