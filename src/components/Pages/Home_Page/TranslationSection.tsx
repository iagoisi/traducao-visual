"use client";

import Image from "next/image";
import {
  type ComponentType,
  type SVGProps,
  useEffect,
  useRef,
  useState,
} from "react";
import TiltedCard from "@/components/TiltedCard";
import {
  BookOpenCheck,
  BrainCircuit,
  ClipboardList,
} from "lucide-react";

type FeatureItem = {
  imageSrc: string;
  title: string;
  description: string;
};

type TimelineStep = {
  marker: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  eyebrow: string;
  title: string;
  description: string;
};

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2a9.84 9.84 0 0 0-8.47 14.84L2 22l5.29-1.5A9.9 9.9 0 1 0 12.04 2Zm0 17.77a7.8 7.8 0 0 1-3.98-1.08l-.29-.17-3.14.89.93-3.05-.19-.31a7.77 7.77 0 1 1 6.67 3.72Zm4.27-5.82c-.23-.12-1.38-.68-1.59-.76-.21-.08-.37-.12-.52.12-.16.23-.61.76-.75.91-.14.16-.27.18-.51.06-.23-.12-.99-.36-1.88-1.16a7.03 7.03 0 0 1-1.3-1.62c-.14-.23-.02-.36.1-.48.1-.1.23-.27.35-.41.12-.14.16-.23.23-.39.08-.15.04-.29-.02-.41-.06-.12-.52-1.26-.72-1.73-.19-.45-.38-.39-.52-.4h-.45c-.15 0-.41.06-.62.29-.21.23-.81.79-.81 1.93 0 1.13.83 2.23.94 2.39.12.15 1.63 2.48 3.94 3.48.55.24.98.38 1.32.49.55.18 1.05.15 1.45.09.44-.07 1.38-.57 1.57-1.11.2-.54.2-1 .14-1.1-.06-.1-.22-.16-.45-.27Z" />
    </svg>
  );
}

const translationFeatures: FeatureItem[] = [
    {
    imageSrc: "/images/TranslationSection/bloco1/vestir.png",
    title: "Clareza",
    description: "Entenda o que faz sentido para você hoje.",
  },
  {
    imageSrc: "/images/TranslationSection/bloco1/bussola.png",
    title: "Direção",
    description: "Saiba por onde começar e para onde ir.",
  },
  {
    imageSrc: "/images/TranslationSection/bloco1/plano-de-saude.png",
    title: "Segurança",
    description: "Escolha com confiança e autonomia.",
  },
  {
    imageSrc: "/images/TranslationSection/bloco1/espelho.png",
    title: "Reconhecimento",
    description: "Você se reencontrando e se sentindo bem com isso.",
  },
];

const processSteps: TimelineStep[] = [
  {
    marker: "1",
    icon: WhatsAppIcon,
    eyebrow: "Conversa guiada",
    title: "Você fala com a Ana",
    description:
      "Seu processo de transformação começa com uma conversa pelo WhatsApp com a Ana, nossa assistente de IA.",
  },
  {
    marker: "2",
    icon: ClipboardList,
    eyebrow: "Leitura da sua fase",
    title: "Responda algumas perguntas",
    description:
      "Ela te faz perguntas estratégicas para entender sua fase de vida, rotina, preferências e objetivos.",
  },
  {
    marker: "3",
    icon: BrainCircuit,
    eyebrow: "Método autoral",
    title: "A Ana interpreta suas respostas",
    description:
      "Com base no meu método autoral, a Ana interpreta suas respostas e cria sua Tradução Visual personalizada.",
  },
  {
    marker: "4",
    icon: BookOpenCheck,
    eyebrow: "Direção para aplicar",
    title: "Você recebe sua Tradução Visual",
    description:
      "Um guia completo em PDF, com direcionamentos práticos e personalizados para você aplicar sua Tradução Visual no dia a dia.",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <article className="flex h-full min-w-0 flex-col items-center justify-center gap-[clamp(0.4rem,1vh,0.7rem)] text-center">
      <div className="relative h-[clamp(3rem,6.5vh,4rem)] w-[clamp(3rem,6.5vh,4rem)] shrink-0">
        <Image
          src={item.imageSrc}
          alt=""
          fill
          sizes="64px"
          className="object-contain"
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-[clamp(0.9rem,1.65vh,1.05rem)] font-semibold leading-tight text-black/88">{item.title}</h3>
        <p className="mt-1 max-w-md text-[clamp(0.72rem,1.35vh,0.9rem)] leading-[1.4] text-black/58">{item.description}</p>
      </div>
    </article>
  );
}

function TimelineCard({
  step,
  index,
  active,
  hasActivated,
}: {
  step: TimelineStep;
  index: number;
  active: boolean;
  hasActivated: boolean;
}) {
  const Icon = step.icon;

  return (
    <article
      className={`relative grid h-full min-h-[25rem] w-full grid-rows-[auto_auto_1fr] rounded-2xl border p-4 transition-[border-color,background-color,box-shadow] duration-500 md:min-h-[26rem] xl:min-h-0 lg:p-[clamp(0.75rem,1.8vh,1.25rem)] ${
        active
          ? "timeline-card--activated border-red-500/35 bg-[#fffaf3] shadow-[0_22px_70px_rgba(255,82,82,0.18)]"
          : `${
              hasActivated ? "timeline-card--deactivated" : ""
            } border-black/10 bg-[#fff8e9]`
      }`}
    >
      <div
        className={`absolute -left-[3.625rem] top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border text-xs font-semibold shadow-[0_16px_38px_rgba(0,0,0,0.16)] transition-all duration-500 md:left-1/2 md:top-0 md:-translate-x-1/2 md:-translate-y-1/2 ${
          active
            ? "border-red-500 bg-red-500 text-white shadow-[0_12px_38px_rgba(255,82,82,0.26)]"
            : "border-black/12 bg-white/85 text-black/48"
        }`}
        aria-hidden="true"
      >
        {step.marker}
      </div>

      <div className="relative mb-3 h-40 overflow-hidden rounded-xl border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(255,226,217,0.66))] sm:h-44 lg:mb-[clamp(0.5rem,1.4vh,1rem)] xl:h-[clamp(7.5rem,16vh,10rem)]">
        <div className="absolute left-4 top-4 rounded-full border border-red-500/18 bg-white/68 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-red-500/75 backdrop-blur">
          {step.eyebrow}
        </div>
        <div className="absolute bottom-9 right-[-1.5rem] h-px w-28 -rotate-[28deg] bg-red-500/12" />
        <div
          className={`absolute inset-0 flex items-center justify-center pt-8 transition-transform duration-500 ${
            active ? "scale-100" : "scale-95"
          }`}
        >
          <div className="grid h-16 w-16 place-items-center rounded-xl border border-white/70 bg-white/76 text-red-500 shadow-[0_16px_42px_rgba(255,82,82,0.16)] backdrop-blur">
            <Icon className="h-8 w-8" strokeWidth={1.6} aria-hidden="true" />
          </div>
        </div>
      </div>
      <h3 className="min-h-[2.5rem] text-sm font-semibold leading-tight text-black/88 lg:text-[clamp(0.78rem,1.35vh,0.95rem)]">{step.title}</h3>
      <p className="mt-2 text-sm leading-6 text-black/58 lg:mt-[clamp(0.35rem,1vh,0.75rem)] lg:text-[clamp(0.72rem,1.35vh,0.875rem)] lg:leading-[1.45]">{step.description}</p>
      <span className="sr-only">Etapa {index + 1}</span>
    </article>
  );
}

export default function TranslationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [activatedSteps, setActivatedSteps] = useState<boolean[]>(() =>
    processSteps.map(() => false)
  );
  const [visitedSteps, setVisitedSteps] = useState<boolean[]>(() =>
    processSteps.map(() => false)
  );

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      const timeline = timelineRef.current;
      if (!section || !timeline) return;

      const stickyDesktop = window.matchMedia(
        "(min-width: 1280px) and (min-height: 820px)"
      ).matches;

      let nextProgress = 0;

      if (stickyDesktop) {
        const rect = section.getBoundingClientRect();
        const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
        nextProgress = clamp(-rect.top / scrollableDistance, 0, 1);
      } else {
        const rect = timeline.getBoundingClientRect();
        const viewportTrigger = window.innerHeight * 0.65;
        nextProgress = clamp(
          (viewportTrigger - rect.top) / Math.max(rect.height, 1),
          0,
          1
        );
      }

      setProgress(nextProgress);
      const activatedThrough =
        nextProgress > 0.02
          ? Math.min(
              Math.floor(nextProgress * processSteps.length),
              processSteps.length - 1
            )
          : -1;

      setActivatedSteps((current) => {
        const next = current.map((_, index) => index <= activatedThrough);
        return next.some((value, index) => value !== current[index])
          ? next
          : current;
      });

      if (activatedThrough >= 0) {
        setVisitedSteps((current) => {
          let changed = false;
          const next = current.map((wasVisited, index) => {
            const isVisited = wasVisited || index <= activatedThrough;
            changed ||= isVisited !== wasVisited;
            return isVisited;
          });

          return changed ? next : current;
        });
      }
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const activeStep = clamp(
    Math.floor(progress * processSteps.length),
    0,
    processSteps.length - 1
  );

  return (
    <section
      id="traducao"
      ref={sectionRef}
      className="translation-section relative overflow-x-clip overflow-y-visible text-black"
    >
      <div className="translation-stage grid gap-20 px-5 py-20 sm:px-6 md:gap-24">
        <div className="translation-top site-container relative z-20 grid min-h-0 grid-cols-1 place-content-center items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] xl:overflow-visible xl:gap-[clamp(1rem,2.5vh,2rem)]">
          <div className="mx-auto w-full max-w-2xl">
            <p className="text-[clamp(0.68rem,1.25vh,0.85rem)] uppercase tracking-[0.24em] text-red-500/70">
              MÉTODO AUTORAL
            </p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-black/90 sm:text-4xl lg:mt-[clamp(0.4rem,1vh,0.7rem)] lg:text-[clamp(1.55rem,4vh,2.35rem)]">
              Por isso nasceu a<br /> <span className="color-red">Tradução Visual.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-black/62 lg:mt-[clamp(0.5rem,1.4vh,0.9rem)] lg:text-[clamp(0.78rem,1.55vh,0.95rem)] lg:leading-[1.5]">
              Um diagnóstico visual guiado que interpreta sua fase atual<br />
              e transforma isso em <span className="color-red">direcionamentos visuais práticos</span> para o seu dia a dia.
            </p>

            <div className="mt-5 h-[22rem] w-full sm:h-[14rem] lg:mt-[clamp(0.9rem,2.2vh,1.4rem)] xl:h-[clamp(11rem,22vh,13rem)]">
              <TiltedCard
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={8}
                scaleOnHover={1.015}
                showMobileWarning={false}
                showTooltip={false}
                cardClassName="rounded-2xl border border-white/50 bg-white/54 p-[clamp(0.75rem,1.8vh,1.15rem)] shadow-[0_24px_70px_rgba(107,67,39,0.16)] backdrop-blur"
              >
                <div className="grid h-full grid-cols-2 items-stretch gap-3 sm:grid-cols-4 sm:gap-[clamp(0.5rem,1.3vh,0.9rem)]">
                  {translationFeatures.map((item) => (
                    <FeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </TiltedCard>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-2xl items-center lg:flex lg:min-h-0 xl:h-full">
            <div className="relative mx-auto h-[22rem] w-[min(92%,32rem)] sm:h-[28rem] lg:ml-auto lg:h-[24rem] lg:w-[78%] xl:h-[min(37vh,100%)] xl:max-h-[360px]">
              <TiltedCard
                imageSrc="/images/woman_TranslationSection.png"
                altText="Referência visual para tradução de imagem"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                imageObjectFit="contain"
                rotateAmplitude={30}
                scaleOnHover={1.03}
                showMobileWarning={false}
                showTooltip={false}
                cardClassName="rounded-[2rem] border border-white/50 bg-white/30 shadow-[0_30px_100px_rgba(107,67,39,0.18)]"
                imageClassName="rounded-[2rem]"
                displayOverlayContent
                overlayContent={
                  <div className="absolute right-2 top-2 z-10 w-[min(14rem,76%)] rounded-2xl border border-white/46 bg-white/78 p-[clamp(0.6rem,1.25vh,0.8rem)] text-[clamp(0.85rem,1.7vh,1.05rem)] font-semibold leading-tight text-black/84 shadow-[0_28px_80px_rgba(107,67,39,0.16)] backdrop-blur sm:-right-4 sm:-top-6 lg:-right-12 xl:-right-20 xl:-top-8">
                    Sua imagem não precisa gritar. Ela precisa traduzir você.
                  </div>
                }
              />
            </div>
          </div>
        </div>

        <div
          id="como-funciona"
          ref={timelineRef}
          className="translation-bottom relative z-10 grid min-h-0 place-content-center xl:overflow-visible"
        >
          <div className="site-container mx-auto">
            <div className="relative flex flex-col items-center gap-3 text-center">
              <div>
                <h2 className="text-[clamp(1.6rem,4vh,2.25rem)] font-semibold leading-tight text-black/90">
                  Como funciona
                </h2>
                <p className="mt-[clamp(0.35rem,1vh,0.5rem)] text-[clamp(0.75rem,1.45vh,0.875rem)] leading-[1.45] text-black/58">
                  Simples, prático e 100% pelo WhatsApp.
                </p>
              </div>
              <div className="text-sm font-medium text-red-500/78 md:absolute md:bottom-0 md:right-0 lg:text-[clamp(0.75rem,1.45vh,0.875rem)]">
                {String(activeStep + 1).padStart(2, "0")} / {String(processSteps.length).padStart(2, "0")}
              </div>
            </div>

            <div className="relative mt-[clamp(1rem,2.6vh,1.75rem)] xl:pt-10">
              <div className="absolute bottom-6 left-7 top-6 w-px bg-black/12 md:hidden" />
              <div
                className="absolute left-7 top-6 w-px bg-gradient-to-b from-red-500 via-[#ff9f8b] to-[#ffe0ba] transition-[height] duration-300 md:hidden"
                style={{
                  height: `max(0px, calc(${progress * 100}% - 1.5rem))`,
                }}
              />
              <div className="absolute left-0 right-0 top-[calc(50%+1.25rem)] hidden h-px bg-black/12 xl:block" />
              <div
                className="absolute left-0 top-[calc(50%+1.25rem)] hidden h-px bg-gradient-to-r from-red-500 via-[#ff9f8b] to-[#ffe0ba] transition-[width] duration-300 xl:block"
                style={{ width: `${progress * 100}%` }}
              />

              <div className="relative z-10 grid gap-8 pl-16 pt-4 md:grid-cols-2 md:gap-8 md:pl-0 xl:grid-cols-4 xl:gap-20 xl:pt-0">
                {processSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="relative h-full [perspective:1200px]"
                  >
                    <TimelineCard
                      step={step}
                      index={index}
                      active={activatedSteps[index]}
                      hasActivated={visitedSteps[index]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
