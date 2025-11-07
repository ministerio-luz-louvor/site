"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header style={{ background: '#04263b', padding: '12px 0' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <Link href="/" aria-label="Ir para a página inicial">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image src="/logo.png" alt="Logotipo Ministério Luz e Louvor" width={64} height={64} />
            <div>
              <div style={{ color: '#f6c65a', fontWeight: 700 }}>Ministério</div>
              <div style={{ color: '#fff', fontWeight: 600 }}>Luz &amp; Louvor</div>
            </div>
          </div>
        </Link>

        <nav style={{ display: open ? 'flex' : 'none', gap: 18, alignItems: 'center', color: '#fff' }}>
          <a href="#discografia" className={pathname?.includes("discografia") ? "underline" : ""}>Discografia</a>
          <a href="#devocional" className={pathname?.includes("devocional") ? "underline" : ""}>Devocional</a>
          <a href="#redes" className={pathname?.includes("redes") ? "underline" : ""}>Conheça nossas redes</a>
          <a href="#interprete" className={pathname?.includes("interprete") ? "underline" : ""}>Seja um intérprete</a>
          <a href="#lancamentos" className={pathname?.includes("lancamentos") ? "underline" : ""}>Lançamentos</a>
          <a href="#contato" className={pathname?.includes("contato") ? "underline" : ""}>Contato</a>
        </nav>

        <div style={{ display: 'block' }}>
          <button aria-label="Menu" onClick={() => setOpen((v) => !v)} style={{ padding: 8, color: 'white', background: 'transparent', border: 'none' }}>☰</button>
        </div>
      </div>
    </header>
  );
}
