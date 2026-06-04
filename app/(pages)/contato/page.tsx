import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Logotipo do Next.js"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Contato
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Esta página de contato ainda está em desenvolvimento. Enquanto
            isso, você pode voltar para a{" "}
            <Link
              href="/"
              className="font-medium text-zinc-950 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-red-500 hover:decoration-current dark:text-zinc-50"
            >
              página inicial
            </Link>{" "}
            ou conhecer melhor a{" "}
            <Link
              href="/#traducao"
              className="font-medium text-zinc-950 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-red-500 hover:decoration-current dark:text-zinc-50"
            >
              Tradução Visual
            </Link>.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-[#383838] hover:shadow-lg active:translate-y-0 dark:hover:bg-[#ccc] md:w-[158px]"
            href="/"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Símbolo da Vercel"
              width={16}
              height={16}
            />
            Voltar ao início
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-red-500/5 hover:shadow-lg active:translate-y-0 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/#traducao"
          >
            Conhecer a Tradução Visual
          </Link>
        </div>
      </main>
    </div>
  );
}
