"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TrackForm from '../../../../components/TrackForm';
import ImageUploader from '../../../../components/ImageUploader';
import supabase from '../../../../lib/supabaseClient';

export default function AlbumDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const router = useRouter();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/albums/${id}`);
      if (!res.ok) throw new Error('Falha ao buscar álbum');
      const data = await res.json();
      setAlbum(data);
      setForm({
        name: data.name || '',
        artist: data.artist || '',
        year: data.year || '',
        description: data.description || '',
        cover_url: data.cover_url || null,
        genre: data.genre || '',
        release_date: data.release_date || null,
        youtube_link: data.youtube_link || '',
        spotify_link: data.spotify_link || ''
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar álbum');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleTrackCreated(track: any) {
    // reload album (tracks)
    await load();
  }

  async function handleDeleteAlbum() {
    const ok = confirm('Deseja realmente deletar este álbum?');
    if (!ok) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Você precisa estar logado');
      const res = await fetch(`/api/albums/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const b = await res.json();
        throw new Error(b.error || res.statusText);
      }
      router.push('/dashboard/albums');
    } catch (err: any) {
      alert('Erro: ' + (err.message || String(err)));
    }
  }

  function onCoverUploaded(url: string) {
    setForm((s: any) => ({ ...s, cover_url: url }));
  }

  async function handleSaveEdit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Você precisa estar logado');

      const body = {
        name: form.name,
        artist: form.artist,
        year: form.year || null,
        description: form.description || null,
        cover_url: form.cover_url || null,
        genre: form.genre || null,
        release_date: form.release_date || null,
        youtube_link: form.youtube_link || null,
        spotify_link: form.spotify_link || null
      };

      const res = await fetch(`/api/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const b = await res.json();
        throw new Error(b.error || res.statusText);
      }
      alert('Álbum atualizado');
      setEditing(false);
      await load();
    } catch (err: any) {
      alert('Erro ao salvar: ' + (err.message || String(err)));
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!album) return <p>Álbum não encontrado.</p>;

  return (
    <div style={{ padding: 20 }}>
      {!editing && (
        <>
          <h2>{album.name}</h2>
          <p>{album.artist} {album.year ? `(${album.year})` : ''}</p>
          {album.cover_url && <img src={album.cover_url} alt="capa" style={{ width: 220, borderRadius: 8 }} />}

          <div style={{ marginTop: 12 }}>
            <h3>Faixas</h3>
            <ol>
              {album.tracks?.map((t: any) => (
                <li key={t.id}>{t.number ? `${t.number} - ` : ''}{t.name} {t.duration_seconds ? `(${t.duration_seconds}s)` : ''}</li>
              ))}
            </ol>
          </div>

          <div style={{ marginTop: 12 }}>
            <TrackForm albumId={id} onCreated={handleTrackCreated} />
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button onClick={() => setEditing(true)}>Editar álbum</button>
            <button onClick={handleDeleteAlbum} style={{ background: 'red', color: 'white' }}>Deletar álbum</button>
          </div>
        </>
      )}

      {editing && (
        <form onSubmit={handleSaveEdit} style={{ maxWidth: 700 }}>
          <h2>Editar Álbum</h2>
          <div style={{ marginBottom: 12 }}>
            <label>Nome</label>
            <input value={form.name || ''} onChange={(e) => setForm((s: any) => ({ ...s, name: e.target.value }))} required style={{ width: '100%', padding: 8 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Artista</label>
            <input value={form.artist || ''} onChange={(e) => setForm((s: any) => ({ ...s, artist: e.target.value }))} style={{ width: '100%', padding: 8 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Ano</label>
            <input type="number" value={form.year ?? ''} onChange={(e) => setForm((s: any) => ({ ...s, year: e.target.value ? Number(e.target.value) : '' }))} style={{ padding: 8 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Descrição</label>
            <textarea value={form.description || ''} onChange={(e) => setForm((s: any) => ({ ...s, description: e.target.value }))} style={{ width: '100%', padding: 8 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Capa</label>
            {form.cover_url && <div style={{ marginBottom: 8 }}><img src={form.cover_url} alt="capa" style={{ width: 160, borderRadius: 6 }} /></div>}
            <ImageUploader onUpload={onCoverUploaded} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Gênero</label>
            <input value={form.genre || ''} onChange={(e) => setForm((s: any) => ({ ...s, genre: e.target.value }))} placeholder="Gênero" style={{ width: '100%', padding: 8 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Data de lançamento</label>
            <input type="date" value={form.release_date ?? ''} onChange={(e) => setForm((s: any) => ({ ...s, release_date: e.target.value || null }))} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>YouTube link</label>
            <input value={form.youtube_link || ''} onChange={(e) => setForm((s: any) => ({ ...s, youtube_link: e.target.value }))} placeholder="YouTube" style={{ width: '100%', padding: 8 }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Spotify link</label>
            <input value={form.spotify_link || ''} onChange={(e) => setForm((s: any) => ({ ...s, spotify_link: e.target.value }))} placeholder="Spotify" style={{ width: '100%', padding: 8 }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}
