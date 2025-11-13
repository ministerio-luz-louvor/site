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

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <a
      href={`/albums/${album.id}`}
      className="group block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md focus:shadow-md transform transition duration-200 hover:-translate-y-1 focus:-translate-y-1 outline-none"
      aria-label={`Abrir álbum ${album.name}`}
    >
      <div className="w-full aspect-square bg-gray-100 overflow-hidden relative">
        {album.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={album.cover_url} alt={album.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Capa</div>
        )}

        {/* subtle overlay icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/40 rounded-full p-3 text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="font-semibold text-sm truncate">{album.name}</div>
        <div className="text-xs text-gray-600 truncate">{album.artist}</div>
        <div className="mt-2 text-xs text-gray-500">{(album.tracks_count ?? 0) + ' faixas'}</div>
      </div>
    </a>
  );
}
