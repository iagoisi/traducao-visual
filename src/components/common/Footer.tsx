"use client";

import Image from "next/image";
import { Camera, Mail, MessageCircle } from "lucide-react";
import { trackInitiateContactSupport } from "@/src/services/Meta/metaPixel";

const navigation = [
  { href: "#inicio", label: "Início" },
  { href: "#traducao", label: "Tradução Visual" },
  { href: "#sobre", label: "Sobre a Wity" },
  { href: "#duvidas", label: "Dúvidas" },
];

const supportWhatsappUrl =
  "https://wa.me/556791100122?text=Ol%C3%A1%21%20Preciso%20de%20suporte%20sobre%20a%20Tradu%C3%A7%C3%A3o%20Visual.";

const instagramUrl = "https://www.instagram.com/wityprado";

export default function Footer() {
  return (
    <footer className="relative border-t border-black/8 px-5 pb-8 pt-14 text-black sm:px-6 lg:pt-18">
      <div className="site-container">
        <div className="grid gap-10 pb-12 md:grid-cols-[1.25fr_0.75fr_0.8fr]">
          <div>
            <Image
              src="/images/logotipo_traducao_visual.png"
              alt="Tradução Visual"
              width={210}
              height={70}
              className="h-auto w-44 brightness-0"
            />
            <p className="mt-5 max-w-md text-base leading-7 text-black/55 sm:text-sm">
              Uma leitura da sua imagem para revelar, com clareza, a mulher que você se tornou.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-black/82">Navegue</h2>
            <nav className="mt-4 grid gap-3 text-base text-black/55 sm:text-sm">
              {navigation.map((item) => (
                <a key={item.label} href={item.href} className="w-fit transition-[color,transform] duration-300 hover:translate-x-1 hover:text-red-500">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-black/82">Conecte-se</h2>
            <div className="mt-4 grid gap-3 text-base text-black/55 sm:text-sm">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-fit items-center gap-3 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-red-500"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                Instagram
              </a>
              <a
                href={supportWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  void trackInitiateContactSupport({
                    content_name: "WhatsApp suporte",
                    content_category: "Footer",
                    placement: "footer support",
                    destination: "Support WhatsApp",
                  });
                }}
                className="group flex w-fit items-center gap-3 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-red-500"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Suporte
              </a>
              <a href="mailto:tradutoravisual@gmail.com" className="group flex w-fit items-center gap-3 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-red-500">
                <Mail className="h-4 w-4" aria-hidden="true" />
                tradutoravisual@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-5 border-t border-black/8 pt-6 text-base text-black/42 sm:text-sm lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <p>© 2026 Tradução Visual. Todos os direitos reservados.</p>
          <div className="contents">
            <a
              href="https://iagoisi.isitech.online"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Feito por ISI Tech"
              className="flex w-fit items-center gap-3 rounded-full border border-black/10 bg-white/65 px-3 py-2 text-black/45 transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-red-500/35 hover:text-red-500 lg:col-start-3 lg:row-start-1 lg:justify-self-end"
            >
              <span className="text-xs font-medium uppercase leading-none tracking-[0.16em]">Feito por</span>
              <Image
                src="/images/isi_tech.PNG"
                alt="ISI Tech"
                width={96}
                height={96}
                className="h-8 w-8 rounded-md bg-white object-contain"
              />
            </a>
            <div className="flex gap-5 lg:col-start-2 lg:row-start-1 lg:justify-self-center">
              <a href="#" className="transition-colors duration-300 hover:text-red-500">Privacidade</a>
              <a href="#" className="transition-colors duration-300 hover:text-red-500">Termos de uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
