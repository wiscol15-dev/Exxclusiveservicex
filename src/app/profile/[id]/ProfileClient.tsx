"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  Send,
  Phone,
  Mail,
  Tag,
  Diamond,
} from "lucide-react";

interface ServiceProfile {
  id: string;
  name: string;
  age?: number | null;
  country: string;
  province: string;
  google_maps_url?: string | null;
  description: string;
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  contact_telegram?: string | null;
  contact_email?: string | null;
  attention_locations?: string[];
  service_tags?: string[];
  is_exclusive: boolean;
  images: string[];
}

export default function ProfileClient({
  service,
}: {
  service: ServiceProfile;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (service?.images && service.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % service.images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [service?.images]);

  if (!service) return null;

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 pt-4">
      <div
        className={`w-full h-[50vh] md:h-[75vh] mb-12 ${service.images && service.images.length > 1 ? "grid grid-cols-2 gap-4 md:gap-6" : "flex"}`}
      >
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          {service.images && service.images.length > 0 ? (
            service.images.map((img, idx) => (
              <div
                key={`left-${idx}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentImage ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover blur-3xl opacity-30 scale-125"
                  />
                </div>
                <img
                  src={img}
                  alt={service.name}
                  className="relative z-10 w-full h-full object-contain"
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-bold uppercase tracking-widest bg-white/5">
              Sin imágenes
            </div>
          )}
        </div>

        {service.images && service.images.length > 1 && (
          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            {service.images.map((img, idx) => (
              <div
                key={`right-${idx}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === (currentImage + 1) % service.images.length
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover blur-3xl opacity-30 scale-125"
                  />
                </div>
                <img
                  src={img}
                  alt={service.name}
                  className="relative z-10 w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="space-y-4">
            {service.is_exclusive && (
              <div className="inline-flex items-center gap-2 bg-elite-gold text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Diamond size={12} className="fill-black" /> VIP Exclusivo
              </div>
            )}

            <div className="flex flex-wrap items-end gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-white">
                {service.name}
              </h1>
              {service.age && (
                <span className="text-2xl md:text-4xl text-elite-gold font-light pb-1">
                  {service.age} Años
                </span>
              )}
            </div>

            <div>
              {service.google_maps_url ? (
                <Link
                  href={service.google_maps_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-elite-gold bg-elite-gold/10 hover:bg-elite-gold/20 border border-elite-gold/30 px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-lg hover:scale-105"
                >
                  <MapPin size={16} /> Ver en Google Maps
                </Link>
              ) : (
                <div className="inline-flex items-center gap-2 text-elite-gold font-bold uppercase tracking-widest text-[10px] md:text-xs bg-white/5 px-5 py-2.5 rounded-full border border-white/10">
                  <MapPin size={16} /> {service.country}, {service.province}
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/50 border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl">
            <h2 className="text-[10px] text-white/50 uppercase tracking-widest font-black mb-4">
              Sobre Mí
            </h2>
            <p className="text-sm md:text-base text-white/90 leading-relaxed font-medium whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

          <div className="flex flex-col gap-6 bg-black/50 border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl">
            {service.attention_locations &&
              service.attention_locations.length > 0 && (
                <div>
                  <span className="block text-[10px] text-white/50 uppercase tracking-widest font-black mb-3">
                    Atención en:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {service.attention_locations.map((loc, idx) => (
                      <span
                        key={idx}
                        className="bg-white/10 border border-white/5 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-md"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {service.service_tags && service.service_tags.length > 0 && (
              <div>
                <span className="block text-[10px] text-white/50 uppercase tracking-widest font-black mb-3">
                  Especialidades:
                </span>
                <div className="flex flex-wrap gap-2">
                  {service.service_tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="border border-elite-gold/30 text-elite-gold text-[10px] md:text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl flex items-center gap-2 bg-elite-gold/5 shadow-md"
                    >
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 w-full bg-elite-dark border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl flex flex-col gap-6">
            <div className="text-center mb-2 border-b border-white/5 pb-6">
              <h3 className="text-sm text-white uppercase tracking-widest font-black mb-2">
                Contactar Directamente
              </h3>
              <p className="text-xs text-white/40">
                Garantizamos discreción absoluta. Selecciona tu método
                preferido.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {service.contact_whatsapp && (
                <Link
                  href={`https://wa.me/${service.contact_whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 py-5 rounded-2xl text-white font-black text-xs md:text-sm transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(22,163,74,0.2)] hover:scale-[1.02]"
                >
                  <MessageCircle size={22} /> Escribir al WhatsApp
                </Link>
              )}

              {service.contact_telegram && (
                <Link
                  href={`https://t.me/${service.contact_telegram.replace("@", "")}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl text-white font-black text-xs md:text-sm transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:scale-[1.02]"
                >
                  <Send size={22} /> Mensaje en Telegram
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {service.contact_phone && (
                <Link
                  href={`tel:${service.contact_phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-5 rounded-2xl text-white font-black text-[10px] md:text-xs transition-all uppercase tracking-widest shadow-lg hover:scale-[1.05] border border-white/5"
                >
                  <Phone size={18} /> Llamar
                </Link>
              )}
              {service.contact_email && (
                <Link
                  href={`mailto:${service.contact_email}`}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-5 rounded-2xl text-white font-black text-[10px] md:text-xs transition-all uppercase tracking-widest shadow-lg hover:scale-[1.05] border border-white/5"
                >
                  <Mail size={18} /> Correo
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
