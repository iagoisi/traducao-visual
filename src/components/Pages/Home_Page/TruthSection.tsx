import Image from "next/image";
import ScrollNextButton from "../../common/ScrollNextButton";

type TruthListItem = {
  text: string;
  secondLine?: string;
};

const learnedItems: TruthListItem[] = [
  { text: "Seguir tendências" },
  { text: "Copiar referências" },
  { text: "Usar regrinhas prontas" },
  { text: "Ouvir a opinião dos outros" },
  { text: "Comprar porque serviu", secondLine: "ou achou bonito" },
];


const missingItems: TruthListItem[] = [
  { text: "Interpretar quem você é hoje" },
  { text: "Comunicar isso visualmente" },
  { text: "Construir coerência" },
  { text: "Se reconhecer de novo" },
  { text: "Traduzir sua identidade", secondLine: "em imagem" },
];

function TruthItem({
  tone,
  children,
}: {
  tone: "wrong" | "right";
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 text-sm leading-7 text-black/68">
      <span
        className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-base font-bold ${
          tone === "wrong"
            ? "bg-red-500/12 text-red-500"
            : "bg-emerald-500/12 text-emerald-600"
        }`}
        aria-hidden="true"
      >
        {tone === "wrong" ? "x" : "✓"}
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function TruthSection() {
  return (
    <section id="verdade" className="relative flex min-h-[100svh] overflow-x-clip overflow-y-visible px-5 pb-28 pt-16 text-black sm:px-6 sm:pt-20 lg:py-24">
      <div className="site-container grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[#ead9aa] sm:min-h-[400px] lg:min-h-[480px] xl:min-h-[520px]">
          <Image
            src="/images/onee-hero.png"
            alt="Mulher provando roupa diante do espelho"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[62%_center]"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-black/45 sm:text-sm sm:tracking-[0.28em]">
            Tradução Visual
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-black/90 sm:text-5xl lg:text-4xl xl:text-5xl">
            O que ninguém<br /> te ensinou.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:mt-8 xl:mt-10">
            <article className="rounded-2xl border border-black/10 bg-white/58 p-5 shadow-[0_24px_80px_rgba(85,60,25,0.12)] backdrop-blur sm:p-6">
              <h3 className="text-xl font-semibold text-black/88">Você aprendeu a:</h3>
              <ul className="mt-5 space-y-3">
                {learnedItems.map((item) => (
                  <TruthItem key={item.text} tone="wrong">
                    {item.text}
                    {item.secondLine && (
                      <>
                        <br />
                        {item.secondLine}
                      </>
                    )}
                  </TruthItem>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-black/10 bg-white/78 p-5 shadow-[0_24px_80px_rgba(85,60,25,0.14)] backdrop-blur sm:p-6">
              <h3 className="text-xl font-semibold text-black/88">Mas não aprendeu a:</h3>
              <ul className="mt-5 space-y-3">
                {missingItems.map((item) => (
                  <TruthItem key={item.text} tone="right">
                    {item.text}
                    {item.secondLine && (
                      <>
                        <br />
                        {item.secondLine}
                      </>
                    )}
                  </TruthItem>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
      <ScrollNextButton
        target="#traducao"
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      />
    </section>
  );
}
