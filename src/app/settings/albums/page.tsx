"use client"

import React, { useEffect, useState } from 'react';
import supabase from '../../../lib/supabaseClient';
import ImageUploader from '../../../components/ImageUploader';
import TrackForm from '../../../components/TrackForm';
import Modal from '../../../components/Modal';
import TrackEditor from '../../../components/TrackEditor';

type Album = {
  id: string;
  name: string;
  artist?: string;
  year?: number | null;
  cover_url?: string | null;
  tracks_count?: number;
};

export default function SettingsAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedTracks, setExpandedTracks] = useState<Record<string, any>>({});
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackEditing, setTrackEditing] = useState<{ albumId: string; track?: any } | null>(null);
  const [form, setForm] = useState<any>({ name: '', artist: '', year: '', cover_url: null });

  useEffect(() => { loadAlbums(); }, []);

  async function loadAlbums() {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        setAlbums([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('albums').select('id,name,artist,year,cover_url,tracks_count').eq('created_by', userId).order('created_at', { ascending: false });
      if (error) console.error(error);
      setAlbums(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Você precisa estar logado');
  const payload = { name: form.name, artist: form.artist || null, year: form.year || null, cover_url: form.cover_url || null, description: form.description || null, genre: form.genre || null, release_date: form.release_date || null, youtube_link: form.youtube_link || null, spotify_link: form.spotify_link || null };
      const res = await fetch('/api/albums', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || res.statusText);
      setCreating(false);
      setForm({ name: '', artist: '', year: '', cover_url: null });
      await loadAlbums();
    } catch (err: any) {
      alert('Erro ao criar álbum: ' + (err.message || String(err)));
    }
  }

  async function handleDeleteAlbum(id: string) {
    const ok = confirm('Deseja realmente deletar este álbum? Isso removerá também as faixas.');
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
      await loadAlbums();
    } catch (err: any) {
      alert('Erro ao deletar álbum: ' + (err.message || String(err)));
    }
  }

  async function handleStartEdit(a: Album) {
    setEditingId(a.id);
    setForm({ name: a.name || '', artist: a.artist || '', year: a.year ?? '', cover_url: a.cover_url || null, description: (a as any).description || '', genre: (a as any).genre || '', release_date: (a as any).release_date || null, youtube_link: (a as any).youtube_link || '', spotify_link: (a as any).spotify_link || '' });
  }

  async function handleSaveEdit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    try {
      if (!editingId) return;
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Você precisa estar logado');
  const payload = { name: form.name, artist: form.artist || null, year: form.year || null, cover_url: form.cover_url || null, description: form.description || null, genre: form.genre || null, release_date: form.release_date || null, youtube_link: form.youtube_link || null, spotify_link: form.spotify_link || null };
      const res = await fetch(`/api/albums/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || res.statusText);
      setEditingId(null);
      setForm({ name: '', artist: '', year: '', cover_url: null });
      await loadAlbums();
    } catch (err: any) {
      alert('Erro ao salvar álbum: ' + (err.message || String(err)));
    }
  }

  async function toggleTracks(albumId: string) {
    const expanded = { ...expandedTracks };
    if (expanded[albumId]) {
      delete expanded[albumId];
      setExpandedTracks(expanded);
      return;
    }
    // fetch album details with tracks
    try {
      const res = await fetch(`/api/albums/${albumId}`);
      if (!res.ok) throw new Error('Falha ao buscar faixas');
      const data = await res.json();
      expanded[albumId] = data;
      setExpandedTracks(expanded);
    } catch (err) {
      alert('Erro ao carregar faixas');
    }
  }

  async function refreshAlbum(albumId: string) {
    try {
      const res = await fetch(`/api/albums/${albumId}`);
      if (!res.ok) return;
      const data = await res.json();
      setExpandedTracks((prev) => ({ ...prev, [albumId]: data }));
    } catch (e) {
      // ignore
    }
  }

  async function handleDeleteTrack(trackId: string, albumId: string) {
    const ok = confirm('Deletar esta faixa?');
    if (!ok) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Você precisa estar logado');
      const res = await fetch(`/api/tracks/${trackId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const b = await res.json();
        throw new Error(b.error || res.statusText);
      }
      // refresh album tracks and album list
      await refreshAlbum(albumId);
      await loadAlbums();
    } catch (err: any) {
      alert('Erro ao deletar faixa: ' + (err.message || String(err)));
    }
  }

  async function handleEditTrack(track: any, albumId: string) {
    // open track editor modal for editing
    setTrackEditing({ albumId, track });
    setTrackModalOpen(true);
  }

  async function handleOpenNewTrack(albumId: string) {
    setTrackEditing({ albumId, track: undefined });
    setTrackModalOpen(true);
  }

  async function handleSaveTrackFromModal(payload: any) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Você precisa estar logado');

      if (trackEditing?.track) {
        // update existing
        const res = await fetch(`/api/tracks/${trackEditing.track.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error || res.statusText);
      } else {
        // create new
        const res = await fetch('/api/tracks', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error || res.statusText);
      }

      // close modal and refresh
      setTrackModalOpen(false);
      setTrackEditing(null);
      // refresh tracks list and albums
      if (payload.album_id) {
        // if the album is expanded, refresh it
        if (expandedTracks[payload.album_id]) {
          await refreshAlbum(payload.album_id);
        }
      }
      await loadAlbums();
    } catch (err: any) {
      alert('Erro ao salvar faixa: ' + (err.message || String(err)));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Configurações de Álbuns</h1>
      <div style={{ margin: '12px 0' }}>
        <button onClick={() => setCreating((c) => !c)}>{creating ? 'Fechar' : 'Criar novo álbum'}</button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} style={{ marginBottom: 16, maxWidth: 700 }}>
          <div style={{ marginBottom: 8 }}>
            <input placeholder="Nome" value={form.name || ''} onChange={(e) => setForm((s:any)=>({...s,name:e.target.value}))} required style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input placeholder="Artista" value={form.artist || ''} onChange={(e) => setForm((s:any)=>({...s,artist:e.target.value}))} style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input placeholder="Ano" type="number" value={form.year ?? ''} onChange={(e) => setForm((s:any)=>({...s,year: e.target.value ? Number(e.target.value) : ''}))} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <ImageUploader onUpload={(url: string) => setForm((s:any)=>({...s,cover_url: url}))} />
          </div>
          <div>
            <button type="submit">Criar</button>
          </div>
        </form>
      )}

      {loading && <p>Carregando álbuns...</p>}

      {!loading && albums.length === 0 && <p>Você não tem álbuns ainda.</p>}

      <div style={{ display: 'grid', gap: 12 }}>
        {albums.map((a) => (
          <div key={a.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            {!editingId && (
              <>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{a.name}</div>
                    <div style={{ color: '#555' }}>{a.artist} {a.year ? `(${a.year})` : ''}</div>
                    <div style={{ marginTop: 6 }}>Faixas: {a.tracks_count ?? 0}</div>
                  </div>
                  {a.cover_url && <img src={a.cover_url} alt="capa" style={{ width: 80, borderRadius: 6 }} />}
                </div>

                <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => handleStartEdit(a)}>Editar</button>
                  <button onClick={() => handleDeleteAlbum(a.id)} style={{ background: 'red', color: 'white' }}>Excluir</button>
                  <button onClick={() => toggleTracks(a.id)}>{expandedTracks[a.id] ? 'Fechar faixas' : 'Gerenciar faixas'}</button>
                  <button onClick={() => handleOpenNewTrack(a.id)} style={{ marginLeft: 'auto' }}>Adicionar faixa</button>
                </div>
              </>
            )}

            {editingId === a.id && (
              <form onSubmit={handleSaveEdit} style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <input value={form.name || ''} onChange={(e) => setForm((s:any)=>({...s,name: e.target.value}))} required style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <input value={form.artist || ''} onChange={(e) => setForm((s:any)=>({...s,artist: e.target.value}))} style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <input type="number" value={form.year ?? ''} onChange={(e) => setForm((s:any)=>({...s,year: e.target.value ? Number(e.target.value) : ''}))} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Descrição</label>
                  <textarea value={form.description || ''} onChange={(e) => setForm((s:any)=>({...s,description: e.target.value}))} style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Gênero</label>
                  <input value={form.genre || ''} onChange={(e) => setForm((s:any)=>({...s,genre: e.target.value}))} style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Data de lançamento</label>
                  <input type="date" value={form.release_date ?? ''} onChange={(e) => setForm((s:any)=>({...s,release_date: e.target.value || null}))} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>YouTube</label>
                  <input value={form.youtube_link || ''} onChange={(e) => setForm((s:any)=>({...s,youtube_link: e.target.value}))} style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Spotify</label>
                  <input value={form.spotify_link || ''} onChange={(e) => setForm((s:any)=>({...s,spotify_link: e.target.value}))} style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  {form.cover_url && <div style={{ marginBottom: 8 }}><img src={form.cover_url} alt="capa" style={{ width: 140, borderRadius: 6 }} /></div>}
                  <ImageUploader onUpload={(url: string) => setForm((s:any) => ({ ...s, cover_url: url }))} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit">Salvar</button>
                  <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', artist: '', year: '', cover_url: null }); }}>Cancelar</button>
                </div>
              </form>
            )}

            {expandedTracks[a.id] && (
              <div style={{ marginTop: 12 }}>
                <h4>Faixas</h4>
                <ol>
                  {expandedTracks[a.id].tracks?.map((t: any) => (
                    <li key={t.id} style={{ marginBottom: 6 }}>
                      {t.number ? `${t.number} - ` : ''}{t.name} {t.duration_seconds ? `(${t.duration_seconds}s)` : ''}
                      <div style={{ display: 'inline-block', marginLeft: 8 }}>
                        <button onClick={() => handleEditTrack(t, a.id)}>Editar</button>
                        <button onClick={() => handleDeleteTrack(t.id, a.id)} style={{ marginLeft: 6, color: 'red' }}>Excluir</button>
                      </div>
                    </li>
                  ))}
                </ol>
                          <div>
                            <TrackForm albumId={a.id} onCreated={async () => { await refreshAlbum(a.id); await loadAlbums(); }} />
                          </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {trackModalOpen && (
        <Modal isOpen={trackModalOpen} onClose={() => { setTrackModalOpen(false); setTrackEditing(null); }} title={trackEditing?.track ? 'Editar faixa' : 'Adicionar faixa'}>
          <TrackEditor initial={trackEditing?.track} albumId={trackEditing?.albumId} onCancel={() => { setTrackModalOpen(false); setTrackEditing(null); }} onSave={handleSaveTrackFromModal} />
        </Modal>
      )}
    </div>
  );
}
