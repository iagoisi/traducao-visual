type SmoothScrollOptions = {
  duration?: number;
  offset?: number;
};

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export function smoothScrollTo(targetSelector: string, options: SmoothScrollOptions = {}) {
  const target = document.querySelector(targetSelector);

  if (!target) return;

  const duration = options.duration ?? 1200;
  const offset = options.offset ?? 96;
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY - offset;
  const distance = end - start;
  const startTime = performance.now();

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    window.scrollTo(0, start + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}
