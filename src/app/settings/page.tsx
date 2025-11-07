"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

export default function SettingsPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchFiles(); }, []);

  async function fetchFiles() {
    try {
      const { data, error } = await supabase.storage.from('site-images').list('', { limit: 100 });
      if (error) throw error;
      setFiles(data || []);
    } catch (err: any) {
      console.error('fetchFiles error', err?.message || err);
      setFiles([]);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  async function upload() {
    if (!file) return alert('Selecione uma imagem');
    setLoading(true);
    const name = `hero-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('site-images').upload(name, file as File, { upsert: true });
    setLoading(false);
    if (error) return alert(error.message);
    setFile(null);
    await fetchFiles();
  }

  async function remove(name: string) {
    if (!confirm('Excluir este arquivo?')) return;
    const { error } = await supabase.storage.from('site-images').remove([name]);
    if (error) return alert(error.message);
    await fetchFiles();
  }

  function publicUrl(name: string) {
    try {
      return supabase.storage.from('site-images').getPublicUrl(name).data.publicUrl;
    } catch {
      return '';
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Configurações — Imagem Hero</h1>

      <div style={{ marginBottom: 12 }}>
        <input type="file" accept="image/*" onChange={onChange} />
        <button onClick={upload} disabled={!file || loading} style={{ marginLeft: 8 }}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {files.length === 0 && <li style={{ color: '#666' }}>Nenhum arquivo encontrado.</li>}
        {files.map((f) => (
          <li key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <img src={publicUrl(f.name)} alt={f.name} style={{ width: 160, height: 90, objectFit: 'cover', background: '#eee' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13 }}>{f.name}</div>
            </div>
            <div>
              <a href={publicUrl(f.name)} target="_blank" rel="noreferrer" style={{ marginRight: 8 }}>Abrir</a>
              <button onClick={() => remove(f.name)} style={{ color: '#b91c1c' }}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
