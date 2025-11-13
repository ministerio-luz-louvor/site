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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Configurações — Imagem Hero</h1>
        <p className="text-sm text-gray-600 mt-1">Envie imagens que aparecem no hero da home.</p>
      </div>

      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" onChange={onChange} className="block" />
        <button onClick={upload} disabled={!file || loading} className="px-4 py-2 bg-brand-navy text-white rounded-md disabled:opacity-60">
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      <div>
        <ul className="space-y-3">
          {files.length === 0 && <li className="text-gray-600">Nenhum arquivo encontrado.</li>}
          {files.map((f) => (
            <li key={f.name} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded">
              <img src={publicUrl(f.name)} alt={f.name} className="w-40 h-24 object-cover bg-gray-100 rounded" />
              <div className="flex-1">
                <div className="text-sm font-medium">{f.name}</div>
              </div>
              <div className="flex items-center gap-3">
                <a href={publicUrl(f.name)} target="_blank" rel="noreferrer" className="text-sm text-brand-navy">Abrir</a>
                <button onClick={() => remove(f.name)} className="text-sm text-red-600">Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
