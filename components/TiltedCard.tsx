import type { SpringOptions } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface TiltedCardProps {
  imageSrc?: React.ComponentProps<'img'>['src'];
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  cardClassName?: string;
  imageClassName?: string;
  imageObjectFit?: React.CSSProperties['objectFit'];
  autoTiltOnMobile?: boolean;
  children?: React.ReactNode;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  imageSrc,
  altText = 'Imagem do cartão inclinado',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  cardClassName = '',
  imageClassName = '',
  imageObjectFit = 'cover',
  autoTiltOnMobile = false,
  children
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const pointerInteractionUntilRef = useRef(0);
  const lastYRef = useRef(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const applyTilt = useCallback((clientX: number, clientY: number) => {
    const element = ref.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const offsetX = clientX - rect.left - rect.width / 2;
    const offsetY = clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(clientX - rect.left);
    y.set(clientY - rect.top);

    const velocityY = offsetY - lastYRef.current;
    rotateFigcaption.set(-velocityY * 0.6);
    lastYRef.current = offsetY;
  }, [rotateAmplitude, rotateFigcaption, rotateX, rotateY, x, y]);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    pointerInteractionUntilRef.current = performance.now() + 1200;
    applyTilt(e.clientX, e.clientY);
  }

  function handlePointerEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handlePointerLeave() {
    pointerInteractionUntilRef.current = performance.now() + 1200;
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    lastYRef.current = 0;
  }

  useEffect(() => {
    if (!autoTiltOnMobile) return;

    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!coarsePointer.matches || reducedMotion.matches) return;

    let animationFrame = 0;
    const startedAt = performance.now();

    const animate = (now: number) => {
      const element = ref.current;

      if (element && now > pointerInteractionUntilRef.current) {
        const rect = element.getBoundingClientRect();
        const elapsed = (now - startedAt) / 1000;
        const driftX = Math.sin(elapsed * 0.72) * rect.width * 0.26;
        const driftY = Math.cos(elapsed * 0.58) * rect.height * 0.2;

        scale.set(scaleOnHover);
        opacity.set(0);
        applyTilt(
          rect.left + rect.width / 2 + driftX,
          rect.top + rect.height / 2 + driftY
        );
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      scale.set(1);
      rotateX.set(0);
      rotateY.set(0);
      rotateFigcaption.set(0);
      lastYRef.current = 0;
    };
  }, [
    autoTiltOnMobile,
    opacity,
    applyTilt,
    rotateAmplitude,
    rotateFigcaption,
    rotateX,
    rotateY,
    scale,
    scaleOnHover,
  ]);

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      onPointerUp={handlePointerLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          Este efeito é otimizado para telas maiores. Confira no computador.
        </div>
      )}

      <motion.div
        className={`relative [transform-style:preserve-3d] ${cardClassName}`}
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        {imageSrc && (
          <motion.img
            src={imageSrc}
            alt={altText}
            className={`absolute left-0 top-0 will-change-transform [transform:translateZ(0)] ${imageClassName}`}
            style={{
              width: imageWidth,
              height: imageHeight,
              objectFit: imageObjectFit
            }}
          />
        )}

        {children}

        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute inset-0 z-[2] h-full w-full will-change-transform [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
