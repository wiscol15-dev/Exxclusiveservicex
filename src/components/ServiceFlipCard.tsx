"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Send, MapPin, Tag } from "lucide-react";

interface ServiceProps {
  id: string;
  name: string;
  age?: number | null;
  country: string;
  province: string;
  description?: string;
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  contact_telegram?: string | null;
  contact_email?: string | null;
  attention_locations?: string[] | null;
  service_tags?: string[] | null;
  images: string[];
  is_exclusive: boolean;
}

export default function ServiceFlipCard({
  service,
}: {
  service: ServiceProps;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (service.images && service.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % service.images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [service.images]);

  return (
    <div
      className={`w-full group perspective-1000 ${service.is_exclusive ? "border border-elite-gold shadow-[0_0_20px_rgba(245,158,11,0.2)]" : "border border-white/5"} rounded-xl overflow-hidden`}
    >
      <div className="relative w-full aspect-[2/3] transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
        <div className="absolute inset-0 w-full h-full backface-hidden bg-elite-black">
          {service.images && service.images.length > 0 ? (
            <img
              src={service.images[currentImage]}
              alt={service.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-elite-dark flex items-center justify-center text-white/50 text-xs font-bold tracking-widest uppercase">
              Sin Imagen
            </div>
          )}
          {service.is_exclusive && (
            <span className="absolute top-4 left-4 bg-elite-gold text-elite-black font-extrabold uppercase tracking-widest text-[10px] px-3 py-1.5 shadow-lg">
              Exclusivo
            </span>
          )}
        </div>

        <div className="absolute inset-0 w-full h-full bg-elite-dark rotate-y-180 backface-hidden p-5 sm:p-6 flex flex-col border border-white/10 overflow-hidden">
          <div className="flex flex-col items-center mt-2 text-center flex-1 w-full">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1 line-clamp-1 w-full">
              {service.name}
              {service.age ? `, ${service.age}` : ""}
            </h3>

            <p className="text-[10px] font-bold text-elite-gold mb-4 uppercase tracking-widest flex items-center justify-center gap-1 w-full">
              <MapPin size={10} /> {service.country}, {service.province}
            </p>

            {service.attention_locations &&
              service.attention_locations.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
                  {service.attention_locations.map((loc, idx) => (
                    <span
                      key={idx}
                      className="bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              )}

            {service.description && (
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed line-clamp-4 max-w-[95%] mb-4">
                {service.description}
              </p>
            )}

            {service.service_tags && service.service_tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 overflow-hidden max-h-[50px] w-full">
                {service.service_tags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className="border border-elite-gold/30 text-elite-gold text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1"
                  >
                    <Tag size={8} /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full mt-auto pt-3 border-t border-white/5">
            {service.contact_whatsapp && (
              <Link
                href={`https://wa.me/${service.contact_whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 py-3 rounded-xl text-white font-black text-[10px] sm:text-xs transition-all uppercase tracking-widest shadow-lg hover:scale-[1.02]"
              >
                <MessageCircle size={16} /> WhatsApp
              </Link>
            )}

            <div className="flex gap-2 w-full">
              {service.contact_telegram && (
                <Link
                  href={`https://t.me/${service.contact_telegram.replace("@", "")}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-white font-black text-[9px] sm:text-[10px] transition-all uppercase tracking-widest shadow-lg hover:scale-[1.02]"
                >
                  <Send size={14} /> Telegram
                </Link>
              )}
              {service.contact_phone && (
                <Link
                  href={`tel:${service.contact_phone.replace(/[^0-9+]/g, "")}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white font-black text-[9px] sm:text-[10px] transition-all uppercase tracking-widest shadow-lg hover:scale-[1.02]"
                >
                  <Phone size={14} /> Llamar
                </Link>
              )}
            </div>

            {service.contact_email &&
              !service.contact_whatsapp &&
              !service.contact_telegram &&
              !service.contact_phone && (
                <Link
                  href={`mailto:${service.contact_email}`}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white font-black text-[10px] sm:text-xs transition-all uppercase tracking-widest shadow-lg hover:scale-[1.02]"
                >
                  <Mail size={14} /> Email
                </Link>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
