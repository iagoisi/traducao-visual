import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../src/styles/globals.css";
import { Arbutus_Slab, Host_Grotesk } from "next/font/google";

const titleFont = Arbutus_Slab({ subsets: ["latin"], variable: "--font-title", weight: ["400"], display: "swap" });
const bodyFont  = Host_Grotesk({ subsets: ["latin"], variable: "--font-text", weight: ["400","700"], display: "swap" });

export const metadata: Metadata = {
  title: "Tradução Visual | Wity Prado",
  description:
    "Descubra a imagem que representa quem você é hoje com a Tradução Visual de Wity Prado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${titleFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
