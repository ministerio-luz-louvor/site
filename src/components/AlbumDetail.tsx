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

type Track = {
  id: string;
  name: string;
  number?: number | null;
  youtube_link?: string | null;
  spotify_link?: string | null;
  duration_seconds?: number | null;
};

function SpotifyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.77 14.02c-.2.32-.58.43-.9.24-2.47-1.5-5.58-1.84-9.25-1.02-.37.08-.75-.14-.83-.51-.08-.37.14-.75.51-.83 4.04-.86 7.46-.46 10.32 1.21.33.2.44.58.24.91zm1.27-2.78c-.25.4-.72.54-1.12.29-2.83-1.79-7.16-2.31-10.5-1.28-.43.13-.88-.11-1.01-.54-.13-.43.11-.88.54-1.01 3.82-1.15 8.77-.58 12.05 1.53.4.25.54.72.29 1.01zM17 8.5c-3.25-1.96-8.5-2.12-11.36-1.17-.5.17-1.02-.09-1.19-.59-.17-.5.09-1.02.59-1.19C8.6 4.1 14.4 4.34 18.08 6.06c.47.28.64.89.33 1.44-.25.4-.78.57-1.41.0z"/>
    </svg>
  );
}

function YoutubeIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 15l5.19-3L10 9v6zm12-3c0-1.1-.9-2-2-2h-1.2L18.8 6.6C18.5 5.2 17.4 4.1 16 3.8 13.2 3 12 3 12 3s-1.2 0-4 .8C6.6 4.1 5.5 5.2 5.2 6.6L3.2 10H2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.2l2 3.4c.3 1.4 1.4 2.5 2.8 2.8 2.8.8 4 .8 4 .8s1.2 0 4-.8c1.4-.3 2.5-1.4 2.8-2.8l2-3.4H22c1.1 0 2-.9 2-2v-2z"/>
    </svg>
  );
}

export default function AlbumDetail({ album, tracks }: { album: Album; tracks: Track[] }) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="md:flex">
        {/* Left: album details */}
        <div className="md:w-4/12 p-6 flex flex-col items-start gap-4">
          <div className="w-full">
            <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-100">
              {album.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={album.cover_url} alt={album.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Capa</div>
              )}
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-lg font-semibold">{album.name}</h2>
            <div className="text-sm text-gray-600">{album.artist}</div>
            <div className="mt-2 text-sm text-gray-700">{(album.tracks_count ?? 0) + ' faixas'}</div>
            <div className="mt-4 flex items-center gap-3">
              <a href={`/albums/${album.id}`} className="inline-block px-4 py-2 bg-brand-navy text-white rounded">Abrir</a>
              {album.spotify_link && (
                <a href={album.spotify_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <SpotifyIcon />
                  Spotify
                </a>
              )}
              {album.youtube_link && (
                <a href={album.youtube_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <YoutubeIcon />
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: tracks list */}
        <div className="md:w-8/12 border-t md:border-t-0 md:border-l border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Faixas</div>
            <div className="text-sm text-gray-500">{album.tracks_count ?? tracks.length} total</div>
          </div>

          <ol className="mt-3 space-y-2">
            {tracks.length === 0 && <li className="text-sm text-gray-500">Sem faixas cadastradas.</li>}
            {tracks.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 p-2 rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 text-sm text-gray-500">{t.number ?? '-'}</div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    {t.duration_seconds != null && (
                      <div className="text-xs text-gray-500">{Math.floor((t.duration_seconds || 0) / 60)}:{String((t.duration_seconds || 0) % 60).padStart(2, '0')}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {t.spotify_link && (
                    <a href={t.spotify_link} target="_blank" rel="noreferrer" className="text-sm text-green-600 inline-flex items-center gap-2">
                      <SpotifyIcon />
                      <span className="hidden sm:inline">Spotify</span>
                    </a>
                  )}
                  {t.youtube_link && (
                    <a href={t.youtube_link} target="_blank" rel="noreferrer" className="text-sm text-red-600 inline-flex items-center gap-2">
                      <YoutubeIcon />
                      <span className="hidden sm:inline">YouTube</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
