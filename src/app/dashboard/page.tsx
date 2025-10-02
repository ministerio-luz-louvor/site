"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      const sess = data.session ?? null;
      setSession(sess);
      setLoading(false);
      if (!sess) router.replace("/login");
    };
    check();
  }, [router]);

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p>Bem-vindo, {session?.user?.email}</p>
      <p className="mt-4">Esta rota está protegida e só aparece quando logado.</p>
    </div>
  );
}
