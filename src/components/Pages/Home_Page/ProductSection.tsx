import {
  Check,
  Clock3,
  FileText,
  LockKeyhole,
  MessageCircle,
  UserRoundCheck,
} from "lucide-react";
import Button from "../../common/Button";

const benefits = [
  "Experiência guiada pelo WhatsApp, no seu tempo",
  "Tradução Visual personalizada em PDF",
  "Cores, estampas, tecidos, materiais, peças e acessórios",
  "Direcionamento prático para aplicar no dia a dia",
  "Mais clareza para se vestir e menos compras erradas",
  "Encontro ao vivo com a Wity para tirar dúvidas",
];

export default function ProductSection() {
  return (
    <section id="produto" className="relative overflow-x-clip px-5 py-20 text-black sm:px-6 lg:py-28">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/28 bg-[#462936] px-5 py-12 text-white shadow-[0_35px_120px_rgba(70,41,54,0.28)] sm:px-10 lg:px-14 lg:py-16">
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.18fr_0.82fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#ffb7ad] sm:text-sm">
                Você mudou. Sua imagem pode acompanhar.
              </p>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Pronta para se reconhecer de novo?
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
                Por menos do que uma blusa que você acha linda, compra e não usa,
                receba clareza e direção para alinhar sua imagem com a mulher que
                você é hoje.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 text-sm text-white/76">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff786d] text-white">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-6 backdrop-blur sm:p-8">
              <div className="flex items-center gap-3 text-sm text-[#ffb7ad]">
                <FileText className="h-5 w-5" aria-hidden="true" />
                Sua Tradução Visual personalizada
              </div>
              <p className="mt-7 text-sm text-white/55">Investimento único</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="pb-2 text-lg text-white/65">R$</span>
                <strong className="text-6xl font-semibold leading-none text-white">47</strong>
                <span className="pb-2 text-lg text-white/65">,00</span>
              </div>

              <Button
                href="/contato"
                duration={800}
                offset={0}
                className="mt-7 flex w-full items-center justify-center gap-2 bg-[#ff786d] px-5 py-4 text-center"
              >
                Começar agora pelo WhatsApp
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </Button>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-xs text-white/55">
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-[#ffb7ad]" aria-hidden="true" />
                  No seu tempo
                </span>
                <span className="flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 text-[#ffb7ad]" aria-hidden="true" />
                  Dados protegidos
                </span>
              </div>

              <div className="mt-4 flex items-start gap-3 border-t border-white/10 pt-4 text-xs leading-5 text-white/55">
                <UserRoundCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb7ad]"
                  aria-hidden="true"
                />
                Você também conta com suporte humano caso precise de ajuda durante a experiência.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
