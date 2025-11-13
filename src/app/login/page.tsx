"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect") || "/settings";

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // after login, redirect to requested page or /settings by default
    router.push(redirectParam);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form
        onSubmit={handleEmailLogin}
        className="w-full max-w-md bg-white/60 p-6 rounded shadow"
      >
        <h1 className="text-lg font-semibold mb-4">Entrar</h1>
        <label className="block mb-2 text-sm">Email</label>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <label className="block mb-2 text-sm">Senha</label>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 text-white"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
