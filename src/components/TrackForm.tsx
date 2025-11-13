"use client"

import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';
import ImageUploader from './ImageUploader';
import TextField from './ui/TextField';
import Button from './ui/Button';

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
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <TextField label="Nome da faixaa" placeholder="Nome da faixa" value={name} onChange={(e:any) => setName(e.target.value)} required />

      <div className="flex gap-3">
        <TextField label="Número" type="number" placeholder="Número" value={number ?? ''} onChange={(e:any) => setNumber(e.target.value ? Number(e.target.value) : '')} />
        <TextField label="Duração" placeholder="mm:ss ou segundos" value={duration} onChange={(e:any) => setDuration(e.target.value)} />
        <TextField label="Ano" type="number" placeholder="Ano (opcional)" value={year ?? ''} onChange={(e:any) => setYear(e.target.value ? Number(e.target.value) : '')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Capa da faixa (opcional)</label>
        <ImageUploader onUpload={(url: string) => setCoverUrl(url)} />
      </div>

      <TextField label="YouTube link" placeholder="YouTube link" value={youtubeLink} onChange={(e:any) => setYoutubeLink(e.target.value)} />
      <TextField label="Spotify link" placeholder="Spotify link" value={spotifyLink} onChange={(e:any) => setSpotifyLink(e.target.value)} />
      <TextField label="Chords link" placeholder="Chords link" value={chordsLink} onChange={(e:any) => setChordsLink(e.target.value)} />
      <TextField label="Lyrics link" placeholder="Lyrics link" value={lyricsLink} onChange={(e:any) => setLyricsLink(e.target.value)} />

      <div>
        <Button type="submit" disabled={loading}>{loading ? 'Adicionando...' : 'Adicionar faixa'}</Button>
      </div>
    </form>
  );
}
