"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createClient } from "@supabase/supabase-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

export default function CreateServicePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const [isExclusive, setIsExclusive] = useState<boolean | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 10) {
        alert("Maximum 10 images allowed.");
        return;
      }
      setImages((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (e.target.value.length <= 200) {
      setDescription(e.target.value);
    }
  };

  const uploadImagesToSupabase = async (serviceId: string) => {
    const uploadedUrls: string[] = [];
    for (const file of images) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${serviceId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("services_bucket")
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("services_bucket")
          .getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
    }
    return uploadedUrls;
  };

  const saveServiceToDatabase = async (exclusiveStatus: boolean) => {
    const serviceId = crypto.randomUUID();

    const { error: serviceError } = await supabase.from("services").insert({
      id: serviceId,
      title,
      country,
      province,
      phone,
      email,
      description,
      is_exclusive: exclusiveStatus,
      is_approved: !exclusiveStatus,
    });

    if (serviceError) throw serviceError;

    if (images.length > 0) {
      const imageUrls = await uploadImagesToSupabase(serviceId);
      const imageRecords = imageUrls.map((url) => ({
        service_id: serviceId,
        image_url: url,
      }));

      const { error: imagesError } = await supabase
        .from("service_images")
        .insert(imageRecords);
      if (imagesError) throw imagesError;
    }
  };

  const handleProceedToPayment = async () => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }),
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep(3);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalSubmit = async (exclusiveStatus: boolean) => {
    setIsSubmitting(true);
    try {
      await saveServiceToDatabase(exclusiveStatus);
      router.push("/");
    } catch (error) {
      console.error("Error saving service:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-2xl">
        {step === 1 && (
          <div className="flex flex-col gap-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
            <h1 className="text-3xl font-black mb-4">Service Details</h1>

            <input
              type="text"
              placeholder="Title *"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 outline-none focus:border-indigo-500"
            />

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Country *"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl p-4 outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Province *"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl p-4 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-4">
              <input
                type="tel"
                placeholder="WhatsApp Number *"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl p-4 outline-none focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl p-4 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="relative">
              <textarea
                placeholder="Description (Optional)"
                value={description}
                onChange={handleDescriptionChange}
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 outline-none focus:border-indigo-500 resize-none"
              />
              <span className="absolute bottom-4 right-4 text-xs text-zinc-500">
                {description.length}/200
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Images (Max 10)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
              <span className="text-xs text-zinc-500">
                {images.length} images selected
              </span>
            </div>

            <button
              disabled={!title || !country || !province || !phone}
              onClick={() => setStep(2)}
              className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
            <h2 className="text-3xl font-black mb-6">Make it Exclusive?</h2>
            <p className="text-zinc-400 mb-10">
              Exclusive services are pinned at the top and highlighted. Requires
              administrative approval.
            </p>

            <div className="flex w-full gap-4">
              <button
                onClick={() => handleFinalSubmit(false)}
                disabled={isSubmitting}
                className="w-1/2 py-4 border border-zinc-700 rounded-xl font-bold uppercase text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "No, Standard"}
              </button>
              <button
                onClick={handleProceedToPayment}
                className="w-1/2 py-4 bg-amber-500 text-black rounded-xl font-bold uppercase shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:bg-amber-400 transition-colors"
              >
                Yes, Exclusive
              </button>
            </div>
          </div>
        )}

        {step === 3 && clientSecret && (
          <div className="w-full">
            <Elements
              options={{ clientSecret, appearance: { theme: "night" } }}
              stripe={stripePromise}
            >
              <CheckoutForm onSuccess={() => handleFinalSubmit(true)} />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}
