import MainNavbar from "@/components/MainNavbar";
import ActionButtons from "@/components/ActionButtons";
import MainFeed from "@/components/MainFeed";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export const metadata = {
  title: "exxclusiveservicex | Catálogo Global VIP",
  description:
    "High-end luxury marketplace for exclusive services. Absolute discretion, security, and premium experiences worldwide.",
  robots: "index, follow",
};

export default async function HomePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const pageParam = searchParams?.page;
  const currentPage = typeof pageParam === "string" ? parseInt(pageParam) : 1;
  const itemsPerPage = 12;

  const countryParam = searchParams?.country;
  const currentCountry = typeof countryParam === "string" ? countryParam : null;

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let lang: "es" | "en" | "pt" = "es";
  if (currentCountry) {
    const c = currentCountry.toLowerCase();
    if (c === "estados unidos" || c === "united states") lang = "en";
    else if (c === "portugal" || c === "brasil") lang = "pt";
  }

  const { data: settingsData } = await supabase
    .from("platform_settings")
    .select("*")
    .limit(1)
    .single();

  const { data: countriesData } = await supabase
    .from("countries")
    .select("*")
    .eq("is_active", true)
    .order("name");

  let countQuery = supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true);

  if (currentCountry) {
    countQuery = countQuery.eq("country", currentCountry);
  }

  const { count } = await countQuery;
  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  let dataQuery = supabase
    .from("services")
    .select(
      `
      id,
      name,
      age,
      country,
      province,
      description,
      contact_phone,
      contact_whatsapp,
      contact_telegram,
      contact_email,
      attention_locations,
      service_tags,
      is_exclusive,
      created_at,
      service_images (
        image_url
      )
    `,
    )
    .eq("is_approved", true);

  if (currentCountry) {
    dataQuery = dataQuery.eq("country", currentCountry);
  }

  const { data: rawServices, error } = await dataQuery
    .order("is_exclusive", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching services:", error);
  }

  const formattedServices = rawServices
    ? rawServices.map((service: any) => ({
        id: service.id,
        name: service.name,
        age: service.age,
        country: service.country,
        province: service.province,
        description: service.description,
        contact_phone: service.contact_phone,
        contact_whatsapp: service.contact_whatsapp,
        contact_telegram: service.contact_telegram,
        contact_email: service.contact_email,
        attention_locations: service.attention_locations,
        service_tags: service.service_tags,
        is_exclusive: service.is_exclusive,
        created_at: service.created_at,
        images: service.service_images.map((img: any) => img.image_url),
      }))
    : [];

  return (
    <main className="relative min-h-screen bg-elite-black overflow-x-hidden selection:bg-elite-gold selection:text-elite-black flex flex-col justify-between">
      <div className="fixed top-0 inset-x-0 h-screen bg-gradient-to-b from-elite-dark-red/10 via-elite-black to-elite-black pointer-events-none z-0" />
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-elite-gold/5 blur-[150px] pointer-events-none z-0" />

      <div className="flex-1">
        <MainNavbar
          settings={settingsData || undefined}
          availableCountries={countriesData || []}
          currentCountry={currentCountry}
          lang={lang}
        />

        <div className="relative z-10 flex flex-col items-center w-full pt-28">
          <MainFeed initialServices={formattedServices} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              currentCountry={currentCountry}
            />
          )}

          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-4 pb-12">
            <ActionButtons />
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full mt-auto">
        <Footer settings={settingsData || undefined} />
      </div>
    </main>
  );
}
