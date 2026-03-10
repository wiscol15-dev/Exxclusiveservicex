"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  ChevronRight,
  Instagram,
  Twitter,
} from "lucide-react";

interface PlatformSettings {
  logo_text: string;
  primary_color: string;
  secondary_color: string;
}

interface FooterProps {
  settings?: PlatformSettings;
}

export default function Footer({ settings }: FooterProps) {
  const [liveSettings, setLiveSettings] = useState<PlatformSettings>({
    logo_text: settings?.logo_text || "exxclusiveservicex",
    primary_color: settings?.primary_color || "#f59e0b",
    secondary_color: settings?.secondary_color || "#7f1d1d",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!settings) {
        const { data } = await supabase
          .from("platform_settings")
          .select("*")
          .limit(1)
          .single();
        if (data) setLiveSettings(data as PlatformSettings);
      }
    };
    fetchSettings();

    const channel = supabase
      .channel("public-footer-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "platform_settings" },
        (payload) => {
          setLiveSettings(payload.new as PlatformSettings);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [settings]);

  const text = liveSettings.logo_text;
  const splitIndex = Math.ceil(text.length / 2);
  const firstHalf = text.slice(0, splitIndex);
  const secondHalf = text.slice(splitIndex);

  return (
    <footer className="relative w-full bg-black border-t border-white/5 pt-16 pb-8 overflow-hidden z-20">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent to-transparent"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, ${liveSettings.secondary_color}, transparent)`,
        }}
      ></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black tracking-tighter text-white mb-4 uppercase">
              {firstHalf}
              <span style={{ color: liveSettings.primary_color }}>
                {secondHalf}
              </span>
            </span>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              El epicentro del lujo y la exclusividad. Conectando deseos de alto
              nivel con experiencias inolvidables a nivel global.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-2">
              <Lock size={16} style={{ color: liveSettings.primary_color }} />
              Privacidad Absoluta
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <Link
                  href="/terminos"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight
                    size={14}
                    style={{ color: liveSettings.primary_color }}
                  />
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight
                    size={14}
                    style={{ color: liveSettings.primary_color }}
                  />
                  Políticas de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/discrecion"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight
                    size={14}
                    style={{ color: liveSettings.primary_color }}
                  />
                  Discreción de Datos
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-2">
              <ShieldCheck
                size={16}
                style={{ color: liveSettings.primary_color }}
              />
              Plataforma Segura
            </h4>
            <p className="text-xs text-white/50 mb-4 max-w-xs">
              Todas las transacciones y comunicaciones están encriptadas. Solo
              para mayores de 18 años.
            </p>
            <div className="flex gap-4 items-center">
              <div className="p-2 bg-elite-dark rounded-lg border border-white/10">
                <CreditCard size={20} className="text-white/40" />
              </div>
              <div className="text-xs text-white/60 font-bold uppercase tracking-wider">
                Apple Pay
                <br />
                Google Pay
                <br />
                Tarjetas
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/40 font-mono">
            &copy; {new Date().getFullYear()} {liveSettings.logo_text}. Todos
            los derechos reservados. 18+
          </p>

          <div className="flex gap-6">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <Twitter size={18} />
            </a>
          </div>

          <Link
            href="/superadmin/login"
            className="text-[10px] text-white/10 hover:text-white/40 underline underline-offset-4 transition-colors tracking-widest uppercase"
          >
            exxelite
          </Link>
        </div>
      </div>
    </footer>
  );
}
