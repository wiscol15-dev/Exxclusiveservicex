"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

interface CheckoutFormProps {
  onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      setErrorMessage(null);
      setIsProcessing(false);
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
    >
      <PaymentElement className="mb-4" />
      {errorMessage && (
        <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
      )}
      <button
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-amber-500 text-black rounded-xl font-black uppercase tracking-widest disabled:opacity-50 hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.5)]"
      >
        {isProcessing ? "Processing..." : "Pay & Publish Exclusive"}
      </button>
    </form>
  );
}
