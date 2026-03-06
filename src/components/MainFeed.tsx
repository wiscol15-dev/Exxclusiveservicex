"use client";

import ServiceFlipCard from "./ServiceFlipCard";

interface Service {
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
  is_exclusive: boolean;
  created_at: string;
  images: string[];
}

export default function MainFeed({
  initialServices,
}: {
  initialServices: Service[];
}) {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
      {initialServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {initialServices.map((service) => (
            <ServiceFlipCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-white/30 border border-white/5 rounded-2xl bg-black/50">
          <p className="text-sm tracking-widest uppercase font-bold">
            No hay servicios disponibles en esta página.
          </p>
        </div>
      )}
    </div>
  );
}
