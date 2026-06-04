"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const questions = [
  {
    question: "Isso é uma consultoria de moda?",
    answer:
      "Não. A Tradução Visual é o primeiro passo para entender o que faz sentido para você hoje. Ela interpreta sua fase, rotina, corpo e intenção para entregar um direcionamento visual prático, sem fórmulas prontas.",
  },
  {
    question: "A Tradução Visual é guiada por uma IA?",
    answer:
      "Sim, pela Ana no WhatsApp. Mas ela não é uma IA genérica: foi treinada com o método e o olhar da Wity para conduzir uma conversa acolhedora, interpretar suas respostas e criar uma entrega personalizada.",
  },
  {
    question: "Vou precisar renovar todo o meu guarda-roupa?",
    answer:
      "Não. A ideia é justamente parar de comprar errado. Você começa entendendo melhor o que já possui, o que ainda representa você e como fazer escolhas futuras com mais clareza e intenção.",
  },
  {
    question: "O que vou receber ao final?",
    answer:
      "Você recebe pelo WhatsApp um PDF personalizado com intenção visual, tonalidades, estampas, tecidos, texturas, materiais, calçados, acessórios, consciência corporal e direcionamentos para aplicar tudo no cotidiano.",
  },
  {
    question: "Posso continuar falando com a Ana depois da entrega?",
    answer:
      "A Ana finaliza o atendimento após entregar sua Tradução Visual. Caso surjam dúvidas depois disso, você poderá falar com a Vitória, responsável pelo suporte humano no WhatsApp.",
  },
  {
    question: "Preciso responder tudo de uma vez?",
    answer:
      "Não. A conversa acontece no seu tempo. Você pode pensar com calma, responder com sinceridade e continuar depois. Quanto mais detalhadas forem suas respostas, mais rica será sua Tradução Visual.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="duvidas" className="relative overflow-x-clip px-5 py-20 text-black sm:px-6 lg:py-28">
      <div className="site-container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-red-500 text-white shadow-[0_16px_45px_rgba(255,82,82,0.3)]">
            <MessageCircleQuestion className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-red-500/75 sm:text-sm">
            Antes de começar
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-black/90 sm:text-5xl">
            Dúvidas
            <br />
            frequentes.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-black/58 sm:text-base">
            Respostas claras para você começar com segurança, sabendo como a experiência funciona e o que será entregue.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/55 bg-white/52 shadow-[0_28px_90px_rgba(107,67,39,0.13)] backdrop-blur">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className="border-b border-black/8 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className={`group flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors duration-300 sm:px-7 ${
                    isOpen ? "bg-white/28" : "hover:bg-white/38"
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-black/82 sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-red-500 transition-transform duration-300 group-hover:scale-110 ${
                      isOpen ? "rotate-180" : "group-hover:translate-y-0.5"
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 text-sm leading-7 text-black/58 sm:px-7">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
