import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY as string;

    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe configuration missing" },
        { status: 500 },
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16" as any,
    });

    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 1000,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
