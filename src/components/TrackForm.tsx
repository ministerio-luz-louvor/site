'use client'

import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';
import ImageUploader from './ImageUploader';

type Props = {
  albumId: string;
  onCreated?: (track: any) => void;
};

export default function TrackForm({ albumId, onCreated }: Props) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [duration, setDuration] = useState(''); // mm:ss or seconds
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [year, setYear] = useState<number | ''>('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [chordsLink, setChordsLink] = useState('');
  const [lyricsLink, setLyricsLink] = useState('');
  const [loading, setLoading] = useState(false);

  function parseDuration(input: string) {
    if (!input) return null;
    if (/^\d+:\d{2}$/.test(input)) {
      const [m, s] = input.split(':').map(Number);
      return m * 60 + s;
    }
    const n = Number(input);
    return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Você precisa estar logado');

      const payload = {
        album_id: albumId,
        name,
        number: number || null,
        duration_seconds: parseDuration(duration),
        cover_url: coverUrl || null,
        year: year || null,
        youtube_link: youtubeLink || null,
        spotify_link: spotifyLink || null,
        chords_link: chordsLink || null,
        lyrics_link: lyricsLink || null,
      };

      const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || res.statusText);
      setName('');
      setNumber('');
      setDuration('');
      setCoverUrl(null);
      setYear('');
      setYoutubeLink('');
      setSpotifyLink('');
      setChordsLink('');
      setLyricsLink('');
      onCreated?.(body);
    } catch (err: any) {
      try { alert('Erro: ' + (err.message || String(err))); } catch (_) {}
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <div>
        <input placeholder="Nome da faixa" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input placeholder="Número" type="number" value={number ?? ''} onChange={(e) => setNumber(e.target.value ? Number(e.target.value) : '')} />
        <input placeholder="Duração mm:ss or seconds" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ marginLeft: 8 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input placeholder="Ano (opcional)" type="number" value={year ?? ''} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Capa da faixa (opcional)</label>
        <ImageUploader onUpload={(url: string) => setCoverUrl(url)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input placeholder="YouTube link" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input placeholder="Spotify link" value={spotifyLink} onChange={(e) => setSpotifyLink(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input placeholder="Chords link" value={chordsLink} onChange={(e) => setChordsLink(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input placeholder="Lyrics link" value={lyricsLink} onChange={(e) => setLyricsLink(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={loading}>{loading ? 'Adicionando...' : 'Adicionar faixa'}</button>
      </div>
    </form>
  );
}
