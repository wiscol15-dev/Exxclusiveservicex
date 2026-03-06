"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Access denied. Invalid credentials or unauthorized entity.");
      setIsLoading(false);
      return;
    }

    router.push("/superadmin/dashboard");
  };

  return (
    <main className="relative min-h-screen bg-elite-black flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-elite-gold selection:text-elite-black">
      <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-elite-dark-red/5 via-elite-black to-elite-black pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-elite-gold/5 blur-[150px] pointer-events-none z-0" />

      <Link
        href="/"
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-white/40 hover:text-elite-gold transition-colors z-20 font-bold tracking-widest uppercase text-xs"
      >
        <ArrowLeft size={16} />
        Return to Portal
      </Link>

      <div className="relative z-10 w-full max-w-md bg-elite-dark/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="w-full flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Shield size={28} className="text-elite-gold" />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white uppercase text-center mb-2">
            Management
          </h1>
          <p className="text-xs text-white/40 font-mono tracking-widest uppercase text-center">
            Restricted Area
          </p>
        </div>

        {error && (
          <div className="w-full bg-elite-dark-red/20 border border-elite-dark-red/50 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="text-red-500 mt-0.5 flex-shrink-0"
            />
            <p className="text-xs text-red-200 font-medium leading-relaxed uppercase tracking-wider">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
          <div className="w-full relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Identifier"
              className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:border-elite-gold focus:outline-none focus:ring-1 focus:ring-elite-gold transition-all"
            />
          </div>

          <div className="w-full relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Security Key"
              className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:border-elite-gold focus:outline-none focus:ring-1 focus:ring-elite-gold transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden rounded-xl bg-elite-gold border border-white/10 px-8 py-4 text-center shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 mt-4"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer"></span>
            <span className="text-sm font-black uppercase tracking-widest text-elite-black">
              {isLoading ? "Authenticating..." : "Initialize Protocol"}
            </span>
          </button>
        </form>
      </div>
    </main>
  );
}
