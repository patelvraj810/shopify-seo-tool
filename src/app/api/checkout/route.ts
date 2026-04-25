import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { priceId, customerId } = await request.json();
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/audit?upgraded=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`,
        customer: customerId || undefined,
      });
      return NextResponse.json({ url: session.url });
    }
    return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/audit?upgraded=true` });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}