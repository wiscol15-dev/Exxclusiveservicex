"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "@/components/StripeForm";
import {
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Diamond,
  Sparkles,
  UploadCloud,
  Smartphone,
  Landmark,
  Link as LinkIcon,
  Calendar,
  Home,
  Building,
  Tag,
  MessageCircle,
  Receipt,
  Copy,
  Check,
  Info,
  X,
} from "lucide-react";

interface Country {
  id: string;
  name: string;
  code: string;
}
interface PaymentMethod {
  id: string;
  name: string;
  details: string | null;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

export default function CreateService() {
  const router = useRouter();
  const [isExclusive, setIsExclusive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dbCountries, setDbCountries] = useState<Country[]>([]);
  const [dbPaymentMethods, setDbPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activePaymentMethod, setActivePaymentMethod] = useState<string>("");
  const [activePaymentDetails, setActivePaymentDetails] = useState<
    string | null
  >(null);
  const [activeMethodName, setActiveMethodName] = useState<string>("");
  const [isStripeMethod, setIsStripeMethod] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [paymentReceipt, setPaymentReceipt] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    country: "",
    province: "",
    google_maps_url: "",
    description: "",
    contact_phone: "",
    contact_whatsapp: "",
    contact_telegram: "",
    contact_email: "",
  });

  const [attentionLocations, setAttentionLocations] = useState<string[]>([]);
  const [serviceTags, setServiceTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const availableLocations = [
    { id: "Casa", icon: Home },
    { id: "Hotel", icon: Building },
    { id: "Motel", icon: MapPin },
  ];

  useEffect(() => {
    const fetchDynamicData = async () => {
      const [countriesRes, paymentsRes] = await Promise.all([
        supabase
          .from("countries")
          .select("*")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("payment_methods")
          .select("*")
          .eq("is_active", true)
          .order("name"),
      ]);
      if (countriesRes.data) setDbCountries(countriesRes.data);
      if (paymentsRes.data && paymentsRes.data.length > 0) {
        setDbPaymentMethods(paymentsRes.data);
        handlePaymentSelect(
          paymentsRes.data[0].id,
          paymentsRes.data[0].details,
          paymentsRes.data[0].name,
        );
      }
    };
    fetchDynamicData();
  }, []);

  useEffect(() => {
    if (isExclusive && !clientSecret) {
      fetch("/api/stripe/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
        })
        .catch(() => console.error("Error conectando con Stripe"));
    }
  }, [isExclusive, clientSecret]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentSelect = (
    id: string,
    details: string | null,
    name: string,
  ) => {
    setActivePaymentMethod(id);
    setActivePaymentDetails(details);
    setActiveMethodName(name);
    const lower = name.toLowerCase();
    const isGateway =
      lower.includes("card") ||
      lower.includes("pay") ||
      lower.includes("tarjeta") ||
      lower.includes("credito") ||
      lower.includes("stripe") ||
      lower.includes("apple") ||
      lower.includes("google") ||
      lower.includes("amazon") ||
      lower.includes("paypal") ||
      lower.includes("revolut") ||
      lower.includes("mbway") ||
      lower.includes("multibanco");
    setIsStripeMethod(isGateway);
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(value);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleLocation = (loc: string) =>
    setAttentionLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !serviceTags.includes(newTag)) {
        setServiceTags([...serviceTags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) =>
    setServiceTags(serviceTags.filter((tag) => tag !== tagToRemove));

  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    let remainingSlots = 5 - imageUrls.length;
    fileArray.forEach((file) => {
      if (remainingSlots <= 0 || !file.type.startsWith("image/")) return;
      remainingSlots--;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrls((prev) => {
          if (prev.length >= 5) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPaymentReceipt(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
      handleFileUpload(e.dataTransfer.files);
  };
  const handleAddUrl = () => {
    if (urlInput.trim() !== "" && imageUrls.length < 5) {
      setImageUrls((prev) => [...prev, urlInput]);
      setUrlInput("");
    }
  };
  const removeImage = (index: number) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== index));

  const saveProfileToDatabase = async (receiptUrl: string | null) => {
    setIsLoading(true);
    setError(null);

    if (
      !formData.contact_phone &&
      !formData.contact_whatsapp &&
      !formData.contact_telegram
    ) {
      setError("Debes proporcionar al menos un número de contacto.");
      setIsLoading(false);
      return;
    }
    if (imageUrls.length === 0) {
      setError("Debes incluir al menos una imagen para tu portafolio.");
      setIsLoading(false);
      return;
    }
    if (isExclusive && !receiptUrl) {
      setError(
        "El comprobante o pago es obligatorio para procesar el pase VIP.",
      );
      setIsLoading(false);
      return;
    }
    if (isExclusive && !isStripeMethod)
      await new Promise((resolve) => setTimeout(resolve, 2000));

    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .insert([
        {
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : null,
          country: formData.country,
          province: formData.province,
          google_maps_url: formData.google_maps_url || null,
          description: formData.description,
          contact_phone: formData.contact_phone || null,
          contact_whatsapp: formData.contact_whatsapp || null,
          contact_telegram: formData.contact_telegram || null,
          contact_email: formData.contact_email || null,
          attention_locations: attentionLocations,
          service_tags: serviceTags,
          payment_receipt_url: receiptUrl,
          is_approved: !isExclusive,
          is_exclusive: isExclusive,
        },
      ])
      .select()
      .single();

    if (serviceError) {
      setError("Error al procesar la solicitud.");
      setIsLoading(false);
      return;
    }

    const imagesToInsert = imageUrls.map((url) => ({
      service_id: serviceData.id,
      image_url: url,
    }));
    const { error: imagesError } = await supabase
      .from("service_images")
      .insert(imagesToInsert);

    if (imagesError) {
      setError("Se creó el perfil pero hubo un error con las imágenes.");
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
    setTimeout(() => {
      router.push("/");
    }, 4000);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-elite-black flex flex-col items-center justify-center p-4 selection:bg-elite-gold selection:text-elite-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-green-500/10 blur-[120px] pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-md bg-elite-dark border border-white/5 p-12 rounded-3xl shadow-2xl">
          <CheckCircle
            size={64}
            className="text-green-500 mb-6 animate-bounce"
          />
          <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-4">
            Postulación Exitosa
          </h1>
          <p className="text-sm text-white/50 leading-relaxed mb-8">
            La información ha sido procesada de manera encriptada y segura.
          </p>
          <div className="text-xs text-elite-gold uppercase tracking-widest animate-pulse font-bold">
            Redirigiendo al inicio...
          </div>
        </div>
      </main>
    );
  }

  const preferredStripeMethod = (() => {
    const lower = activeMethodName.toLowerCase();
    if (lower.includes("paypal")) return "paypal";
    if (lower.includes("amazon")) return "amazon_pay";
    if (lower.includes("revolut")) return "revolut_pay";
    if (lower.includes("mbway") || lower.includes("mb way")) return "mb_way";
    if (lower.includes("multibanco")) return "multibanco";
    return "card";
  })();

  const stripeAppearance = {
    theme: "night" as const,
    variables: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      colorBackground: "transparent",
      colorPrimary: "#f59e0b",
      colorText: "#ffffff",
      colorDanger: "#ef4444",
      borderRadius: "12px",
      spacingGridRow: "16px",
      colorTextPlaceholder: "rgba(255, 255, 255, 0.4)",
      colorIcon: "rgba(255, 255, 255, 0.6)",
    },
    rules: {
      ".Input": {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        padding: "16px",
        color: "#ffffff",
        transition: "all 0.2s ease",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
      },
      ".Input:focus": {
        border: "1px solid #f59e0b",
        boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)",
      },
      ".Label": {
        color: "rgba(255, 255, 255, 0.6)",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontSize: "11px",
        fontWeight: "bold",
        marginBottom: "10px",
      },
      ".Tab": {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        padding: "12px 16px",
        transition: "all 0.2s ease",
      },
      ".Tab:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      },
      ".Tab--selected": {
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        color: "#f59e0b",
      },
    },
  };

  const renderFormFields = (theme: "gold" | "silver") => {
    const focusColor =
      theme === "gold" ? "focus:border-elite-gold" : "focus:border-white/50";
    const titleColor = theme === "gold" ? "text-elite-gold" : "text-white/80";
    const dropzoneBorder = isDragging
      ? theme === "gold"
        ? "border-elite-gold bg-elite-gold/5"
        : "border-white/50 bg-white/5"
      : "border-white/10 bg-black/50 hover:border-white/30";

    return (
      <div className="space-y-8">
        <div className="bg-elite-dark/80 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <h2
            className={`text-lg font-black uppercase tracking-widest ${titleColor} mb-6 border-b border-white/5 pb-4`}
          >
            1. Perfil Principal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative md:col-span-2">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre Artístico"
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none transition-all`}
              />
            </div>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="number"
                name="age"
                required
                min="18"
                max="99"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Edad (+18)"
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none transition-all`}
              />
            </div>
            <div className="relative md:col-span-3">
              <FileText
                size={18}
                className="absolute left-4 top-4 text-white/30"
              />
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe tu exclusividad..."
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none transition-all resize-none`}
              />
            </div>
          </div>
        </div>

        <div className="bg-elite-dark/80 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <h2
            className={`text-lg font-black uppercase tracking-widest ${titleColor} mb-6 border-b border-white/5 pb-4`}
          >
            2. Ubicación Geográfica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <select
                name="country"
                required
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none transition-all appearance-none`}
              >
                <option value="" disabled className="text-white/30">
                  País
                </option>
                {dbCountries.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                name="province"
                required
                value={formData.province}
                onChange={handleInputChange}
                placeholder="Ciudad/Provincia"
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none transition-all`}
              />
            </div>
            <div className="relative md:col-span-2">
              <LinkIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="url"
                name="google_maps_url"
                value={formData.google_maps_url}
                onChange={handleInputChange}
                placeholder="Enlace de Google Maps (Opcional)"
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none transition-all`}
              />
            </div>
          </div>
        </div>

        <div className="bg-elite-dark/80 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <h2
            className={`text-lg font-black uppercase tracking-widest ${titleColor} mb-6 border-b border-white/5 pb-4`}
          >
            3. Servicios & Atención
          </h2>
          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
              Lugar de Atención
            </label>
            <div className="flex flex-wrap gap-3">
              {availableLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => toggleLocation(loc.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black tracking-widest uppercase transition-all ${attentionLocations.includes(loc.id) ? `bg-${theme === "gold" ? "elite-gold" : "white"} text-black shadow-lg` : "bg-black/50 border border-white/10 text-white/40 hover:text-white"}`}
                >
                  <loc.icon size={16} /> {loc.id}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
              Tus Servicios (Presiona Enter)
            </label>
            <div className="relative mb-3">
              <Tag
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Ej: Masajes, Despedidas..."
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none transition-all`}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceTags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-white"
                >
                  {tag}{" "}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-white/30 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-elite-dark/80 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <h2
            className={`text-lg font-black uppercase tracking-widest ${titleColor} mb-6 border-b border-white/5 pb-4 flex justify-between items-center`}
          >
            4. Métodos de Contacto{" "}
            <span className="text-[10px] text-white/30 font-bold bg-white/5 px-3 py-1 rounded-md">
              1 OBLIGATORIO
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                placeholder="Llamada"
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none`}
              />
            </div>
            <div className="relative">
              <MessageCircle
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500/50"
              />
              <input
                type="tel"
                name="contact_whatsapp"
                value={formData.contact_whatsapp}
                onChange={handleInputChange}
                placeholder="WhatsApp"
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none`}
              />
            </div>
            <div className="relative">
              <MessageCircle
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50"
              />
              <input
                type="text"
                name="contact_telegram"
                value={formData.contact_telegram}
                onChange={handleInputChange}
                placeholder="Telegram"
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none`}
              />
            </div>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="Email"
                className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white ${focusColor} focus:outline-none`}
              />
            </div>
          </div>
        </div>

        <div className="bg-elite-dark/80 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <h2
              className={`text-lg font-black uppercase tracking-widest ${titleColor}`}
            >
              5. Portafolio Visual
            </h2>
            <span className="text-xs text-white/40 font-mono tracking-widest uppercase">
              {imageUrls.length}/5 Máximo
            </span>
          </div>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${dropzoneBorder}`}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center w-full"
            >
              <UploadCloud
                size={40}
                className={`mb-4 transition-colors ${isDragging ? (theme === "gold" ? "text-elite-gold" : "text-white") : "text-white/30"}`}
              />
              <span className="text-sm font-bold uppercase tracking-widest text-white mb-2 text-center">
                Haz clic o arrastra tus fotos aquí
              </span>
            </label>
            <div className="w-full flex items-center gap-4 mt-8 mb-6">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                O Añade mediante enlace
              </span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            <div className="w-full flex gap-3">
              <div className="relative flex-1">
                <LinkIcon
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                  className={`w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white ${focusColor} focus:outline-none`}
                />
              </div>
              <button
                type="button"
                onClick={handleAddUrl}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${theme === "gold" ? "bg-elite-gold text-black" : "bg-white text-black"}`}
              >
                Añadir
              </button>
            </div>
          </div>
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-white/10 shadow-lg"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-3 bg-red-500 rounded-full text-white hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-elite-black text-white selection:bg-elite-gold selection:text-elite-black relative overflow-x-hidden pb-20">
      <div
        className={`fixed top-0 inset-x-0 h-screen bg-gradient-to-b ${isExclusive ? "from-elite-dark-red/10" : "from-zinc-800/20"} via-elite-black to-elite-black pointer-events-none z-0 transition-colors duration-1000`}
      />
      <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6 pt-8 md:pt-12">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/40 hover:text-white font-bold tracking-widest uppercase text-xs"
          >
            <ArrowLeft size={16} /> Volver
          </Link>
          <div className="flex bg-black p-1 rounded-full border border-white/10 shadow-2xl relative">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-elite-dark rounded-full transition-transform duration-500 ease-out ${isExclusive ? "translate-x-0 border border-elite-gold/30" : "translate-x-[calc(100%+4px)] border border-white/10"}`}
            ></div>
            <button
              type="button"
              onClick={() => setIsExclusive(true)}
              className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors duration-500 ${isExclusive ? "text-elite-gold" : "text-white/40"}`}
            >
              <Diamond
                size={14}
                className={isExclusive ? "fill-elite-gold/20" : ""}
              />{" "}
              VIP
            </button>
            <button
              type="button"
              onClick={() => setIsExclusive(false)}
              className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors duration-500 ${!isExclusive ? "text-white" : "text-white/40"}`}
            >
              Estándar
            </button>
          </div>
        </div>

        <div className="w-full bg-elite-dark border border-white/5 rounded-2xl p-4 mb-8 flex items-start gap-3 backdrop-blur-sm">
          <Info size={20} className="text-white/50 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/70 leading-relaxed">
            Tu anuncio estará visible durante{" "}
            <strong className="text-white">7 días completos</strong> a partir
            del momento de su publicación.
          </p>
        </div>

        {error && (
          <div className="w-full bg-red-950/50 border border-red-500/50 rounded-xl p-4 mb-8 flex items-start gap-3 backdrop-blur-sm">
            <p className="text-xs text-red-200 font-bold uppercase tracking-wider">
              {error}
            </p>
          </div>
        )}

        <div className="perspective-1000 relative">
          <form
            id="create-service-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isExclusive) {
                saveProfileToDatabase(null);
              } else if (!isStripeMethod) {
                saveProfileToDatabase(paymentReceipt);
              }
            }}
            className={`preserve-3d transition-transform duration-1000 ease-in-out ${!isExclusive ? "rotate-y-180" : ""}`}
          >
            <div
              className={`w-full backface-hidden ${!isExclusive ? "absolute top-0 left-0 pointer-events-none opacity-0" : "relative opacity-100"}`}
            >
              <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
                  Pase <span className="text-elite-gold">Exclusivo</span>
                </h1>
              </div>
              {renderFormFields("gold")}
              <div className="mt-8 bg-gradient-to-br from-elite-dark to-black border border-elite-gold/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-elite-gold/5 rounded-full blur-2xl"></div>
                <h2 className="text-lg font-black uppercase tracking-widest text-elite-gold mb-6 flex items-center gap-2">
                  <CreditCard size={20} /> Realizar Pago Seguro ($10.00)
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {dbPaymentMethods.map((method) => {
                    let IconComponent = CreditCard;
                    const lower = method.name.toLowerCase();
                    if (
                      lower.includes("mobile") ||
                      lower.includes("pay") ||
                      lower.includes("apple") ||
                      lower.includes("google")
                    )
                      IconComponent = Smartphone;
                    else if (
                      lower.includes("transfer") ||
                      lower.includes("zelle")
                    )
                      IconComponent = Landmark;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          handlePaymentSelect(
                            method.id,
                            method.details,
                            method.name,
                          )
                        }
                        className={`flex flex-col items-center gap-2 bg-black border rounded-xl py-4 transition-all duration-300 ${activePaymentMethod === method.id ? "border-elite-gold text-elite-gold shadow-[0_0_15px_rgba(245,158,11,0.15)] scale-105" : "border-white/10 text-white/40 hover:border-white/30 hover:text-white"}`}
                      >
                        <IconComponent size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center">
                          {method.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isStripeMethod ? (
                  clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: stripeAppearance }}
                    >
                      <StripeForm
                        onPaymentSuccess={saveProfileToDatabase}
                        isLoading={isLoading}
                        methodName={activeMethodName}
                        preferredMethod={preferredStripeMethod}
                      />
                    </Elements>
                  ) : (
                    <div className="py-10 text-center text-xs text-white/50 animate-pulse font-bold tracking-widest uppercase border border-white/5 rounded-xl bg-black/50">
                      Cargando Pasarela de Pagos...
                    </div>
                  )
                ) : (
                  <>
                    {activePaymentDetails && (
                      <div className="mb-6">
                        {(() => {
                          try {
                            const parsed = JSON.parse(activePaymentDetails);
                            if (Array.isArray(parsed))
                              return (
                                <div className="space-y-3">
                                  {parsed.map((field: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl group hover:border-white/10"
                                    >
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-elite-gold">
                                          {field.label}
                                        </span>
                                        <span className="text-sm text-white font-mono tracking-wider">
                                          {field.value}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCopy(field.value);
                                        }}
                                        className="p-2 bg-white/5 hover:bg-elite-gold hover:text-black rounded-lg transition-colors"
                                      >
                                        {copiedField === field.value ? (
                                          <Check
                                            size={16}
                                            className="text-green-500"
                                          />
                                        ) : (
                                          <Copy size={16} />
                                        )}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              );
                          } catch {
                            return (
                              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white/70 whitespace-pre-wrap">
                                {activePaymentDetails}
                              </div>
                            );
                          }
                        })()}
                      </div>
                    )}
                    <div className="mt-6 border-t border-white/5 pt-6 mb-6">
                      <label className="block text-xs font-bold uppercase tracking-widest text-white mb-3">
                        Adjuntar Comprobante
                      </label>
                      <input
                        type="file"
                        id="receipt-upload"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleReceiptUpload}
                      />
                      <label
                        htmlFor="receipt-upload"
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer ${paymentReceipt ? "border-green-500 bg-green-500/10" : "border-white/10 bg-black/50"}`}
                      >
                        <span className="flex items-center gap-3 text-sm text-white/70">
                          <Receipt
                            size={18}
                            className={
                              paymentReceipt
                                ? "text-green-500"
                                : "text-white/30"
                            }
                          />{" "}
                          {paymentReceipt
                            ? "Comprobante Adjuntado"
                            : "Seleccionar Archivo..."}
                        </span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-xl bg-elite-gold border border-white/10 px-8 py-5 text-center shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-[1.01] transition-all"
                    >
                      <span className="text-sm font-black uppercase tracking-widest text-elite-black flex items-center justify-center gap-2">
                        {isLoading ? (
                          "Procesando..."
                        ) : (
                          <>
                            <Sparkles size={20} /> Enviar Perfil VIP a Revisión
                          </>
                        )}
                      </span>
                    </button>
                  </>
                )}
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/40 mt-8 justify-center">
                  <ShieldCheck size={14} className="text-green-500" />{" "}
                  Encriptación de Grado Militar
                </div>
              </div>
            </div>
            <div
              className={`w-full backface-hidden rotate-y-180 ${isExclusive ? "absolute top-0 left-0 pointer-events-none opacity-0" : "relative opacity-100"}`}
            >
              <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-white">
                  Catálogo <span className="text-white/40">General</span>
                </h1>
              </div>
              {renderFormFields("silver")}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black px-8 py-5 rounded-xl text-center font-black uppercase tracking-widest hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? "Publicando..." : "Publicar de Forma Gratuita"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
