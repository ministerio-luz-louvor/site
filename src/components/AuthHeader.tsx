"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Link from "next/link";

export default function AuthHeader() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
    };

    getSession();

    const listener: any = supabase.auth.onAuthStateChange((_event: any, sess: any) => {
      setSession(sess ?? null);
    });

    const subscription = listener?.subscription ?? listener?.data?.subscription ?? listener;

    return () => {
      try {
        subscription?.unsubscribe?.();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ width: '100%', padding: 16, display: 'flex', justifyContent: 'flex-end' }}>
      {session ? (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/dashboard">
            <span style={{ fontFamily: 'monospace', fontSize: 14, textDecoration: 'underline' }}>{session.user?.email}</span>
          </Link>
          <button onClick={handleLogout} style={{ padding: '6px 10px' }}>Logout</button>
        </div>
      ) : (
        <Link href="/login">
          <button style={{ padding: '6px 10px' }}>Entrar</button>
        </Link>
      )}
    </div>
  );
}
