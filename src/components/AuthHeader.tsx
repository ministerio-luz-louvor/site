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

    const { subscription } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="w-full flex justify-end p-4">
      {session ? (
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm">{session.user.email}</span>
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
