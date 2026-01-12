"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function SuccessClient() {
  const params = useSearchParams();

  const razorpay_order_id = params.get("oid");
  const razorpay_payment_id = params.get("pid");
  const razorpay_signature = params.get("sig");
  const amount = params.get("amount");
  const name = params.get("name") || "Customer";
  const student_id = params.get("student_id") || null;

  useEffect(() => {
    async function storePayment() {
      if (!razorpay_payment_id || !razorpay_order_id) return;

      const { data: exists, error: selectError } = await supabase
        .from("payments")
        .select("id")
        .eq("razorpay_payment_id", razorpay_payment_id)
        .single();

      if (selectError && !exists) console.error("Supabase SELECT ERROR:", selectError);
      if (exists) return;

      const { error } = await supabase.from("payments").insert({
        student_id: student_id ? Number(student_id) : null,
        method: "Razorpay",
        amount: amount ? Number(amount) : null,
        status: "Paid",
        date: new Date().toISOString().slice(0, 10),
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      if (error) console.error("Supabase INSERT ERROR:", error);
      else console.log("Payment stored successfully!");
    }

    storePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-7xl">✓</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3 text-gray-800">Payment Successful!</h1>
        <p className="text-gray-600 mb-7">Thank you {name}! Your order has been completed successfully.</p>

        <a href="/shop" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg transition-all block">
          Continue Shopping
        </a>
      </div>
    </div>
  );
}



