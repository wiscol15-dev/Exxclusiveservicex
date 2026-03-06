import { supabase } from "@/lib/supabase";
import ProfileClient from "./ProfileClient";
import MainNavbar from "@/components/MainNavbar";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const { data: settingsData } = await supabase
    .from("platform_settings")
    .select("*")
    .limit(1)
    .single();

  const { data: service, error } = await supabase
    .from("services")
    .select(
      `
      id, name, age, country, province, google_maps_url, description,
      contact_phone, contact_whatsapp, contact_telegram, contact_email,
      attention_locations, service_tags, is_exclusive, created_at,
      service_images ( image_url )
    `,
    )
    .eq("id", id)
    .eq("is_approved", true)
    .single();

  if (error || !service) {
    redirect("/");
  }

  // BLINDAJE: Aseguramos que 'images' siempre sea un array válido
  const formattedService = {
    ...service,
    images: service.service_images
      ? service.service_images.map((img: any) => img.image_url)
      : [],
  };

  return (
    <main className="relative min-h-screen bg-elite-black overflow-x-hidden selection:bg-elite-gold selection:text-elite-black flex flex-col">
      <MainNavbar settings={settingsData || undefined} showBackButton={true} />
      <div className="flex-1 w-full flex items-center justify-center pt-28 pb-12 px-4 md:px-8">
        <ProfileClient service={formattedService} />
      </div>
    </main>
  );
}
