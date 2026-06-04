"use client";

import { smoothScrollTo } from "@/src/utils/smoothScroll";

type ScrollNextButtonProps = {
  target: string;
  label?: string;
  className?: string;
};

export default function ScrollNextButton({
  target,
  label = "Ir para a próxima seção",
  className = "",
}: ScrollNextButtonProps) {
  const handleClick = () => {
    smoothScrollTo(target, { duration: 500, offset: 40 });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group z-20 grid h-16 w-16 cursor-pointer place-items-center rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 ${className}`}
      aria-label={label}
    >
      <span className="relative grid h-16 w-16 place-items-center">
        <span className="absolute inset-0 animate-[scroll-next_1.55s_ease-in-out_infinite] rounded-full border border-black/10 bg-white/58 shadow-[0_20px_60px_rgba(85,60,25,0.18)] backdrop-blur-md transition-colors duration-300 [animation-delay:180ms] group-hover:bg-white/82" />
        <span className="relative grid h-10 w-10 animate-[scroll-next_1.55s_ease-in-out_infinite] place-items-center rounded-full bg-[var(--color-red)]/90 text-white shadow-[0_10px_28px_rgba(255,82,82,0.28)] transition-[background-color,box-shadow] duration-300 group-hover:bg-[var(--color-red)] group-hover:shadow-[0_14px_36px_rgba(255,82,82,0.42)]">
          <span className="block h-3 w-3 translate-y-[-1px] rotate-45 border-b-2 border-r-2 border-current" />
        </span>
      </span>
    </button>
  );
}
