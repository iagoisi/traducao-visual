"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import StaggeredMobileMenu from "@/src/components/common/StaggeredMobileMenu";
import { smoothScrollTo } from "@/src/utils/smoothScroll";

type NavLink = {
  href: string;
  label: string;
  duration?: number;
  offset?: number;
  icon?: "whatsapp";
};

const navLinks: NavLink[] = [
  { href: "#inicio", label: "início", duration: 900, offset: 0 },
  { href: "#mudanca", label: "mudança", duration: 1000, offset: 0 },
  { href: "#verdade", label: "verdade", duration: 1100, offset: 0 },
  { href: "#traducao", label: "tradução", duration: 1200, offset: 88 },
  { href: "#sobre", label: "sobre", duration: 1100, offset: 72 },
  { href: "#duvidas", label: "dúvidas", duration: 1100, offset: 72 },
  {
    href: "https://wa.me/556792373674?text=Ol%C3%A1%2C%20Ana%21%20Quero%20come%C3%A7ar%20minha%20Tradu%C3%A7%C3%A3o%20Visual.%20Pode%20me%20enviar%20o%20link%20para%20pagamento%3F",
    label: "fale com a ana",
    icon: "whatsapp",
  },
];

const sectionLinks = navLinks.filter((link) => link.href.startsWith("#"));
const logoSrc = "/images/logo_neo.png";
const navVisibleInset = 10;

function WhatsappNavIcon() {
  return (
    <span
      aria-hidden="true"
      className="block h-[1em] w-[1em] shrink-0 bg-current"
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

export default function HeaderNeo() {
  const [activeHref, setActiveHref] = useState("#inicio");
  const [navOffset, setNavOffset] = useState(0);
  const navListRef = useRef<HTMLUListElement | null>(null);
  const activeLinkIndex = useMemo(
    () => {
      const activeIndex = navLinks.findIndex((link) => link.href === activeHref);

      if (activeIndex >= 0) return activeIndex;

      return navLinks.length - 1;
    },
    [activeHref]
  );

  useEffect(() => {
    const updateActiveSection = () => {
      const triggerLine = window.innerHeight * 0.38;
      let currentHref = sectionLinks[0].href;
      const lastSection = document.querySelector<HTMLElement>(
        sectionLinks[sectionLinks.length - 1].href
      );

      sectionLinks.forEach(({ href }) => {
        const section = document.querySelector<HTMLElement>(href);

        if (section && section.getBoundingClientRect().top <= triggerLine) {
          currentHref = href;
        }
      });

      if (
        lastSection &&
        lastSection.getBoundingClientRect().bottom <= triggerLine
      ) {
        currentHref = navLinks[navLinks.length - 1].href;
      }

      setActiveHref(currentHref);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useLayoutEffect(() => {
    let animationFrame = 0;

    const updateNavOffset = () => {
      const list = navListRef.current;
      const activeItem = list?.children.item(activeLinkIndex) as
        | HTMLElement
        | null;

      setNavOffset((currentOffset) => {
        const nextOffset = Math.max(
          (activeItem?.offsetLeft ?? 0) - navVisibleInset,
          0
        );

        return currentOffset === nextOffset ? currentOffset : nextOffset;
      });
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateNavOffset);
    };

    const list = navListRef.current;
    const resizeObserver = new ResizeObserver(scheduleUpdate);

    if (list) {
      resizeObserver.observe(list);

      Array.from(list.children).forEach((item) => {
        resizeObserver.observe(item);
      });
    }

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
    };
  }, [activeLinkIndex]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: NavLink
  ) => {
    if (!link.href.startsWith("#")) {
      return;
    }

    event.preventDefault();
    smoothScrollTo(link.href, {
      duration: link.duration,
      offset: link.offset,
    });
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-gradient-to-b from-[#BDA9A7]/92 via-[#BDA9A7]/62 to-transparent">
      <div className="flex h-24 w-full items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:pl-12 lg:pr-0 xl:pl-14">
        <a
          href="#inicio"
          aria-label="Ir para o inicio"
          onClick={(event) => handleNavClick(event, navLinks[0])}
          className="block shrink-0 transition-[transform,opacity] duration-300 hover:scale-[1.02] hover:opacity-85 active:scale-[0.98]"
        >
          <Image
            src={logoSrc}
            alt="Tradutora Visual"
            width={323}
            height={85}
            priority
            className="h-auto w-36 sm:w-44 lg:w-[210px]"
          />
        </a>

        <nav className="hidden w-[15vw] max-w-[15vw] min-w-0 justify-self-end overflow-hidden lg:block">
          <ul
            ref={navListRef}
            className="flex w-max items-center gap-[clamp(1.4rem,2.6vw,2.9rem)] text-lg font-medium leading-none text-[#1c1514] transition-transform duration-500 ease-out xl:text-xl"
            style={{
              transform: `translateX(-${navOffset}px)`,
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link)}
                  target={link.href.startsWith("#") ? undefined : "_blank"}
                  rel={
                    link.href.startsWith("#") ? undefined : "noopener noreferrer"
                  }
                  aria-current={activeHref === link.href ? "page" : undefined}
                  aria-label={
                    link.icon === "whatsapp"
                      ? "Chamar Ana no WhatsApp"
                      : undefined
                  }
                  className={`flex origin-left items-center gap-2 transition-[border-color,color,font-size,transform] duration-500 ease-out hover:-translate-y-0.5 hover:text-[var(--color-red)] active:text-[var(--color-red)] ${
                    link.icon === "whatsapp"
                      ? "gap-1.5 rounded-full border border-current px-2 py-1.5 hover:text-[0.96em] active:text-[1.26em]"
                      : "py-3 hover:text-[1.75em] active:text-[1.75em]"
                  } ${
                    activeHref === link.href
                      ? `${
                          link.icon === "whatsapp"
                            ? "text-[1.26em]"
                            : "text-[1.75em]"
                        } text-[var(--color-red)]`
                      : `${
                          link.icon === "whatsapp"
                            ? "text-[0.72em]"
                            : "text-[1em]"
                        } text-[#1c1514]/90`
                  }`}
                >
                  {link.icon === "whatsapp" ? <WhatsappNavIcon /> : null}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <StaggeredMobileMenu
          items={navLinks}
          activeHref={activeHref}
          onItemClick={handleNavClick}
        />
      </div>
    </header>
  );
}
