import React from 'react';

type Props = { params: Promise<{ id: string }> };

function SpotifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.77 14.02c-.2.32-.58.43-.9.24-2.47-1.5-5.58-1.84-9.25-1.02-.37.08-.75-.14-.83-.51-.08-.37.14-.75.51-.83 4.04-.86 7.46-.46 10.32 1.21.33.2.44.58.24.91zm1.27-2.78c-.25.4-.72.54-1.12.29-2.83-1.79-7.16-2.31-10.5-1.28-.43.13-.88-.11-1.01-.54-.13-.43.11-.88.54-1.01 3.82-1.15 8.77-.58 12.05 1.53.4.25.54.72.29 1.01zM17 8.5c-3.25-1.96-8.5-2.12-11.36-1.17-.5.17-1.02-.09-1.19-.59-.17-.5.09-1.02.59-1.19C8.6 4.1 14.4 4.34 18.08 6.06c.47.28.64.89.33 1.44-.25.4-.78.57-1.41.0z"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 15l5.19-3L10 9v6zm12-3c0-1.1-.9-2-2-2h-1.2L18.8 6.6C18.5 5.2 17.4 4.1 16 3.8 13.2 3 12 3 12 3s-1.2 0-4 .8C6.6 4.1 5.5 5.2 5.2 6.6L3.2 10H2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.2l2 3.4c.3 1.4 1.4 2.5 2.8 2.8 2.8.8 4 .8 4 .8s1.2 0 4-.8c1.4-.3 2.5-1.4 2.8-2.8l2-3.4H22c1.1 0 2-.9 2-2v-2z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h3v1.5h-3c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6h3v1.5h-3c-1.71 0-3.1-1.39-3.1-3.1zm16.2-3.1h-3v-1.5h3c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-3v-1.5h3c.88 0 1.6-.72 1.6-1.6s-.72-1.6-1.6-1.6zM8.5 11.25l7-7 1.06 1.06-7 7L8.5 11.25z"/>
    </svg>
  );
}

export default async function AlbumPublicPage({ params }: Props) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/albums?id=eq.${id}&select=*,tracks(*)`, { cache: 'no-store', headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' } });
  const albums = await res.json();
  const album = Array.isArray(albums) && albums.length ? albums[0] : null;

  if (!album) return <main style={{ padding: 20 }}><h2>Álbum não encontrado</h2></main>;

  return (
    <main style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 320px' }}>
          {album.cover_url && <img src={album.cover_url} alt="capa" style={{ width: '100%', borderRadius: 8 }} />}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>{album.name}</h1>
          <p style={{ marginTop: 6 }}>{album.artist} {album.year ? `(${album.year})` : ''}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {album.spotify_link && <a href={album.spotify_link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><SpotifyIcon />Ouvir no Spotify</a>}
            {album.youtube_link && <a href={album.youtube_link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><YoutubeIcon />Ver no YouTube</a>}
            {album.spotify_link == null && album.youtube_link == null && <span style={{ color: '#666' }}>Sem links externos</span>}
          </div>
        </div>
      </div>

      <section style={{ marginTop: 20 }}>
        <h2>Faixas</h2>
        <ol style={{ paddingLeft: 18 }}>
          {album.tracks?.map((t: any) => (
            <li key={t.id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{t.number ? `${t.number} - ` : ''}{t.name} {t.duration_seconds ? `(${t.duration_seconds}s)` : ''}</div>
                <div style={{ marginTop: 4, color: '#666', fontSize: 13 }}>{t.year ? `Ano: ${t.year}` : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {t.spotify_link && <a href={t.spotify_link} target="_blank" rel="noreferrer" title="Abrir no Spotify" style={{ display: 'inline-flex', alignItems: 'center' }}><SpotifyIcon /></a>}
                {t.youtube_link && <a href={t.youtube_link} target="_blank" rel="noreferrer" title="Abrir no YouTube" style={{ display: 'inline-flex', alignItems: 'center' }}><YoutubeIcon /></a>}
                {t.chords_link && <a href={t.chords_link} target="_blank" rel="noreferrer" title="Cifras" style={{ display: 'inline-flex', alignItems: 'center' }}><LinkIcon /></a>}
                {t.lyrics_link && <a href={t.lyrics_link} target="_blank" rel="noreferrer" title="Letras" style={{ display: 'inline-flex', alignItems: 'center' }}><LinkIcon /></a>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
