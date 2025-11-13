import React from 'react';
import AlbumDetail from '@/components/AlbumDetail';

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

async function fetchAlbum(id: string): Promise<Album | null> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/albums?id=eq.${id}&select=id,name,artist,cover_url,tracks_count,spotify_link,youtube_link`;
  const res = await fetch(url, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }, cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0] ?? null;
}

async function fetchTracks(album_id: string): Promise<Track[]> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tracks?select=id,name,number,youtube_link,spotify_link,duration_seconds&album_id=eq.${album_id}&order=number.asc`;
  const res = await fetch(url, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }, cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function AlbumPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const album = await fetchAlbum(id);
  if (!album) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Álbum não encontrado</h1>
      </main>
    );
  }

  const tracks = await fetchTracks(id);

  return (
    <main className="px-6 py-8">
      <AlbumDetail album={album} tracks={tracks} />
    </main>
  );
}

