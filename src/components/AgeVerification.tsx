"use client";

import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(
      userAgent,
    );

    if (isBot) {
      return;
    }

    const isVerified = localStorage.getItem("elite_age_verified");
    if (!isVerified) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("elite_age_verified", "true");
    setIsVisible(false);
    document.body.style.overflow = "auto";
  };

  const handleReject = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="relative w-full max-w-lg bg-elite-dark border border-elite-gold/30 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-elite-gold/10 rounded-full flex items-center justify-center mb-6 border border-elite-gold/30">
          <ShieldAlert size={32} className="text-elite-gold" />
        </div>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white mb-4">
          Aviso de <span className="text-elite-gold">Contenido</span>
        </h2>

        <p className="text-sm text-white/70 leading-relaxed mb-8">
          Esta plataforma contiene material dirigido única y exclusivamente a
          personas mayores de edad. Al ingresar, confirmas que tienes al menos
          18 años o la mayoría de edad legal en tu jurisdicción, y que accedes
          de forma voluntaria.
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleReject}
            className="flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-colors bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 border border-transparent"
          >
            No, salir de aquí
          </button>

          <button
            onClick={handleAccept}
            className="flex-1 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-elite-gold text-black hover:bg-yellow-400 hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            Sí, soy mayor de 18
          </button>
        </div>
      </div>
    </div>
  );
}
