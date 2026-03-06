"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LogOut,
  CheckCircle,
  XCircle,
  Star,
  Trash2,
  ShieldAlert,
  Settings,
  Globe,
  CreditCard,
  LayoutDashboard,
  Save,
  Plus,
  Eye,
  X,
  Receipt,
  User,
  MapPin,
  Tag,
  Link as LinkIcon,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  age: number | null;
  country: string;
  province: string;
  google_maps_url: string | null;
  description: string;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_telegram: string | null;
  contact_email: string | null;
  attention_locations: string[];
  service_tags: string[];
  payment_receipt_url: string | null;
  is_exclusive: boolean;
  is_approved: boolean;
  created_at: string;
  service_images: { image_url: string }[];
}

interface PlatformSettings {
  id: string;
  logo_text: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

interface PaymentField {
  label: string;
  value: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  is_active: boolean;
  details: string | null;
  parsedDetails?: PaymentField[];
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "services" | "settings" | "countries" | "payments"
  >("services");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");

  const [newPaymentMethodName, setNewPaymentMethodName] = useState("");

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/superadmin/login");
      return;
    }
    setIsAuthorizing(false);
    fetchAllData();
  };

  const parsePaymentDetails = (details: string | null): PaymentField[] => {
    if (!details) return [];
    try {
      const parsed = JSON.parse(details);
      if (Array.isArray(parsed)) return parsed;
      return [{ label: "Instrucciones", value: details }];
    } catch {
      return [{ label: "Instrucciones", value: details }];
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);

    const [servicesRes, settingsRes, countriesRes, paymentsRes] =
      await Promise.all([
        supabase
          .from("services")
          .select(
            `
        id, name, age, country, province, google_maps_url, description, contact_phone, contact_whatsapp, contact_telegram, contact_email,
        attention_locations, service_tags, payment_receipt_url, is_exclusive, is_approved, created_at,
        service_images ( image_url )
      `,
          )
          .order("created_at", { ascending: false }),
        supabase.from("platform_settings").select("*").limit(1).single(),
        supabase.from("countries").select("*").order("name"),
        supabase.from("payment_methods").select("*").order("name"),
      ]);

    if (servicesRes.data) setServices(servicesRes.data as Service[]);
    if (settingsRes.data) setSettings(settingsRes.data as PlatformSettings);
    if (countriesRes.data) setCountries(countriesRes.data as Country[]);
    if (paymentsRes.data) {
      const formattedMethods = paymentsRes.data.map((pm) => ({
        ...pm,
        parsedDetails: parsePaymentDetails(pm.details),
      }));
      setPaymentMethods(formattedMethods);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/superadmin/login");
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("services")
      .update({ is_approved: !currentStatus })
      .eq("id", id);
    if (!error) {
      setServices(
        services.map((s) =>
          s.id === id ? { ...s, is_approved: !currentStatus } : s,
        ),
      );
      if (selectedService?.id === id)
        setSelectedService({ ...selectedService, is_approved: !currentStatus });
    }
  };

  const toggleExclusive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("services")
      .update({ is_exclusive: !currentStatus })
      .eq("id", id);
    if (!error) {
      setServices(
        services.map((s) =>
          s.id === id ? { ...s, is_exclusive: !currentStatus } : s,
        ),
      );
      if (selectedService?.id === id)
        setSelectedService({
          ...selectedService,
          is_exclusive: !currentStatus,
        });
    }
  };

  const deleteService = async (id: string) => {
    if (
      !window.confirm("CONFIRMATION REQUIRED: Delete this record permanently?")
    )
      return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) {
      setServices(services.filter((s) => s.id !== id));
      setSelectedService(null);
    }
  };

  const updateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const { error } = await supabase
      .from("platform_settings")
      .update({ logo_text: settings.logo_text })
      .eq("id", settings.id);
    if (!error) alert("Brand Settings Updated Successfully");
  };

  const addCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("countries")
      .insert([{ name: newCountryName, code: newCountryCode }])
      .select()
      .single();
    if (!error && data) {
      setCountries([...countries, data as Country]);
      setNewCountryName("");
      setNewCountryCode("");
    }
  };

  const toggleCountry = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("countries")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    if (!error)
      setCountries(
        countries.map((c) =>
          c.id === id ? { ...c, is_active: !currentStatus } : c,
        ),
      );
  };

  const deleteCountry = async (id: string) => {
    if (!window.confirm("Remove this country?")) return;
    const { error } = await supabase.from("countries").delete().eq("id", id);
    if (!error) setCountries(countries.filter((c) => c.id !== id));
  };

  const addPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentMethodName.trim()) return;
    const { data, error } = await supabase
      .from("payment_methods")
      .insert([{ name: newPaymentMethodName, is_active: true, details: "[]" }])
      .select()
      .single();
    if (!error && data) {
      setPaymentMethods([...paymentMethods, { ...data, parsedDetails: [] }]);
      setNewPaymentMethodName("");
    }
  };

  const handlePaymentFieldChange = (
    methodId: string,
    index: number,
    key: "label" | "value",
    newValue: string,
  ) => {
    setPaymentMethods((prev) =>
      prev.map((m) => {
        if (m.id === methodId && m.parsedDetails) {
          const updatedFields = [...m.parsedDetails];
          updatedFields[index] = { ...updatedFields[index], [key]: newValue };
          return { ...m, parsedDetails: updatedFields };
        }
        return m;
      }),
    );
  };

  const addPaymentField = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => {
        if (m.id === methodId) {
          return {
            ...m,
            parsedDetails: [
              ...(m.parsedDetails || []),
              { label: "", value: "" },
            ],
          };
        }
        return m;
      }),
    );
  };

  const removePaymentField = (methodId: string, index: number) => {
    setPaymentMethods((prev) =>
      prev.map((m) => {
        if (m.id === methodId && m.parsedDetails) {
          const updatedFields = [...m.parsedDetails];
          updatedFields.splice(index, 1);
          return { ...m, parsedDetails: updatedFields };
        }
        return m;
      }),
    );
  };

  const savePaymentMethod = async (method: PaymentMethod) => {
    const jsonDetails = JSON.stringify(method.parsedDetails || []);
    const { error } = await supabase
      .from("payment_methods")
      .update({ details: jsonDetails, is_active: method.is_active })
      .eq("id", method.id);
    if (!error) alert(`Configuración de ${method.name} guardada con éxito`);
  };

  const togglePaymentMethod = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("payment_methods")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    if (!error)
      setPaymentMethods(
        paymentMethods.map((p) =>
          p.id === id ? { ...p, is_active: !currentStatus } : p,
        ),
      );
  };

  const deletePaymentMethod = async (id: string) => {
    if (!window.confirm("Eliminar este método de pago permanentemente?"))
      return;
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);
    if (!error) setPaymentMethods(paymentMethods.filter((p) => p.id !== id));
  };

  if (isAuthorizing) {
    return (
      <div className="min-h-screen bg-elite-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-elite-gold"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-elite-black text-white selection:bg-elite-gold selection:text-elite-black relative">
      <nav className="w-full bg-black border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-elite-dark rounded-full flex items-center justify-center border border-elite-gold/30">
            <ShieldAlert size={20} className="text-elite-gold" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest uppercase text-white">
              Super<span className="text-elite-gold">Admin</span>
            </h1>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
              Command Center
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-lg"
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex overflow-x-auto gap-8 border-b border-white/10 mb-10 scrollbar-hide">
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${activeTab === "services" ? "text-elite-gold border-b-2 border-elite-gold" : "text-white/40 hover:text-white"}`}
          >
            <LayoutDashboard size={18} /> Registry Overview
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${activeTab === "settings" ? "text-elite-gold border-b-2 border-elite-gold" : "text-white/40 hover:text-white"}`}
          >
            <Settings size={18} /> Brand Settings
          </button>
          <button
            onClick={() => setActiveTab("countries")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${activeTab === "countries" ? "text-elite-gold border-b-2 border-elite-gold" : "text-white/40 hover:text-white"}`}
          >
            <Globe size={18} /> Locations
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${activeTab === "payments" ? "text-elite-gold border-b-2 border-elite-gold" : "text-white/40 hover:text-white"}`}
          >
            <CreditCard size={18} /> Financial Methods
          </button>
        </div>

        {isLoading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-elite-gold"></div>
          </div>
        ) : (
          <div className="w-full pb-20">
            {activeTab === "services" && (
              <div className="w-full overflow-x-auto bg-elite-dark/50 border border-white/5 rounded-2xl shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/50 text-[10px] uppercase tracking-widest text-white/40">
                      <th className="p-6 font-medium">Identity</th>
                      <th className="p-6 font-medium">Location</th>
                      <th className="p-6 font-medium text-center">Status</th>
                      <th className="p-6 font-medium text-center">
                        Exclusivity
                      </th>
                      <th className="p-6 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {services.map((service) => (
                      <tr
                        key={service.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-black border border-white/10 flex-shrink-0">
                              {service.service_images?.[0] ? (
                                <img
                                  src={service.service_images[0].image_url}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20 uppercase font-bold">
                                  No Img
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold tracking-wide text-white mb-1 flex items-center gap-2">
                                {service.name}{" "}
                                {service.age && (
                                  <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                                    {service.age}
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-2">
                                {service.payment_receipt_url && (
                                  <span
                                    title="Comprobante adjunto"
                                    className="flex items-center"
                                  >
                                    <Receipt
                                      size={12}
                                      className="text-elite-gold"
                                    />
                                  </span>
                                )}
                                <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
                                  {service.contact_whatsapp ||
                                    service.contact_phone ||
                                    "Sin Número"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-xs font-bold uppercase tracking-widest text-white/70 bg-white/5 px-3 py-1 rounded-md">
                            {service.country}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <button
                            onClick={() =>
                              toggleApproval(service.id, service.is_approved)
                            }
                            className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${service.is_approved ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                          >
                            {service.is_approved ? (
                              <CheckCircle size={14} />
                            ) : (
                              <XCircle size={14} />
                            )}
                            <span>
                              {service.is_approved ? "Approved" : "Pending"}
                            </span>
                          </button>
                        </td>
                        <td className="p-6 text-center">
                          <button
                            onClick={() =>
                              toggleExclusive(service.id, service.is_exclusive)
                            }
                            className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${service.is_exclusive ? "bg-elite-gold/10 text-elite-gold hover:bg-elite-gold/20" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                          >
                            {service.is_exclusive ? (
                              <Star size={14} className="fill-elite-gold" />
                            ) : (
                              <Star size={14} />
                            )}
                            <span>
                              {service.is_exclusive ? "VIP" : "Standard"}
                            </span>
                          </button>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedService(service)}
                              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors bg-white/5 border border-white/5"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => deleteService(service.id)}
                              className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {services.length === 0 && (
                  <div className="w-full py-12 flex flex-col items-center justify-center text-white/30">
                    <ShieldAlert size={48} className="mb-4 opacity-20" />
                    <p className="text-xs tracking-widest uppercase font-bold">
                      No records found
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && settings && (
              <div className="max-w-2xl bg-elite-dark/50 border border-white/5 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-lg font-black uppercase tracking-widest text-elite-gold mb-8">
                  Brand Configuration
                </h2>
                <form onSubmit={updateSettings} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                      Platform Name (Logo)
                    </label>
                    <input
                      type="text"
                      value={settings.logo_text}
                      onChange={(e) =>
                        setSettings({ ...settings, logo_text: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-elite-gold focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-elite-gold text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 transition-colors"
                  >
                    <Save size={16} /> Save Brand Settings
                  </button>
                </form>
              </div>
            )}

            {activeTab === "countries" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-elite-dark/50 border border-white/5 rounded-2xl p-8 shadow-2xl h-fit">
                  <h2 className="text-lg font-black uppercase tracking-widest text-elite-gold mb-6">
                    Add Location
                  </h2>
                  <form onSubmit={addCountry} className="space-y-4">
                    <input
                      type="text"
                      required
                      value={newCountryName}
                      onChange={(e) => setNewCountryName(e.target.value)}
                      placeholder="Country Name"
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-elite-gold focus:outline-none transition-all"
                    />
                    <input
                      type="text"
                      required
                      value={newCountryCode}
                      onChange={(e) => setNewCountryCode(e.target.value)}
                      placeholder="Code (e.g., US)"
                      maxLength={3}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-elite-gold focus:outline-none transition-all uppercase"
                    />
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
                    >
                      <Plus size={16} /> Add Country
                    </button>
                  </form>
                </div>
                <div className="lg:col-span-2 bg-elite-dark/50 border border-white/5 rounded-2xl p-8 shadow-2xl">
                  <h2 className="text-lg font-black uppercase tracking-widest text-white mb-6">
                    Active Locations
                  </h2>
                  <div className="space-y-3">
                    {countries.map((country) => (
                      <div
                        key={country.id}
                        className="flex items-center justify-between bg-black/50 border border-white/5 p-4 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono text-white/30 uppercase">
                            {country.code}
                          </span>
                          <span className="font-bold tracking-wide">
                            {country.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              toggleCountry(country.id, country.is_active)
                            }
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${country.is_active ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/40"}`}
                          >
                            {country.is_active ? "Active" : "Disabled"}
                          </button>
                          <button
                            onClick={() => deleteCountry(country.id)}
                            className="text-white/30 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="w-full space-y-8">
                <form
                  onSubmit={addPaymentMethod}
                  className="flex gap-4 max-w-xl bg-elite-dark/50 p-4 rounded-2xl border border-white/5 shadow-2xl"
                >
                  <input
                    type="text"
                    required
                    value={newPaymentMethodName}
                    onChange={(e) => setNewPaymentMethodName(e.target.value)}
                    placeholder="Ej: Zelle, Binance, Cripto..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-elite-gold focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
                  >
                    <Plus size={16} /> Añadir Método
                  </button>
                </form>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="bg-elite-dark/50 border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                        <h3 className="text-lg font-black uppercase tracking-widest text-elite-gold">
                          {method.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              togglePaymentMethod(method.id, method.is_active)
                            }
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${method.is_active ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/40"}`}
                          >
                            {method.is_active ? "Activo" : "Inactivo"}
                          </button>
                          <button
                            onClick={() => deletePaymentMethod(method.id)}
                            className="text-white/30 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 mb-6">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50">
                          Campos a solicitar al usuario
                        </label>
                        {method.parsedDetails?.map((field, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-black/30 p-2 rounded-xl border border-white/5"
                          >
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) =>
                                handlePaymentFieldChange(
                                  method.id,
                                  index,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder="Ej: Nombre Titular"
                              className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-white/20 focus:outline-none px-2"
                            />
                            <span className="text-white/20">:</span>
                            <input
                              type="text"
                              value={field.value}
                              onChange={(e) =>
                                handlePaymentFieldChange(
                                  method.id,
                                  index,
                                  "value",
                                  e.target.value,
                                )
                              }
                              placeholder="Ej: Elite Services"
                              className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-white/20 focus:outline-none px-2"
                            />
                            <button
                              onClick={() =>
                                removePaymentField(method.id, index)
                              }
                              className="p-2 text-white/20 hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addPaymentField(method.id)}
                          className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2 mt-2"
                        >
                          <Plus size={12} /> Agregar Campo
                        </button>
                      </div>

                      <button
                        onClick={() => savePaymentMethod(method)}
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-colors border border-white/5 mt-auto"
                      >
                        <Save size={16} /> Guardar Configuración
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-elite-dark border border-elite-gold/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50">
              <h2 className="text-lg font-black uppercase tracking-widest text-elite-gold flex items-center gap-3">
                Expediente: {selectedService.name}
                {selectedService.is_exclusive && (
                  <span className="bg-elite-gold text-black text-[10px] px-2 py-0.5 rounded-full">
                    VIP
                  </span>
                )}
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/30 block mb-1">
                        Ubicación
                      </span>{" "}
                      <span className="font-bold">
                        {selectedService.country}, {selectedService.province}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/30 block mb-1">Edad</span>{" "}
                      <span className="font-bold">
                        {selectedService.age || "No especificada"}
                      </span>
                    </div>
                    {selectedService.google_maps_url && (
                      <div className="col-span-2 mt-2">
                        <span className="text-white/30 block mb-1">
                          Enlace Google Maps
                        </span>
                        <a
                          href={selectedService.google_maps_url}
                          target="_blank"
                          className="font-bold text-elite-gold hover:underline flex items-center gap-1 text-xs truncate max-w-full"
                        >
                          <LinkIcon size={12} /> Abrir Mapa
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-white/30 block mb-1 text-sm">
                      Descripción
                    </span>
                    <p className="text-xs text-white/70 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                      {selectedService.description}
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                    Servicios & Atención
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedService.attention_locations?.map((loc, i) => (
                      <span
                        key={i}
                        className="bg-white/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.service_tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="border border-elite-gold/30 text-elite-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                    Contactos
                  </h3>
                  <div className="space-y-3 text-sm">
                    {selectedService.contact_whatsapp && (
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/30">WhatsApp</span>
                        <span className="font-bold">
                          {selectedService.contact_whatsapp}
                        </span>
                      </div>
                    )}
                    {selectedService.contact_telegram && (
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/30">Telegram</span>
                        <span className="font-bold">
                          {selectedService.contact_telegram}
                        </span>
                      </div>
                    )}
                    {selectedService.contact_phone && (
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/30">Llamada</span>
                        <span className="font-bold">
                          {selectedService.contact_phone}
                        </span>
                      </div>
                    )}
                    {selectedService.contact_email && (
                      <div className="flex justify-between">
                        <span className="text-white/30">Email</span>
                        <span className="font-bold">
                          {selectedService.contact_email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {selectedService.is_exclusive && (
                  <div className="bg-black/40 border border-elite-gold/30 rounded-2xl p-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-elite-gold mb-4 flex items-center gap-2">
                      <Receipt size={14} /> Comprobante de Pago VIP
                    </h3>
                    {selectedService.payment_receipt_url ? (
                      <div className="w-full bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[200px]">
                        <img
                          src={selectedService.payment_receipt_url}
                          alt="Comprobante"
                          className="max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full py-10 bg-white/5 rounded-xl border border-white/10 text-center text-xs text-white/30 font-bold tracking-widest uppercase">
                        No adjuntó comprobante
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                    Portafolio Fotográfico
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedService.service_images?.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] bg-black rounded-lg overflow-hidden relative border border-white/10"
                      >
                        <img
                          src={img.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/80 flex items-center justify-end gap-4">
              <button
                onClick={() =>
                  toggleExclusive(
                    selectedService.id,
                    selectedService.is_exclusive,
                  )
                }
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border ${selectedService.is_exclusive ? "bg-transparent border-white/10 text-white hover:bg-white/5" : "bg-elite-gold text-black border-elite-gold hover:bg-yellow-400"}`}
              >
                {selectedService.is_exclusive ? "Remover VIP" : "Hacer VIP"}
              </button>
              <button
                onClick={() =>
                  toggleApproval(
                    selectedService.id,
                    selectedService.is_approved,
                  )
                }
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${selectedService.is_approved ? "bg-white/10 text-white hover:bg-white/20" : "bg-green-600 text-white hover:bg-green-500"}`}
              >
                {selectedService.is_approved
                  ? "Rechazar / Suspender"
                  : "Aprobar Expediente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
