"use client"

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import TextField from './ui/TextField';
import Button from './ui/Button';

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
      <div className="grid gap-3">
        <TextField label="Nome da faixa" placeholder="Nome da faixa" value={name} onChange={(e:any) => setName(e.target.value)} required />

        <div className="flex gap-3">
          <TextField label="Número" type="number" placeholder="Número" value={number ?? ''} onChange={(e:any) => setNumber(e.target.value ? Number(e.target.value) : '')} />
          <TextField label="Duração" placeholder="mm:ss ou segundos" value={duration} onChange={(e:any) => setDuration(e.target.value)} />
          <TextField label="Ano" type="number" placeholder="Ano" value={year ?? ''} onChange={(e:any) => setYear(e.target.value ? Number(e.target.value) : '')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capa (opcional)</label>
          {coverUrl && <img src={coverUrl} alt="cover" className="w-36 rounded block mb-2" />}
          <ImageUploader onUpload={(url: string) => setCoverUrl(url)} />
        </div>

        <TextField label="YouTube link" placeholder="YouTube link" value={youtubeLink} onChange={(e:any) => setYoutubeLink(e.target.value)} />
        <TextField label="Spotify link" placeholder="Spotify link" value={spotifyLink} onChange={(e:any) => setSpotifyLink(e.target.value)} />
        <TextField label="Chords link" placeholder="Chords link" value={chordsLink} onChange={(e:any) => setChordsLink(e.target.value)} />
        <TextField label="Lyrics link" placeholder="Lyrics link" value={lyricsLink} onChange={(e:any) => setLyricsLink(e.target.value)} />

        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" onClick={onCancel} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : (initial ? 'Salvar' : 'Adicionar')}</Button>
        </div>
      </div>
    </form>
  );
}
