"use client";

import {
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Sparkles, AlertCircle } from "lucide-react";

export default function StripeForm({
  onPaymentSuccess,
  isLoading,
  methodName,
  preferredMethod,
}: {
  onPaymentSuccess: (receiptUrl: string) => void;
  isLoading: boolean;
  methodName: string;
  preferredMethod?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isWalletAvailable, setIsWalletAvailable] = useState(true);

  const lowerMethod = methodName.toLowerCase().trim();
  const isApplePay = lowerMethod.includes("apple");
  const isGooglePay = lowerMethod.includes("google");

  const isExpressCheckout = isApplePay || isGooglePay;

  const handlePayment = async () => {
    const form = document.getElementById(
      "create-service-form",
    ) as HTMLFormElement;
    if (form && !form.reportValidity()) return;

    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Obligatorio para PayPal, Amazon Pay y métodos europeos (Redirección)
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(
        error.message || "Error procesando el pago. Verifica los datos.",
      );
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onPaymentSuccess(`stripe_pi_${paymentIntent.id}`);
    } else {
      setIsProcessing(false);
    }
  };

  const handleWalletConfirm = async () => {
    const form = document.getElementById(
      "create-service-form",
    ) as HTMLFormElement;
    if (form && !form.reportValidity()) return;

    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(
        error.message || "Pago cancelado o rechazado por la billetera.",
      );
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onPaymentSuccess(`stripe_pi_${paymentIntent.id}`);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full mt-4 flex flex-col gap-6">
      {isExpressCheckout && isWalletAvailable ? (
        <div className="bg-black/40 p-6 rounded-3xl border border-white/5 flex flex-col justify-center shadow-inner">
          <p className="text-[10px] text-white/50 mb-6 text-center uppercase tracking-widest font-black">
            Verificando compatibilidad de {methodName}...
          </p>
          <ExpressCheckoutElement
            onReady={({ availablePaymentMethods }) => {
              if (!availablePaymentMethods) {
                setIsWalletAvailable(false);
                return;
              }
              // Si el navegador no tiene la wallet configurada, bajamos a Tarjeta
              if (isApplePay && !availablePaymentMethods.applePay)
                setIsWalletAvailable(false);
              if (isGooglePay && !availablePaymentMethods.googlePay)
                setIsWalletAvailable(false);
            }}
            onConfirm={handleWalletConfirm}
            options={{
              buttonHeight: 50,
              wallets: {
                applePay: isApplePay ? "auto" : "never",
                googlePay: isGooglePay ? "auto" : "never",
              },
            }}
          />
        </div>
      ) : (
        <div className="w-full bg-black/40 p-6 rounded-3xl border border-white/5 shadow-inner animate-in fade-in duration-500">
          <p className="text-[10px] text-white/50 mb-6 text-center uppercase tracking-widest font-black">
            {isExpressCheckout
              ? "Billetera no detectada en este navegador. Ingresa tu tarjeta:"
              : `Ingresa los datos de tu ${methodName}`}
          </p>
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: preferredMethod
                ? [preferredMethod]
                : undefined,
              wallets: { applePay: "never", googlePay: "never" },
            }}
          />
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500 text-xs font-bold uppercase tracking-widest text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20 flex items-center justify-center gap-2 mt-2 animate-in slide-in-from-top-2">
          <AlertCircle size={16} /> {errorMessage}
        </div>
      )}

      {(!isExpressCheckout || !isWalletAvailable) && (
        <button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing || isLoading || !stripe}
          className="group relative w-full overflow-hidden rounded-xl bg-elite-gold border border-white/10 px-8 py-5 text-center shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 mt-2"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer"></span>
          <span className="text-sm md:text-lg font-black uppercase tracking-widest text-elite-black flex items-center justify-center gap-2">
            {isProcessing || isLoading ? (
              "Procesando Pago Seguro..."
            ) : (
              <>
                <Sparkles size={20} /> Confirmar Pago y Publicar
              </>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
