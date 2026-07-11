"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { trackInitiateContact } from "@/src/services/Meta/metaPixel";
import HeaderNeo from "@/src/components/common/HeaderNeo";

const sequenceSrc = "/images/ezgif.com-video-to-webp-converter3.webp";
const mobileSequenceFrameCount = 192;
const mobileSequenceFrameSrcs = Array.from(
  { length: mobileSequenceFrameCount },
  (_, index) =>
    `/images/seq_hero/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`
);

const anaWhatsappUrl =
  "https://wa.me/556792373674?text=Ol%C3%A1%2C%20Ana%21%20Quero%20come%C3%A7ar%20minha%20Tradu%C3%A7%C3%A3o%20Visual.%20Pode%20me%20enviar%20o%20link%20para%20pagamento%3F";

type WebpDecoderFrame = {
  image: ImageBitmapSource & {
    close?: () => void;
  };
};

type WebpImageDecoder = {
  tracks: {
    ready: Promise<void>;
    selectedTrack?: {
      frameCount?: number;
    };
  };
  decode: (options: { frameIndex: number }) => Promise<WebpDecoderFrame>;
  close: () => void;
};

type WebpImageDecoderConstructor = new (options: {
  type: string;
  data: BufferSource;
}) => WebpImageDecoder;

type DrawableFrame = CanvasImageSource & {
  naturalWidth?: number;
  naturalHeight?: number;
  videoWidth?: number;
  videoHeight?: number;
  width?: number;
  height?: number;
  close?: () => void;
};

function getSourceSize(image: DrawableFrame) {
  return {
    width: image.naturalWidth ?? image.videoWidth ?? Number(image.width),
    height: image.naturalHeight ?? image.videoHeight ?? Number(image.height),
  };
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: DrawableFrame,
  width: number,
  height: number
) {
  const { width: sourceWidth, height: sourceHeight } = getSourceSize(image);

  if (
    !Number.isFinite(sourceWidth) ||
    !Number.isFinite(sourceHeight) ||
    sourceWidth <= 0 ||
    sourceHeight <= 0
  ) {
    return;
  }

  const imageRatio = sourceWidth / sourceHeight;
  const canvasRatio = width / height;
  const drawWidth = imageRatio > canvasRatio ? height * imageRatio : width;
  const drawHeight = imageRatio > canvasRatio ? height : width / imageRatio;
  const drawX = (width - drawWidth) / 2;
  const drawY = (height - drawHeight) / 2;

  context.clearRect(0, 0, width, height);
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawMobileHeroFrame(
  context: CanvasRenderingContext2D,
  image: DrawableFrame,
  width: number,
  height: number
) {
  const { width: sourceWidth, height: sourceHeight } = getSourceSize(image);

  if (
    !Number.isFinite(sourceWidth) ||
    !Number.isFinite(sourceHeight) ||
    sourceWidth <= 0 ||
    sourceHeight <= 0
  ) {
    return;
  }

  const imageRatio = sourceWidth / sourceHeight;
  const canvasRatio = width / height;
  const coverWidth = imageRatio > canvasRatio ? height * imageRatio : width;
  const coverHeight = imageRatio > canvasRatio ? height : width / imageRatio;
  const mobileScale = 0.72;
  const drawWidth = coverWidth * mobileScale;
  const drawHeight = coverHeight * mobileScale;
  const drawX = (width - drawWidth) / 2;
  const drawY = height - drawHeight + height * 0.08;

  context.fillStyle = "#BDA9A7";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

export default function SequenceHeroTest() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<DrawableFrame[]>([]);
  const frameRef = useRef({ index: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!section || !canvas || !context) return;

    let disposed = false;
    let cleanupAnimation: (() => void) | null = null;

    const renderFrame = () => {
      const frame = framesRef.current[frameRef.current.index];

      if (!frame) return;

      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      const width = Math.max(Math.round(rect.width * pixelRatio), 1);
      const height = Math.max(Math.round(rect.height * pixelRatio), 1);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      if (rect.width < 640) {
        drawMobileHeroFrame(context, frame, width, height);
      } else {
        drawCover(context, frame, width, height);
      }
    };

    const resizeObserver = new ResizeObserver(renderFrame);
    resizeObserver.observe(canvas);

    const setupScrollSequence = async (
      frameCount: number,
      onScrollUpdate?: (progress: number) => void
    ) => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.to(frameRef.current, {
        index: frameCount - 1,
        ease: "none",
        snap: "index",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            onScrollUpdate?.(self.progress);
            renderFrame();
          },
        },
        onUpdate: renderFrame,
      });

      cleanupAnimation = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };

      renderFrame();
    };

    const loadImageFrame = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new window.Image();
        image.decoding = "async";
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });

    const loadMobileSequenceFrames = async () => {
      const firstFrame = await loadImageFrame(mobileSequenceFrameSrcs[0]);

      if (disposed) return;

      framesRef.current = [firstFrame];
      frameRef.current.index = 0;
      renderFrame();

      const loadedFrames = await Promise.all(
        mobileSequenceFrameSrcs.map((src, index) =>
          index === 0 ? Promise.resolve(firstFrame) : loadImageFrame(src)
        )
      );

      if (disposed) return;

      framesRef.current = loadedFrames;
      frameRef.current.index = Math.min(
        frameRef.current.index,
        loadedFrames.length - 1
      );
      renderFrame();
      void setupScrollSequence(loadedFrames.length);
    };

    const decodeWebpFrames = async () => {
      const ImageDecoderConstructor = (
        window as unknown as {
          ImageDecoder?: WebpImageDecoderConstructor;
        }
      ).ImageDecoder;

      if (!ImageDecoderConstructor) {
        await loadMobileSequenceFrames();
        return;
      }

      let decoder: WebpImageDecoder;

      try {
        const response = await fetch(sequenceSrc);
        const buffer = await response.arrayBuffer();
        decoder = new ImageDecoderConstructor({
          type: "image/webp",
          data: buffer,
        });
      } catch {
        await loadMobileSequenceFrames();
        return;
      }

      try {
        await decoder.tracks.ready;
      } catch {
        decoder.close();
        await loadMobileSequenceFrames();
        return;
      }

      if (disposed) {
        decoder.close();
        return;
      }

      const frameCount = decoder.tracks.selectedTrack?.frameCount ?? 1;
      const decodedFrames: ImageBitmap[] = [];

      for (let index = 0; index < frameCount; index += 1) {
        let decodedFrame: WebpDecoderFrame;

        try {
          decodedFrame = await decoder.decode({ frameIndex: index });
        } catch {
          decoder.close();
          await loadMobileSequenceFrames();
          return;
        }

        const { image } = decodedFrame;

        if (disposed) {
          image.close?.();
          break;
        }

        const bitmap = await createImageBitmap(image);
        image.close?.();
        decodedFrames.push(bitmap);

        if (index === 0) {
          framesRef.current = decodedFrames;
          renderFrame();
        }
      }

      if (!disposed) {
        framesRef.current = decodedFrames;
        frameRef.current.index = Math.min(
          frameRef.current.index,
          decodedFrames.length - 1
        );
        renderFrame();
        void setupScrollSequence(decodedFrames.length);
      }

      decoder.close();
    };

    if (window.matchMedia("(max-width: 639px)").matches) {
      void loadMobileSequenceFrames();
    } else {
      void decodeWebpFrames();
    }
    window.addEventListener("resize", renderFrame);

    return () => {
      const frames = framesRef.current;

      disposed = true;
      window.removeEventListener("resize", renderFrame);
      resizeObserver.disconnect();
      cleanupAnimation?.();
      frames.forEach((frame) => frame.close?.());
    };
  }, []);

  const trackAnaContact = () => {
    void trackInitiateContact({
      content_name: "Sua tradução visual aqui",
      content_category: "Hero Sequence Test",
      placement: "hero bottom bar",
      destination: "Ana WhatsApp",
    });
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-[220vh] w-full bg-[#BDA9A7]"
    >
      <HeaderNeo />

      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#BDA9A7]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Sequência visual da hero"
        />

        <div className="pointer-events-none relative z-20 grid h-full grid-rows-[auto_1fr_auto_auto] px-5 pb-9 pt-[7.85rem] sm:grid-rows-[1fr_auto] sm:px-8 sm:pb-0 sm:pt-32 lg:px-12 xl:px-14">
          <div className="grid min-h-0 justify-items-center gap-4 text-center sm:content-center sm:items-center sm:justify-items-stretch sm:gap-8 sm:pb-28 sm:pt-0 sm:text-left lg:grid-cols-[1fr_minmax(20rem,0.86fr)_1fr] lg:pb-20">
            <h1 className="max-w-[23.5rem] scale-x-[0.82] font-sans text-[clamp(2rem,8.55vw,2.18rem)] font-black leading-[1.42] text-[#d71910] [-webkit-text-stroke:0.35px_#d71910] [text-shadow:0.45px_0_0_currentColor,-0.45px_0_0_currentColor] sm:max-w-[8.6ch] sm:scale-x-100 sm:font-heading sm:text-[clamp(2.4rem,7.8vw,5.45rem)] sm:font-normal sm:leading-[1.48] sm:text-[var(--color-red)] sm:[-webkit-text-stroke:0] sm:[text-shadow:none] lg:text-[clamp(2.75rem,4.85vw,5.55rem)]">
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

            <div className="hidden lg:block" />

            <h2 className="ml-auto hidden max-w-[9.2ch] text-right font-normal leading-[1.48] text-[var(--color-red)] sm:block sm:text-[clamp(2.3rem,7.4vw,5.25rem)] lg:text-[clamp(2.65rem,4.65vw,5.35rem)]">
              sente que<br />
              não tem<br />
              nada para<br />
              vestir, né?!
            </h2>
          </div>

          <div className="block sm:hidden" />

          <a
            href={anaWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackAnaContact}
            className="pointer-events-auto relative mx-auto mb-3 flex h-14 w-[min(17.5rem,calc(100vw-4.75rem))] items-center justify-center gap-3 rounded-full bg-[#d71910] px-5 text-white shadow-[0_14px_34px_rgba(120,28,20,0.22)] transition-[background-color] duration-300 hover:bg-[#e83f3f] sm:-mx-8 sm:mb-0 sm:h-18 sm:w-auto sm:justify-start sm:gap-4 sm:rounded-none sm:bg-[var(--color-red)] sm:px-10 sm:shadow-[0_-18px_60px_rgba(120,28,20,0.16)] lg:-mx-12 xl:-mx-14"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d71910] sm:h-20 sm:w-20 sm:bg-[var(--color-red)] sm:shadow-[0_10px_34px_rgba(120,28,20,0.22)]">
              <Image
                src="/images/whatsApp.png"
                alt=""
                width={123}
                height={123}
                className="h-8 w-8 object-contain sm:h-12 sm:w-12"
              />
            </span>
            <span className="text-[0.95rem] font-bold leading-none sm:text-xl">
              sua tradução visual aqui
            </span>
          </a>

          <p className="mx-auto max-w-[18.5rem] text-center text-[0.94rem] font-bold leading-[1.18] text-[#1c1514] sm:hidden">
            É falta de clareza e critério para fazer escolhas que funcionem na sua vida.
          </p>
        </div>
      </div>
    </section>
  );
}
