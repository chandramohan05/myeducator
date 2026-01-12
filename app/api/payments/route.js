import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();

    // Check if amount is provided
    if (!body.amount) {
      return new Response(JSON.stringify({ error: "Amount required" }), { status: 400 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 1️⃣ Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Number(body.amount) * 100, // Razorpay expects the amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    // 2️⃣ Store the pending order in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Insert order into "orders" table with 'Pending' status
    const { error } = await supabase.from("orders").insert({
      product_id: body.product_id,
      quantity: body.quantity,
      total_amount: body.amount,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      customer_address: body.customer_address,
      customer_city: body.customer_city,
      customer_zip: body.customer_zip,

      order_id: order.id,  // Razorpay order id
      status: "Pending",    // Payment status is Pending until payment is completed
    });

    if (error) {
      console.error("Error storing order in Supabase:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // Return the order ID and amount to frontend
    return new Response(
      JSON.stringify({
        id: order.id, // Razorpay order ID
        amount: order.amount / 100, // Amount in INR (as Razorpay stores in paise)
      }),
      { status: 200 }
    );
    
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
