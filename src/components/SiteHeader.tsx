"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AuthHeader from "@/components/AuthHeader";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const nav = [
    ["/#discografia", "Discografia"],
    ["/#devocional", "Devocional"],
    ["/ #redes", "Conheça nossas redes"],
    ["/ #interprete", "Seja um intérprete"],
    ["/ #lancamentos", "Lançamentos"],
    ["/ #contato", "Contato"],
  ];

  return (
    <header style={{ backgroundColor: "var(--brand-navy)" }} className="py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-4" aria-label="Ir para a página inicial">
          <Image src="/logo.png" alt="Logotipo Ministério Luz e Louvor" width={64} height={64} />
          <div>
            <div style={{ color: "var(--brand-gold)", fontWeight: 700 }}>Ministério</div>
            <div style={{ color: "white", fontWeight: 600 }}>Luz &amp; Louvor</div>
          </div>
        </Link>

        <nav className="hidden md:flex gap-6 text-white">
          <a href="#discografia" className={pathname?.includes("discografia") ? "underline" : ""}>Discografia</a>
          <a href="#devocional" className={pathname?.includes("devocional") ? "underline" : ""}>Devocional</a>
          <a href="#redes" className={pathname?.includes("redes") ? "underline" : ""}>Conheça nossas redes</a>
          <a href="#interprete" className={pathname?.includes("interprete") ? "underline" : ""}>Seja um intérprete</a>
          <a href="#lancamentos" className={pathname?.includes("lancamentos") ? "underline" : ""}>Lançamentos</a>
          <a href="#contato" className={pathname?.includes("contato") ? "underline" : ""}>Contato</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <button aria-label="Menu" onClick={() => setOpen((v) => !v)} className="p-2 text-white">
              ☰
            </button>
          </div>
          <div className="hidden md:block">
            <AuthHeader />
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white text-black">
          <div className="flex flex-col p-4">
            <a href="#discografia" className="py-2">Discografia</a>
            <a href="#devocional" className="py-2">Devocional</a>
            <a href="#redes" className="py-2">Conheça nossas redes</a>
            <a href="#interprete" className="py-2">Seja um intérprete</a>
            <a href="#lancamentos" className="py-2">Lançamentos</a>
            <a href="#contato" className="py-2">Contato</a>
          </div>
        </div>
      )}
    </header>
  );
}
