import AlbumCard from '@/components/AlbumCard';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default async function Home() {
  // fetch latest albums (first item will be highlighted, the rest shown as cards)
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/albums?select=id,name,artist,cover_url,spotify_link,youtube_link,tracks_count&order=created_at.desc&limit=5`;
  let latest = null;
  let recent: any[] = [];
  try {
    const res = await fetch(url, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }, cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        latest = data[0];
        recent = data.slice(1);
      }
    }
  } catch (e) {
    // ignore
  }

  return (
    <main className={ 'max-w-6xl m-auto'} style={{ padding: 20 }}>
      <h1>Ministério Luz & Louvor</h1>
      <p>Bem-vindo — explore nossos álbuns e faixas.</p>

      <div className="mt-6">
        <Link href="/albums"><Button className="px-6 py-3 text-base">Ver todos os álbuns</Button></Link>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Último lançamento</h2>
        {latest ? (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Hero (destaque) */}
            <div className="lg:col-span-12 bg-white rounded-lg shadow-sm p-4">
              <div className="md:flex md:items-center justify-between md:gap-6">
                <div className="w-full md:w-80 md:h-80 h-64 rounded-lg overflow-hidden bg-gray-100">
                  {latest.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={latest.cover_url} alt={latest.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">capa</div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex flex-col ">
                  <div className="text-2xl font-extrabold">{latest.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{latest.artist}</div>
                  <div className="text-sm text-gray-500 mt-2">{latest.tracks_count ?? ''} faixas</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/albums/${latest.id}`}><Button>Ver álbum</Button></Link>
                    {latest.spotify_link && <a href={latest.spotify_link} target="_blank" rel="noreferrer"><Button variant="ghost">Spotify</Button></a>}
                    {latest.youtube_link && <a href={latest.youtube_link} target="_blank" rel="noreferrer"><Button variant="ghost">YouTube</Button></a>}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent cards */}
            <aside className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {recent.length === 0 && <div className="text-gray-600">Nenhum outro lançamento.</div>}
                {recent.map((r: any) => (
                  <AlbumCard key={r.id} album={r} />
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <p className="text-gray-600">Nenhum lançamento encontrado.</p>
        )}
      </section>
    </main>
  );
}
