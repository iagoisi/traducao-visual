import Image from "next/image";
import { GraduationCap, ScanFace, Shapes } from "lucide-react";

const expertise = [
  {
    icon: GraduationCap,
    title: "Formação sólida",
    description:
      "Moda, pós-graduação em Moda, Comunicação e Mercado e especialização em Imagem Pessoal e Empresarial.",
  },
  {
    icon: ScanFace,
    title: "22+ anos",
    description:
      "Direcionando mulheres reais a traduzirem no visual quem elas são.",
  },
  {
    icon: Shapes,
    title: "Método autoral",
    description:
      "Construção Visual Guiada sem fórmulas prontas, regras engessadas ou padrões genéricos",
  },
];

export default function AboutWitySection() {
  return (
    <section
      id="sobre"
      className="relative overflow-x-clip px-5 py-20 text-black sm:px-6 lg:py-28"
    >
      <div className="site-container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 xl:gap-24">
          <div className="relative mx-auto w-full max-w-2xl pb-8 sm:pb-10">
            <div className="absolute inset-x-5 bottom-0 top-8 rounded-[2rem] border border-white/55 bg-white/38 shadow-[0_30px_100px_rgba(107,67,39,0.16)] backdrop-blur" />

            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-white/65 bg-[#eee9e7]">
              <Image
                src="/images/sobre_wity.png"
                alt="Wity Prado ao lado de um manequim"
                fill
                priority={false}
                sizes="(min-width: 1024px) 48vw, 92vw"
                className="object-cover object-center"
              />
            </div>

            <blockquote className="absolute -bottom-1 left-3 max-w-[19rem] rounded-2xl border border-white/65 bg-white/84 p-4 shadow-[0_24px_70px_rgba(107,67,39,0.18)] backdrop-blur sm:-left-5 sm:max-w-[22rem] sm:p-5">
              <p className="text-base font-semibold leading-relaxed text-black/78">
                “Quando voltei a olhar para mim, eu não me reconhecia mais.
                Nem no espelho, nem nas minhas roupas.”
              </p>
              <footer className="mt-3 text-xs uppercase tracking-[0.18em] text-red-500/72">
                O começo da Tradução Visual
              </footer>
            </blockquote>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-red-500/75 sm:text-sm">
              Prazer, eu sou a Wity
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] text-black/90 sm:text-5xl lg:text-[clamp(3rem,5vw,4.75rem)]">
              Eu já vivi esse
              <br />
              <span className="color-red">desalinhamento.</span>
            </h2>

            <div className="mt-7 max-w-2xl space-y-4 text-base leading-7 text-black/62">
              <p>
                No meu caso, foi quando me tornei mãe. Entrei no modo
                sobrevivência e, sem perceber, fui me deixando de lado. Eu
                sabia que não era mais a mesma e precisava traduzir essa nova
                mulher na minha imagem.
              </p>
              <p>
                Foi assim que nasceu a Tradução Visual. Um método construído
                para olhar quem você é hoje e transformar isso em escolhas
                visuais simples, possíveis e verdadeiras.
              </p>
            </div>

            <div className="mt-8 border-l-2 border-red-500/55 pl-5">
              <p className="max-w-xl text-xl font-semibold leading-snug text-black/82 sm:text-2xl">
                Imagem, para mim, nunca foi sobre moda.
                <br />
                Sempre foi sobre verdade.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid overflow-hidden rounded-2xl border border-white/55 bg-white/46 shadow-[0_24px_80px_rgba(107,67,39,0.1)] backdrop-blur md:grid-cols-3 lg:mt-20">
          {expertise.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              className={`p-6 sm:p-7 lg:p-8 ${
                index > 0
                  ? "border-t border-black/8 md:border-l md:border-t-0"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className="h-5 w-5 shrink-0 text-red-500"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-black/86">{title}</h3>
              </div>
              <p className="mt-3 text-base leading-7 text-black/56">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
