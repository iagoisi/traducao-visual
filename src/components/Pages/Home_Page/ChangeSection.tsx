"use client";

import ScrollNextButton from "../../common/ScrollNextButton";
import OrbitImages from "../../Visualization/OrbitImages";

const orbitImages = [
  "/images/section2/a.png",
  "/images/section2/b.png",
  "/images/section2/c.png",
  "/images/section2/d.png",
  "/images/section2/e.png",
  "/images/section2/f.png",
];

const innerOrbitIcons = [
  "/images/iconsOrbit/coracao.png",
  "/images/iconsOrbit/espelho.png",
  "/images/iconsOrbit/estrela.png",
  "/images/iconsOrbit/vestido.png",
];

const outerOrbitIcons = [
  "/images/iconsOrbit/coracao_partido.png",
  "/images/iconsOrbit/mae.png",
  "/images/iconsOrbit/manequim.png",
  "/images/iconsOrbit/vinho.png",
];

export default function ChangeSection() {
  const scrollToTruthSection = () => {
    document.getElementById("verdade")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="mudanca" className="relative flex min-h-[100svh] flex-col overflow-x-clip overflow-y-visible px-5 pb-24 pt-14 text-white sm:px-6 sm:pb-24 sm:pt-16 lg:py-16">
      <div className="site-container flex flex-1 flex-col justify-center gap-7 sm:gap-9 lg:gap-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-8">
          <h2 className="mt-2 max-w-xl text-3xl font-semibold leading-tight text-black/90 sm:text-4xl lg:text-3xl">
            A vida muda.
            <br />
            E você muda com ela.
            <br />
            Sua imagem pode <span className="color-red">acompanhar</span>
            <br />
          </h2>

          <div className="mt-0 max-w-lg self-end text-left lg:mt-6 lg:text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-black/50 sm:text-sm sm:tracking-[0.28em]">
              Toda mudança interna pede
              <br />
              uma nova expressão visual.
              <br />
              <span className="color-red">O problema é quando ela não vem.</span>
              <br />
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative mx-auto grid w-full max-w-[min(88vw,640px)] place-items-center overflow-visible sm:max-w-[min(82vw,640px)] lg:max-w-[620px]">
            <div className="relative aspect-square w-full">
              <div className="pointer-events-none absolute inset-0 z-0">
                <OrbitImages
                  images={outerOrbitIcons}
                  altPrefix="Ícone da órbita externa"
                  shape="circle"
                  radius={520}
                  rotation={-18}
                  duration={34}
                  direction="normal"
                  itemSize={65}
                  fill
                  responsive
                  showPath
                  pathColor="rgba(255, 82, 82, 0.2)"
                  pathWidth={1}
                />
              </div>

              <div className="absolute inset-0 z-10">
                <OrbitImages
                  images={orbitImages}
                  shape="circle"
                  radius={380}
                  rotation={60}
                  duration={20}
                  itemSize={160}
                  fill
                  responsive
                  showPath
                  pathColor="rgba(255, 82, 82, 0.52)"
                  pathWidth={1}
                  centerContent={
                    <div className="grid h-24 w-24 place-items-center rounded-full border border-white/15 bg-black/8 text-center backdrop-blur-md bg-red sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                      <button
                        type="button"
                        onClick={scrollToTruthSection}
                        className="h-full w-full cursor-pointer rounded-full px-3 text-[0.65rem] uppercase tracking-[0.16em] text-white transition-[transform,background-color,box-shadow] duration-300 hover:scale-105 hover:bg-white/12 hover:shadow-[0_18px_50px_rgba(255,82,82,0.28)] active:scale-95 sm:px-5 sm:text-xs sm:tracking-[0.2em] lg:text-sm lg:tracking-[0.22em]"
                      >
                        Nova Percepção
                      </button>
                    </div>
                  }
                />
              </div>

              <div className="pointer-events-none absolute inset-0 z-20">
                <OrbitImages
                  images={innerOrbitIcons}
                  altPrefix="Ícone da órbita interna"
                  shape="circle"
                  radius={245}
                  rotation={24}
                  duration={26}
                  direction="normal"
                  itemSize={65}
                  fill
                  responsive
                  showPath
                  pathColor="rgba(255, 82, 82, 0.3)"
                  pathWidth={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollNextButton
        target="#verdade"
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      />
    </section>
  );
}
