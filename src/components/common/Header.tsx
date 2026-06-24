"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { smoothScrollTo } from "@/src/utils/smoothScroll";
import { trackInitiateContact } from "@/src/services/Meta/metaPixel";
import Button from "./Button";

const HEADER_GRADIENT_SCROLL_THRESHOLD = 24;

type NavLink = {
  href: string;
  label: string;
  duration?: number;
  offset?: number;
};

const navLinks: NavLink[] = [
  { href: "#inicio", label: "Início", duration: 900, offset: 0 },
  { href: "#mudanca", label: "Mudança", duration: 1000, offset: 0 },
  { href: "#verdade", label: "Verdade", duration: 1100, offset: 0 },
  { href: "#traducao", label: "Tradução", duration: 1200, offset: 88 },
  { href: "#sobre", label: "Sobre", duration: 1100, offset: 72 },
  { href: "#duvidas", label: "Dúvidas", duration: 1100, offset: 72 },
  { href: "#produto", label: "Produto", duration: 1100, offset: 72 },
];

const anaWhatsappUrl =
  "https://wa.me/556792373674?text=Ol%C3%A1%2C%20Ana%21%20Quero%20realizar%20minha%20Tradu%C3%A7%C3%A3o%20Visual.";

function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#inicio");

  useEffect(() => {
    const updateHeaderState = () => {
      setHasScrolled(window.scrollY > HEADER_GRADIENT_SCROLL_THRESHOLD);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const triggerLine = window.innerHeight * 0.38;
      let currentHref = navLinks[0].href;

      navLinks.forEach(({ href }) => {
        const section = document.querySelector<HTMLElement>(href);
        if (section && section.getBoundingClientRect().top <= triggerLine) {
          currentHref = href;
        }
      });

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const trackAnaContact = (placement: string) => {
    void trackInitiateContact({
      content_name: "Quero minha Traducao Visual",
      content_category: "Header",
      placement,
      destination: "Ana WhatsApp",
    });
  };

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: NavLink
  ) => {
    if (!link.href.startsWith("#")) {
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu();
    smoothScrollTo(link.href, {
      duration: link.duration,
      offset: link.offset,
    });
  };

  return (
    <header className="fixed left-0 top-0 z-200 w-full bg-transparent">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 via-black/55 to-transparent transition-opacity duration-500 ${
          hasScrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative z-40 flex h-20 w-full items-center justify-between px-5 py-4 sm:px-6 xl:mt-5 xl:h-16 xl:p-10">
        <div>
          <a
            href="#inicio"
            aria-label="Ir para o início"
            className="block transition-[transform,opacity] duration-300 hover:scale-[1.03] hover:opacity-85 active:scale-[0.98]"
          >
            <Image
              src="/images/logo.png"
              alt="Logotipo"
              width={210}
              height={70}
              className="h-auto w-36 sm:w-44 xl:w-[210px]"
            />
          </a>
        </div>

        <nav className="hidden xl:block">
          <ul className="flex gap-7 text-md font-medium text-gray-200">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link)}
                  data-scroll-duration={link.duration}
                  data-scroll-offset={link.offset}
                  aria-current={activeHref === link.href ? "page" : undefined}
                  className={`relative block py-2 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-white after:transition-transform after:duration-300 ${
                    activeHref === link.href
                      ? "text-white after:scale-x-100"
                      : "text-white/65 after:scale-x-0 hover:text-white hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden xl:block">
          <Button
            href={anaWhatsappUrl}
            target="_blank"
            onClick={() => trackAnaContact("desktop nav")}
            className="px-5 py-3"
          >
            Quero minha Tradução Visual
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/18 text-white backdrop-blur-md transition-[transform,background-color,border-color] duration-300 hover:scale-105 hover:border-white/45 hover:bg-white/12 active:scale-95 xl:hidden"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-5 bg-current transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-px w-5 bg-current transition-transform duration-300 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-10 cursor-pointer bg-black/42 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      <div
        className={`absolute right-5 top-20 z-50 max-h-[calc(100svh-6rem)] w-[min(22rem,calc(100vw-2.5rem))] overflow-y-auto rounded-[1.5rem] border border-white/20 bg-black/72 p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-300 sm:top-24 xl:hidden ${
          isMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <nav>
          <ul className="grid gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link)}
                  data-scroll-duration={link.duration}
                  data-scroll-offset={link.offset}
                  aria-current={activeHref === link.href ? "page" : undefined}
                  className={`block rounded-2xl px-4 py-3 text-lg font-medium transition-colors ${
                    activeHref === link.href
                      ? "bg-white/12 text-white"
                      : "text-white/72 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          href={anaWhatsappUrl}
          target="_blank"
          onClick={() => {
            closeMenu();
            trackAnaContact("mobile nav");
          }}
          className="mt-4 flex w-full justify-center px-5 py-3"
        >
          Quero minha Tradução Visual
        </Button>
      </div>
    </header>
  );
}

export default Header;
