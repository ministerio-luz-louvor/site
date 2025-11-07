'use client'

import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';

type Props = {
  onUpload: (url: string) => void;
  bucket?: string;
};

export default function ImageUploader({ onUpload, bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'covers' }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || 'anon';
      const filePath = `${userId}/${Date.now()}_${file.name}`;

      const { error: uploadErr } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: false });
      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = (data as any)?.publicUrl;
      onUpload(publicUrl);
    } catch (err: any) {
      console.error('Upload error', err.message || err);
      try { alert('Erro no upload: ' + (err.message || String(err))); } catch (_) {}
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && (
        <div style={{ marginTop: 8 }}>
          <img src={preview} alt="preview" style={{ maxWidth: 200, borderRadius: 8 }} />
        </div>
      )}
      {uploading && (
        <div style={{ marginTop: 8, fontSize: 13 }}>Enviando...</div>
      )}
    </div>
  );
}
