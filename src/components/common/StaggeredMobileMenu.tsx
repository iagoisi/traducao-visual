"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export type StaggeredMobileMenuItem = {
  href: string;
  label: string;
  duration?: number;
  offset?: number;
  icon?: "whatsapp";
};

type StaggeredMobileMenuProps = {
  items: StaggeredMobileMenuItem[];
  activeHref: string;
  onItemClick: (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: StaggeredMobileMenuItem
  ) => void;
};

function WhatsappNavIcon() {
  return (
    <span
      aria-hidden="true"
      className="block h-[0.9em] w-[0.9em] shrink-0 bg-current"
      style={{
        WebkitMaskImage: "url('/images/whatsApp.png')",
        maskImage: "url('/images/whatsApp.png')",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export default function StaggeredMobileMenu({
  items,
  activeHref,
  onItemClick,
}: StaggeredMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const horizontalLineRef = useRef<HTMLSpanElement | null>(null);
  const verticalLineRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const layers = layersRef.current?.children
        ? Array.from(layersRef.current.children)
        : [];

      gsap.set([panel, ...layers], { xPercent: 100, opacity: 1 });
      gsap.set(horizontalLineRef.current, { rotate: 0 });
      gsap.set(verticalLineRef.current, { rotate: 90 });
      gsap.set(textRef.current, { yPercent: 0 });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openMenu = useCallback(() => {
    const panel = panelRef.current;
    const layers = layersRef.current?.children
      ? Array.from(layersRef.current.children)
      : [];
    const itemLabels = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>("[data-menu-item-label]"))
      : [];

    timelineRef.current?.kill();
    gsap.set(itemLabels, { yPercent: 130, rotate: 8 });

    const timeline = gsap.timeline();

    layers.forEach((layer, index) => {
      timeline.to(
        layer,
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        index * 0.07
      );
    });

    timeline
      .to(panel, { xPercent: 0, duration: 0.62, ease: "power4.out" }, 0.18)
      .to(
        itemLabels,
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.08,
        },
        0.36
      )
      .to(horizontalLineRef.current, { rotate: 45, duration: 0.45, ease: "power4.out" }, 0)
      .to(verticalLineRef.current, { rotate: -45, duration: 0.45, ease: "power4.out" }, 0)
      .to(textRef.current, { yPercent: -50, duration: 0.45, ease: "power4.out" }, 0);

    timelineRef.current = timeline;
  }, []);

  const closeMenu = useCallback((immediate = false) => {
    const panel = panelRef.current;
    if (!panel) {
      setIsOpen(false);
      return;
    }

    const layers = layersRef.current?.children
      ? Array.from(layersRef.current.children)
      : [];

    timelineRef.current?.kill();

    if (immediate) {
      gsap.set([panel, ...layers], { xPercent: 100 });
      gsap.set(horizontalLineRef.current, { rotate: 0 });
      gsap.set(verticalLineRef.current, { rotate: 90 });
      gsap.set(textRef.current, { yPercent: 0 });
      setIsOpen(false);
      return;
    }

    timelineRef.current = gsap
      .timeline()
      .to([panel, ...layers], {
        xPercent: 100,
        duration: 0.34,
        ease: "power3.in",
      })
      .to(horizontalLineRef.current, { rotate: 0, duration: 0.3, ease: "power3.out" }, 0)
      .to(verticalLineRef.current, { rotate: 90, duration: 0.3, ease: "power3.out" }, 0)
      .to(textRef.current, { yPercent: 0, duration: 0.3, ease: "power3.out" }, 0);

    setIsOpen(false);
  }, []);

  const toggleMenu = () => {
    setIsOpen((current) => {
      const next = !current;

      if (next) {
        openMenu();
      } else {
        const panel = panelRef.current;
        if (!panel) return next;

        const layers = layersRef.current?.children
          ? Array.from(layersRef.current.children)
          : [];

        timelineRef.current?.kill();
        timelineRef.current = gsap
          .timeline()
          .to([panel, ...layers], {
            xPercent: 100,
            duration: 0.34,
            ease: "power3.in",
          })
          .to(horizontalLineRef.current, { rotate: 0, duration: 0.3, ease: "power3.out" }, 0)
          .to(verticalLineRef.current, { rotate: 90, duration: 0.3, ease: "power3.out" }, 0)
          .to(textRef.current, { yPercent: 0, duration: 0.3, ease: "power3.out" }, 0);
      }

      return next;
    });
  };

  const handleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: StaggeredMobileMenuItem
  ) => {
    closeMenu(true);
    onItemClick(event, item);
  };

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        aria-controls="staggered-mobile-menu"
        className="relative z-[70] inline-flex items-center gap-2 text-sm font-medium uppercase leading-none tracking-[0.14em] text-[#1c1514] transition-colors duration-300 data-[open=true]:text-white"
        data-open={isOpen}
      >
        <span className="relative h-[1em] overflow-hidden">
          <span ref={textRef} className="flex flex-col leading-none">
            <span className="h-[1em]">menu</span>
            <span className="h-[1em]">fechar</span>
          </span>
        </span>
        <span className="relative block h-4 w-4">
          <span
            ref={horizontalLineRef}
            className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
          />
          <span
            ref={verticalLineRef}
            className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
          />
        </span>
      </button>

      <div
        ref={layersRef}
        className="pointer-events-none fixed inset-0 z-[55]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#ff5252]" />
        <div className="absolute inset-0 bg-[#d8c8c1]" />
      </div>

      <div
        id="staggered-mobile-menu"
        ref={panelRef}
        className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#1c1514] px-5 pb-8 pt-6 text-white"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between">
          <Image
            src="/images/logo_neo.png"
            alt="Tradutora Visual"
            width={323}
            height={85}
            priority
            className="h-auto w-36 brightness-0 invert"
          />
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
            menu
          </span>
        </div>

        <nav className="mt-16" aria-label="Menu mobile">
          <ul className="grid gap-4">
            {items.map((item, index) => (
              <li key={item.href} className="overflow-hidden">
                <a
                  href={item.href}
                  onClick={(event) => handleItemClick(event, item)}
                  target={item.href.startsWith("#") ? undefined : "_blank"}
                  rel={item.href.startsWith("#") ? undefined : "noopener noreferrer"}
                  aria-current={activeHref === item.href ? "page" : undefined}
                  className={`group flex items-center gap-3 text-[clamp(2.35rem,14vw,4.4rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em] transition-colors duration-300 ${
                    activeHref === item.href
                      ? "text-[var(--color-red)]"
                      : "text-white hover:text-[var(--color-red)]"
                  }`}
                >
                  <span className="w-8 shrink-0 text-xs font-medium tracking-normal text-current/55">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span data-menu-item-label className="flex items-center gap-3">
                    {item.icon === "whatsapp" ? <WhatsappNavIcon /> : null}
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
