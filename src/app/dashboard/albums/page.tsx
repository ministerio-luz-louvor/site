'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../../../lib/supabaseClient';
import Link from 'next/link';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) return;
      const { data, error } = await supabase.from('albums').select('*').eq('created_by', userId).order('created_at', { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setAlbums(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Meus Álbuns</h2>
      <div style={{ margin: '8px 0' }}>
        <Link href="/dashboard/albums/new">Criar novo álbum</Link>
      </div>
      {loading && <p>Carregando...</p>}
      {!loading && albums.length === 0 && <p>Você ainda não tem álbuns.</p>}
      <div style={{ marginTop: 12 }}>
        {albums.map((a) => (
          <div key={a.id} style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>{a.name}</div>
            <div>{a.artist} {a.year ? `(${a.year})` : ''}</div>
            <div style={{ marginTop: 8 }}>{a.cover_url && <img src={a.cover_url} alt="capa" style={{ width: 120, borderRadius: 6 }} />}</div>
            <div style={{ marginTop: 8 }}>
              <Link href={`/dashboard/albums/${a.id}`}>Ver / Editar</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
