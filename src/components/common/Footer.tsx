import Image from "next/image";
import { Camera, Mail, MessageCircle } from "lucide-react";

const navigation = [
  { href: "#inicio", label: "Início" },
  { href: "#traducao", label: "Tradução Visual" },
  { href: "#sobre", label: "Sobre a Wity" },
  { href: "#duvidas", label: "Dúvidas" },
];

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
            <p className="mt-5 max-w-md text-sm leading-7 text-black/55">
              Uma leitura da sua imagem para revelar, com clareza, a mulher que você se tornou.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-black/82">Navegue</h2>
            <nav className="mt-4 grid gap-3 text-sm text-black/55">
              {navigation.map((item) => (
                <a key={item.label} href={item.href} className="w-fit transition-[color,transform] duration-300 hover:translate-x-1 hover:text-red-500">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-black/82">Conecte-se</h2>
            <div className="mt-4 grid gap-3 text-sm text-black/55">
              <a href="#" className="group flex w-fit items-center gap-3 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-red-500">
                <Camera className="h-4 w-4" aria-hidden="true" />
                Instagram
              </a>
              <a href="#" className="group flex w-fit items-center gap-3 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-red-500">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
              <a href="mailto:contato@traducaovisual.com.br" className="group flex w-fit items-center gap-3 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-red-500">
                <Mail className="h-4 w-4" aria-hidden="true" />
                contato@traducaovisual.com.br
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/8 pt-6 text-xs text-black/42 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Tradução Visual. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <a href="#" className="transition-colors duration-300 hover:text-red-500">Privacidade</a>
            <a href="#" className="transition-colors duration-300 hover:text-red-500">Termos de uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
