"use client"

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

type Props = {
  initial?: any;
  albumId?: string;
  onCancel?: () => void;
  onSave: (payload: any) => Promise<void> | void;
};

export default function TrackEditor({ initial, albumId, onCancel, onSave }: Props) {
  const [name, setName] = useState(initial?.name || '');
  const [number, setNumber] = useState<number | ''>(initial?.number ?? '');
  const [duration, setDuration] = useState<string>(initial?.duration_seconds ? String(initial.duration_seconds) : '');
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.cover_url || null);
  const [year, setYear] = useState<number | ''>(initial?.year ?? '');
  const [youtubeLink, setYoutubeLink] = useState(initial?.youtube_link || '');
  const [spotifyLink, setSpotifyLink] = useState(initial?.spotify_link || '');
  const [chordsLink, setChordsLink] = useState(initial?.chords_link || '');
  const [lyricsLink, setLyricsLink] = useState(initial?.lyrics_link || '');
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

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        album_id: albumId || initial?.album_id,
        name,
        number: number || null,
        duration_seconds: parseDuration(duration),
        cover_url: coverUrl || null,
        year: year || null,
        youtube_link: youtubeLink || null,
        spotify_link: spotifyLink || null,
        chords_link: chordsLink || null,
        lyrics_link: lyricsLink || null
      };
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: 'grid', gap: 8 }}>
        <input placeholder="Nome da faixa" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: 8 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Número" type="number" value={number ?? ''} onChange={(e) => setNumber(e.target.value ? Number(e.target.value) : '')} />
          <input placeholder="Duração mm:ss ou segundos" value={duration} onChange={(e) => setDuration(e.target.value)} />
          <input placeholder="Ano" type="number" value={year ?? ''} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Capa (opcional)</label>
          {coverUrl && <img src={coverUrl} alt="cover" style={{ width: 140, borderRadius: 6, display: 'block', marginBottom: 8 }} />}
          <ImageUploader onUpload={(url: string) => setCoverUrl(url)} />
        </div>

        <input placeholder="YouTube link" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Spotify link" value={spotifyLink} onChange={(e) => setSpotifyLink(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Chords link" value={chordsLink} onChange={(e) => setChordsLink(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Lyrics link" value={lyricsLink} onChange={(e) => setLyricsLink(e.target.value)} style={{ padding: 8 }} />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
          <button type="button" onClick={onCancel} disabled={loading}>Cancelar</button>
          <button type="submit" disabled={loading}>{loading ? 'Salvando...' : (initial ? 'Salvar' : 'Adicionar')}</button>
        </div>
      </div>
    </form>
  );
}
