"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X, Globe, User, MapPin, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { twMerge } from "tailwind-merge";

interface PlatformSettings {
  logo_text: string;
  primary_color: string;
  secondary_color: string;
}

interface Country {
  id?: string;
  code: string;
  name: string;
  is_active?: boolean;
}

interface NavbarProps {
  settings?: PlatformSettings;
  availableCountries?: Country[];
  currentCountry?: string | null;
  lang?: "es" | "en" | "pt";
  showBackButton?: boolean;
}

export default function MainNavbar({
  settings,
  availableCountries,
  currentCountry,
  lang = "es",
  showBackButton = false,
}: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [isMainSearchActive, setIsMainSearchActive] = useState(false);

  const [liveSettings, setLiveSettings] = useState<PlatformSettings>({
    logo_text: settings?.logo_text || "EliteServices",
    primary_color: settings?.primary_color || "#f59e0b",
    secondary_color: settings?.secondary_color || "#7f1d1d",
  });
  const [liveCountries, setLiveCountries] = useState<Country[]>(
    availableCountries || [],
  );
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const translations = {
    en: {
      locations: "Locations",
      searchCountry: "Search country...",
      searchServices: "Search profiles...",
      noCountries: "No countries found",
      noResults: "No results found",
      allCountries: "All Countries",
      searching: "Searching...",
      back: "Back to Catalog",
    },
    es: {
      locations: "Ubicaciones",
      searchCountry: "Buscar país...",
      searchServices: "Buscar perfiles...",
      noCountries: "Países no encontrados",
      noResults: "Sin resultados",
      allCountries: "Todos los Países",
      searching: "Buscando...",
      back: "Volver al Catálogo",
    },
    pt: {
      locations: "Localizações",
      searchCountry: "Procurar país...",
      searchServices: "Procurar perfis...",
      noCountries: "Nenhum país encontrado",
      noResults: "Sem resultados",
      allCountries: "Todos os Países",
      searching: "Buscando...",
      back: "Voltar ao Catálogo",
    },
  };

  const t = translations[lang];

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: sData } = await supabase
        .from("platform_settings")
        .select("*")
        .limit(1)
        .single();
      if (sData) setLiveSettings(sData as PlatformSettings);
      const { data: cData } = await supabase
        .from("countries")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (cData) setLiveCountries(cData as Country[]);
    };

    fetchInitialData();

    const channel = supabase
      .channel("public-navbar-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "platform_settings" },
        (payload) => {
          setLiveSettings(payload.new as PlatformSettings);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "countries" },
        () => {
          fetchInitialData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (mainSearchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      let query = supabase
        .from("services")
        .select(`id, name, country, service_images(image_url)`)
        .eq("is_approved", true)
        .ilike("name", `%${mainSearchQuery}%`);

      if (currentCountry) {
        query = query.eq("country", currentCountry);
      }

      const { data } = await query.limit(5);
      if (data) setSearchResults(data);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [mainSearchQuery, currentCountry]);

  const filteredCountries = liveCountries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()),
  );

  const handleCountrySelect = (countryName: string | null) => {
    setIsDrawerOpen(false);
    if (countryName) {
      router.push(`/?country=${encodeURIComponent(countryName)}`);
    } else {
      router.push(`/`);
    }
    router.refresh();
  };

  return (
    <>
      <motion.header
        className={twMerge(
          "fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between transition-colors duration-300",
          isScrolled
            ? "bg-black/95 backdrop-blur-md border-b border-white/5 shadow-2xl"
            : "bg-transparent",
        )}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
      >
        <motion.div
          className="flex-1 flex items-center justify-start"
          animate={{
            opacity: isScrollingDown ? 0 : 1,
            x: isScrollingDown ? -20 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {showBackButton ? (
            <Link
              href="/"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold tracking-widest uppercase text-[10px] md:text-xs bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-sm"
            >
              <ArrowLeft size={16} />{" "}
              <span className="hidden md:inline">{t.back}</span>
            </Link>
          ) : (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors flex items-center gap-2"
            >
              <Menu size={28} style={{ color: liveSettings.primary_color }} />
              {currentCountry && (
                <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-white/50">
                  {currentCountry}
                </span>
              )}
            </button>
          )}
        </motion.div>

        <div className="flex-1 flex items-center justify-center pointer-events-auto">
          <motion.span
            className="text-2xl md:text-3xl font-black tracking-tighter cursor-pointer uppercase"
            style={{ color: liveSettings.primary_color }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCountrySelect(null)}
          >
            {liveSettings.logo_text}
          </motion.span>
        </div>

        <motion.div
          className="flex-1 flex items-center justify-end relative"
          animate={{
            opacity: isScrollingDown ? 0 : 1,
            x: isScrollingDown ? 20 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex items-center">
            <AnimatePresence>
              {isMainSearchActive && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "250px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute right-12 top-1/2 -translate-y-1/2"
                >
                  <input
                    type="text"
                    value={mainSearchQuery}
                    onChange={(e) => setMainSearchQuery(e.target.value)}
                    className="w-full py-2 px-4 rounded-full bg-black/80 border border-white/10 focus:border-elite-gold outline-none text-sm text-white placeholder:text-white/30 backdrop-blur-md"
                    placeholder={t.searchServices}
                    autoFocus
                  />

                  {(mainSearchQuery.trim() !== "" ||
                    searchResults.length > 0) && (
                    <div className="absolute top-full right-0 mt-4 w-[300px] bg-elite-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                      {isSearching ? (
                        <div className="p-4 text-center text-xs text-elite-gold uppercase tracking-widest animate-pulse font-bold">
                          {t.searching}
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => {
                              setIsMainSearchActive(false);
                              setMainSearchQuery("");
                              router.push(`/profile/${result.id}`);
                            }}
                            className="w-full text-left p-4 hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center gap-4 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-black border border-white/10 overflow-hidden flex-shrink-0">
                              {result.service_images?.[0]?.image_url ? (
                                <img
                                  src={result.service_images[0].image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={16} className="text-white/30" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white tracking-wide">
                                {result.name}
                              </div>
                              <div className="text-[10px] text-elite-gold uppercase tracking-widest">
                                {result.country}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-white/40 uppercase tracking-widest">
                          {t.noResults}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => {
                setIsMainSearchActive(!isMainSearchActive);
                if (isMainSearchActive) setMainSearchQuery("");
              }}
              className="p-2 hover:bg-white/5 rounded-full transition-colors z-10 bg-transparent"
            >
              {isMainSearchActive ? (
                <X size={24} className="text-white/50 hover:text-white" />
              ) : (
                <Search
                  size={24}
                  style={{ color: liveSettings.primary_color }}
                />
              )}
            </button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-elite-dark border-r border-white/5 z-[70] shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <span
                  className="text-xl font-black uppercase tracking-widest"
                  style={{ color: liveSettings.primary_color }}
                >
                  {t.locations}
                </span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={20} className="text-white/50 hover:text-white" />
                </button>
              </div>

              <div className="p-6 border-b border-white/5">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="text"
                    placeholder={t.searchCountry}
                    value={countrySearchQuery}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 py-4 pl-12 pr-4 rounded-xl outline-none focus:border-elite-gold transition-all text-sm text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <button
                  onClick={() => handleCountrySelect(null)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all group ${!currentCountry ? "bg-white/10 border-white/20" : "hover:bg-white/5 border-transparent"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center group-hover:border-elite-gold/50 transition-all">
                    <Globe
                      size={18}
                      className="text-white/50 group-hover:text-elite-gold transition-colors"
                    />
                  </div>
                  <span className="font-bold text-white/70 group-hover:text-white transition-colors tracking-wide">
                    {t.allCountries}
                  </span>
                </button>

                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country.name)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all group ${currentCountry === country.name ? "bg-elite-gold/10 border-elite-gold/30" : "hover:bg-white/5 border-transparent"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentCountry === country.name ? "bg-elite-gold text-black" : "bg-black border border-white/10 text-white/50 group-hover:border-elite-gold/50 group-hover:text-elite-gold"}`}
                    >
                      <MapPin size={18} />
                    </div>
                    <span
                      className={`font-bold transition-colors tracking-wide ${currentCountry === country.name ? "text-elite-gold" : "text-white/70 group-hover:text-white"}`}
                    >
                      {country.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
