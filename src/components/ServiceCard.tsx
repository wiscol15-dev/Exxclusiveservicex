"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Service {
  id: string;
  title: string;
  country: string;
  province: string;
  description?: string;
  phone: string;
  email?: string;
  is_exclusive: boolean;
  images: { image_url: string }[];
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!service.images || service.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % service.images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [service.images]);

  return (
    <div className="w-full flex flex-col items-center justify-center h-[100dvh] lg:h-auto lg:aspect-[3/4]">
      {service.is_exclusive && (
        <div className="h-[10vh] lg:h-12 flex items-center justify-center w-full lg:mb-4">
          <span className="text-yellow-500 font-black tracking-widest uppercase animate-pulse text-sm">
            Exclusivo
          </span>
        </div>
      )}

      <div
        className="relative w-[85%] lg:w-full h-[70vh] lg:h-full perspective-1000 cursor-pointer rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-zinc-800"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden bg-zinc-900">
            {service.images && service.images.length > 0 ? (
              service.images.map((img, index) => (
                <Image
                  key={index}
                  src={img.image_url}
                  alt={service.title}
                  fill
                  priority={index === 0 && service.is_exclusive}
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${index === currentImage ? "opacity-100" : "opacity-0"}`}
                  sizes="(max-width: 1024px) 85vw, 33vw"
                />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest">
                Sin Imagen
              </div>
            )}
          </div>

          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-zinc-900 rounded-2xl p-8 flex flex-col justify-between items-center text-white border border-zinc-700">
            <div className="w-full flex flex-col items-center mt-4">
              <h3 className="text-2xl lg:text-3xl font-black mb-2 text-center leading-tight">
                {service.title}
              </h3>
              <p className="text-sm font-medium text-amber-500 mb-6 tracking-wide uppercase">
                {service.country}, {service.province}
              </p>

              {service.description && (
                <p className="text-center text-sm text-zinc-300 leading-relaxed max-w-[90%]">
                  {service.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full mb-4">
              <a
                href={`https://wa.me/${service.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 px-4 rounded-xl text-center transition-all duration-300 uppercase tracking-wider"
              >
                Contactar
              </a>
              {service.email && (
                <a
                  href={`mailto:${service.email}`}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-4 rounded-xl text-center transition-all duration-300 uppercase tracking-wider"
                >
                  Email
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-[10vh] lg:hidden w-full flex items-center justify-center">
        <span className="text-zinc-600 font-mono tracking-widest uppercase text-xs animate-bounce">
          Desliza
        </span>
      </div>
    </div>
  );
}
