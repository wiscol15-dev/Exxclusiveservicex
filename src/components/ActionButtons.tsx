"use client";

import Link from "next/link";
import { Sparkles, Crown } from "lucide-react";

export default function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full py-8 z-20">
      <Link
        href="/services/create"
        className="group relative w-full sm:w-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-elite-dark to-black border border-elite-gold/50 px-6 py-4 text-center shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:border-elite-gold transition-all duration-500 hover:-translate-y-1"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-elite-gold/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
        <span className="flex items-center justify-center gap-3 text-2xl font-black uppercase tracking-widest text-elite-gold">
          <Crown size={16} />
          Servicios
        </span>
      </Link>
    </div>
  );
}
