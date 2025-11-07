"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../../lib/supabaseClient';
import ImageUploader from '../../../../components/ImageUploader';

export default function NewAlbumPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState<string | null>(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        alert('Você precisa estar logado.');
        router.push('/login');
        return;
      }

  const body = { name, artist, year: year || null, cover_url: coverUrl, description: description || null, genre: genre || null, release_date: releaseDate || null, youtube_link: youtubeLink || null, spotify_link: spotifyLink || null };
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert('Erro: ' + (err.error || res.statusText));
        return;
      }
      alert('Álbum criado');
      router.push('/dashboard/albums');
    } catch (err: any) {
      alert('Erro: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <h2>Novo Álbum</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do álbum" required style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Artista</label>
          <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artista" style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Ano</label>
          <input type="number" value={year ?? ''} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')} placeholder="Ano" style={{ padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Gênero</label>
          <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Gênero" style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Data de lançamento</label>
          <input type="date" value={releaseDate ?? ''} onChange={(e) => setReleaseDate(e.target.value || null)} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Descrição</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>YouTube link</label>
          <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="YouTube" style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Spotify link</label>
          <input value={spotifyLink} onChange={(e) => setSpotifyLink(e.target.value)} placeholder="Spotify" style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Capa (opcional)</label>
          <ImageUploader onUpload={(url) => setCoverUrl(url)} />
        </div>

        <div>
          <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar álbum'}</button>
        </div>
      </form>
    </div>
  );
}
