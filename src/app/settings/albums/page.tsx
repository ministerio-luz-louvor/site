"use client"

import React, { useEffect, useState } from 'react';
import supabase from '../../../lib/supabaseClient';
import ImageUploader from '../../../components/ImageUploader';
import Modal from '../../../components/Modal';
import TrackEditor from '../../../components/TrackEditor';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';

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
  const [showTracks, setShowTracks] = useState<Record<string, boolean>>({});
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
      const albumsData = data || [];
      setAlbums(albumsData);

      // fetch tracks for each album so we can show them by default
      try {
        const results = await Promise.all(albumsData.map(async (alb: any) => {
          try {
            const res = await fetch(`/api/albums/${alb.id}`);
            if (!res.ok) return null;
            const d = await res.json();
            return { id: alb.id, data: d };
          } catch (e) {
            return null;
          }
        }));
        const map: Record<string, any> = {};
        results.forEach((r) => { if (r) map[r.id] = r.data; });
        setExpandedTracks(map);
      } catch (e) {
        // ignore per-album fetch errors
      }
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

  // toggle show/hide tracks for an album. If tracks not prefetched, fetch them.
  async function toggleTracks(albumId: string) {
    const shown = { ...showTracks };
    shown[albumId] = !shown[albumId];
    setShowTracks(shown);

    if (!expandedTracks[albumId] && shown[albumId]) {
      try {
        const res = await fetch(`/api/albums/${albumId}`);
        if (!res.ok) throw new Error('Falha ao buscar faixas');
        const data = await res.json();
        setExpandedTracks((prev) => ({ ...prev, [albumId]: data }));
      } catch (err) {
        alert('Erro ao carregar faixas');
      }
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Configurações de Álbuns</h1>
      </div>
      <div>
        <Button onClick={() => setCreating((c) => !c)}>{creating ? 'Fechar' : 'Criar novo álbum'}</Button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="space-y-4 max-w-3xl">
          <div>
            <TextField label="Nome" value={form.name || ''} onChange={(e:any)=> setForm((s:any)=>({...s,name:e.target.value}))} />
          </div>
          <div>
            <TextField label="Artista" value={form.artist || ''} onChange={(e:any)=> setForm((s:any)=>({...s,artist:e.target.value}))} />
          </div>
          <div>
            <TextField label="Ano" type="number" value={form.year ?? ''} onChange={(e:any)=> setForm((s:any)=>({...s,year: e.target.value ? Number(e.target.value) : ''}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capa</label>
            <ImageUploader onUpload={(url: string) => setForm((s:any)=>({...s,cover_url: url}))} />
          </div>
          <div>
            <Button type="submit">Criar</Button>
          </div>
        </form>
      )}

      {loading && <p className="text-gray-600">Carregando álbuns...</p>}

      {!loading && albums.length === 0 && <p className="text-gray-600">Você não tem álbuns ainda.</p>}

      <div className="grid gap-4">
        {albums.map((a) => (
          <div key={a.id} className="p-4 bg-white border border-gray-100 rounded-lg">
            {!editingId && (
              <>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-sm text-gray-600">{a.artist} {a.year ? `(${a.year})` : ''}</div>
                    <div className="text-sm text-gray-600 mt-1">Faixas: {expandedTracks[a.id]?.tracks ? expandedTracks[a.id].tracks.length : (a.tracks_count ?? 0)}</div>
                  </div>
                  {a.cover_url && <img src={a.cover_url} alt="capa" className="w-20 h-20 object-cover rounded" />}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button onClick={() => handleStartEdit(a)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDeleteAlbum(a.id)}>Excluir</Button>
                  <div className="ml-auto">
                    <Button onClick={() => handleOpenNewTrack(a.id)}>Adicionar faixa</Button>
                  </div>
                </div>
              </>
            )}

            {editingId === a.id && (
              <form onSubmit={handleSaveEdit} className="mt-3 space-y-3">
                <div>
                  <TextField label="Nome" value={form.name || ''} onChange={(e:any)=> setForm((s:any)=>({...s,name: e.target.value}))} required />
                </div>
                <div>
                  <TextField label="Artista" value={form.artist || ''} onChange={(e:any)=> setForm((s:any)=>({...s,artist: e.target.value}))} />
                </div>
                <div>
                  <TextField label="Ano" type="number" value={form.year ?? ''} onChange={(e:any)=> setForm((s:any)=>({...s,year: e.target.value ? Number(e.target.value) : ''}))} />
                </div>
                <div>
                  <TextField label="Descrição" textarea value={form.description || ''} onChange={(e:any)=> setForm((s:any)=>({...s,description: e.target.value}))} />
                </div>
                <div>
                  <TextField label="Gênero" value={form.genre || ''} onChange={(e:any)=> setForm((s:any)=>({...s,genre: e.target.value}))} />
                </div>
                <div>
                  <TextField label="Data de lançamento" type="date" value={form.release_date ?? ''} onChange={(e:any)=> setForm((s:any)=>({...s,release_date: e.target.value || null}))} />
                </div>
                <div>
                  <TextField label="YouTube" value={form.youtube_link || ''} onChange={(e:any)=> setForm((s:any)=>({...s,youtube_link: e.target.value}))} />
                </div>
                <div>
                  <TextField label="Spotify" value={form.spotify_link || ''} onChange={(e:any)=> setForm((s:any)=>({...s,spotify_link: e.target.value}))} />
                </div>
                <div>
                  {form.cover_url && <div className="mb-2"><img src={form.cover_url} alt="capa" className="w-36 rounded" /></div>}
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capa</label>
                  <ImageUploader onUpload={(url: string) => setForm((s:any) => ({ ...s, cover_url: url }))} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Salvar</Button>
                  <Button variant="ghost" type="button" onClick={() => { setEditingId(null); setForm({ name: '', artist: '', year: '', cover_url: null }); }}>Cancelar</Button>
                </div>
              </form>
            )}

            <div className="mt-3">
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition-colors"
                onClick={() => toggleTracks(a.id)}
                role="button"
                aria-expanded={!!showTracks[a.id]}
              >
                <div className="text-sm font-medium">Faixas {a.tracks_count ?? (expandedTracks[a.id]?.tracks ? Array.from(new Map((expandedTracks[a.id].tracks).map((tt:any)=>[tt.id, tt])).values()).length : 0)}</div>
                <div className="text-sm text-gray-600" aria-hidden>
                  {showTracks[a.id] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.21 5.23a.75.75 0 01.02 1.06L3.99 9.25H16a.75.75 0 010 1.5H3.99l3.24 2.96a.75.75 0 11-1.04 1.08l-4.5-4.11a.75.75 0 010-1.08l4.5-4.11a.75.75 0 011.06-.02z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {showTracks[a.id] && expandedTracks[a.id] && (
                <div className="mt-2">
                  <ol className="mt-2 space-y-2">
                    {Array.from(new Map((expandedTracks[a.id].tracks || []).map((tt:any)=>[tt.id, tt])).values()).map((t: any) => (
                      <li key={t.id} className="flex items-center justify-between">
                        <div className="text-sm">
                          {t.number ? `${t.number} - ` : ''}{t.name} {t.duration_seconds ? `(${t.duration_seconds}s)` : ''}
                        </div>
                        <div className="flex items-center gap-4">
                          <Button onClick={() => handleEditTrack(t, a.id)}>Editar</Button>
                          <Button variant="danger" onClick={() => handleDeleteTrack(t.id, a.id)}>Excluir</Button>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
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
