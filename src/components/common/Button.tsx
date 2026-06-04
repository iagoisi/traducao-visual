"use client";

import { smoothScrollTo } from "@/src/utils/smoothScroll";

type ButtonProps = {
  href?: string;
  children?: React.ReactNode;
  duration?: number;
  offset?: number;
  className?: string;
  bgColor?: string;
  onClick?: () => void;
};

export default function Button({
  href,
  children,
  duration = 1200,
  offset = 96,
  className = "",
  bgColor = "var(--color-red)",
  onClick,
}: ButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.();

    if (!href?.startsWith("#")) return;

    event.preventDefault();
    smoothScrollTo(href, { duration, offset });
  };

    return (
      <a
        href={href}
        onClick={handleClick}
        className={`background-red inline-flex cursor-pointer items-center rounded-4xl px-8 py-4 text-md font-medium text-white bg-red shadow-[0_12px_32px_rgba(255,82,82,0.22)] transition-[transform,background-color,color,box-shadow] duration-300 hover:-translate-y-1 hover:!bg-[#fff0ee] hover:!text-red-500 hover:shadow-[0_18px_42px_rgba(255,82,82,0.28)] active:translate-y-0 active:scale-[0.98] ${className}`}
      >
        {children ?? "Quero minha Tradução Visual"}
      </a>
    );
  }
