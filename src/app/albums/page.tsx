import React from 'react';

type Album = {
  id: string;
  name: string;
  artist?: string;
  cover_url?: string | null;
  tracks_count?: number;
  spotify_link?: string | null;
  youtube_link?: string | null;
};

async function fetchAlbums() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/albums?select=id,name,artist,cover_url,tracks_count,spotify_link,youtube_link&order=created_at.desc&limit=100`;
  const res = await fetch(url, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }, cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

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

export default async function AlbumsPage() {
  const albums: Album[] = await fetchAlbums();

  return (
    <main style={{ padding: 24 }}>
      <h1>Álbuns</h1>
      <p style={{ color: '#666' }}>Nossa discografia — confira, ouça e baixe as faixas.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18, marginTop: 20 }}>
        {albums.map((a) => (
          <article key={a.id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', padding: 12, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 96, height: 96, background: '#f3f3f3', borderRadius: 6, overflow: 'hidden', flex: '0 0 96px' }}>
                {a.cover_url ? <img src={a.cover_url} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>capa</div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{a.name}</div>
                <div style={{ color: '#666', fontSize: 13 }}>{a.artist}</div>
                <div style={{ marginTop: 8, color: '#333', fontSize: 13 }}>Faixas: {a.tracks_count ?? 0}</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <a href={`/albums/${a.id}`} style={{ textDecoration: 'none' }}><button style={{ padding: '6px 10px' }}>Ver</button></a>
                  {a.spotify_link && (
                    <a href={a.spotify_link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                      <SpotifyIcon />
                      <span style={{ fontSize: 13 }}>Spotify</span>
                    </a>
                  )}
                  {a.youtube_link && (
                    <a href={a.youtube_link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                      <YoutubeIcon />
                      <span style={{ fontSize: 13 }}>YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
