import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <section className="relative bg-cover bg-center py-28 section--dark" style={{ backgroundColor: "var(--brand-navy)" }}>
        <div className="px-8 sm:px-20">
          <h1 className="text-4xl sm:text-6xl mb-4" style={{ color: "var(--brand-gold)" }}>
            Ministério Luz & Louvor
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl lead">
            Músicas católicas para louvar e evangelizar — venha conhecer nosso trabalho,
            nossos lançamentos e como participar.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#lancamentos" className="px-4 py-2 rounded" style={{ backgroundColor: "var(--brand-gold)", color: "var(--brand-navy)" }}>
              Lançamentos
            </a>
            <a href="#discografia" className="px-4 py-2 border rounded" style={{ borderColor: "rgba(255,255,255,0.3)" }}>
              Discografia
            </a>
          </div>
        </div>
      </section>

  <section id="lancamentos" className="px-8 sm:px-20 py-12 section--dark">
        <h2 className="text-2xl font-semibold mb-4">Lançamentos</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <article className="p-6 border rounded">
            <h3 className="font-semibold">Álbum — Em Breve</h3>
            <p className="text-sm mt-2">Nosso próximo álbum está em produção. Acompanhe as novidades.</p>
          </article>
          <article className="p-6 border rounded">
            <h3 className="font-semibold">Último Lançamento</h3>
            <p className="text-sm mt-2">Single: "Louvor e Esperança" — lançado recentemente.</p>
          </article>
        </div>
      </section>

  <section id="discografia" className="bg-gray-50 px-8 sm:px-20 py-12 section--light">
        <h2 className="text-2xl font-semibold mb-4">Discografia</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-4 border rounded">Álbum 1</div>
          <div className="p-4 border rounded">Álbum 2</div>
          <div className="p-4 border rounded">Singles</div>
        </div>
      </section>

      <section id="devocional" className="px-8 sm:px-20 py-12 section--dark" style={{ backgroundColor: "var(--brand-navy)" }}>
        <h2 className="text-2xl font-semibold mb-4">Devocional</h2>
        <p className="max-w-3xl lead">Reflexões diárias e meditações curtas para acompanhar sua jornada espiritual.</p>
      </section>

      <section id="redes" className="bg-gray-50 px-8 sm:px-20 py-12 section--light">
        <h2 className="text-2xl font-semibold mb-4">Conheça nossas redes</h2>
        <div className="flex gap-4">
          <a className="px-3 py-2 border rounded" href="#">Instagram</a>
          <a className="px-3 py-2 border rounded" href="#">YouTube</a>
          <a className="px-3 py-2 border rounded" href="#">Spotify</a>
        </div>
      </section>

  <section id="interprete" className="px-8 sm:px-20 py-12 section--dark" style={{ backgroundColor: "var(--brand-navy)" }}>
        <h2 className="text-2xl font-semibold mb-4">Seja um intérprete</h2>
        <p className="max-w-3xl">Se você canta ou toca e quer participar do ministério, entre em contato conosco.</p>
        <a className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded" href="#contato">Quero participar</a>
      </section>

  <section id="contato" className="bg-gray-50 px-8 sm:px-20 py-12 section--light">
        <h2 className="text-2xl font-semibold mb-4">Contato</h2>
        <form className="max-w-xl grid gap-3">
          <input className="p-2 border rounded" placeholder="Nome" />
          <input className="p-2 border rounded" placeholder="Email" />
          <textarea className="p-2 border rounded" placeholder="Mensagem" rows={4} />
          <button className="px-4 py-2 rounded" style={{ backgroundColor: "var(--brand-gold)", color: "var(--brand-navy)" }}>Enviar</button>
        </form>
      </section>

      <footer className="px-8 sm:px-20 py-8 text-center text-sm text-gray-500" style={{ backgroundColor: "var(--brand-navy)", color: "white" }}>
        © {new Date().getFullYear()} Ministério Luz & Louvor
      </footer>
    </main>
  );
}
