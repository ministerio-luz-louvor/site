export default async function Home() {
  // fetch latest album
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/albums?select=id,name,artist,cover_url,spotify_link,youtube_link&order=created_at.desc&limit=1`;
  let latest = null;
  try {
    const res = await fetch(url, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }, cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      latest = Array.isArray(data) && data.length ? data[0] : null;
    }
  } catch (e) {
    // ignore
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Ministério Luz & Louvor</h1>
      <p>Bem-vindo — explore nossos álbuns e faixas.</p>

      <section style={{ marginTop: 28 }}>
        <h2>Último lançamento</h2>
        {latest ? (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 160, height: 160, borderRadius: 8, overflow: 'hidden', background: '#f3f3f3' }}>
              {latest.cover_url ? <img src={latest.cover_url} alt={latest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>capa</div>}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{latest.name}</div>
              <div style={{ color: '#666', marginTop: 6 }}>{latest.artist}</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <a href={`/albums/${latest.id}`}><button>Ver álbum</button></a>
                {latest.spotify_link && <a href={latest.spotify_link} target="_blank" rel="noreferrer"><button>Ouvir no Spotify</button></a>}
                {latest.youtube_link && <a href={latest.youtube_link} target="_blank" rel="noreferrer"><button>Ver no YouTube</button></a>}
              </div>
            </div>
          </div>
        ) : (
          <p>Nenhum lançamento encontrado.</p>
        )}
        <div style={{ marginTop: 12 }}>
          <a href="/albums"><button>Ver todos os álbuns</button></a>
        </div>
      </section>
    </main>
  );
}
