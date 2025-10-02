"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

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

    // listener may be { data: { subscription } } or a subscription-like object
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
    <header className="w-full flex justify-end p-4">
      {session ? (
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="font-mono text-sm underline">
            {session.user.email}
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-gray-800 text-white text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <a href="/login" className="px-3 py-1 rounded bg-gray-100 text-sm">
          Entrar
        </a>
      )}
    </header>
  );
}
