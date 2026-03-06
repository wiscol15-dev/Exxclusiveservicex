"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  currentCountry,
}: {
  currentPage: number;
  totalPages: number;
  currentCountry?: string | null;
}) {
  const router = useRouter();

  const handleNavigation = (page: number) => {
    let url = `/?page=${page}`;
    if (currentCountry) {
      url += `&country=${encodeURIComponent(currentCountry)}`;
    }
    router.push(url);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center gap-6 my-12 z-20">
      {currentPage > 1 ? (
        <button
          onClick={() => handleNavigation(currentPage - 1)}
          className="p-3 rounded-full border border-white/10 bg-black/50 text-white hover:border-elite-gold hover:text-elite-gold transition-all shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
      ) : (
        <button
          disabled
          className="p-3 rounded-full border border-white/5 bg-transparent text-white/20 cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <span className="text-xs font-black tracking-widest text-white/50 uppercase bg-black/40 border border-white/5 px-6 py-2 rounded-full">
        Página <span className="text-elite-gold">{currentPage}</span> de{" "}
        {totalPages}
      </span>

      {currentPage < totalPages ? (
        <button
          onClick={() => handleNavigation(currentPage + 1)}
          className="p-3 rounded-full border border-white/10 bg-black/50 text-white hover:border-elite-gold hover:text-elite-gold transition-all shadow-lg"
        >
          <ChevronRight size={20} />
        </button>
      ) : (
        <button
          disabled
          className="p-3 rounded-full border border-white/5 bg-transparent text-white/20 cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
