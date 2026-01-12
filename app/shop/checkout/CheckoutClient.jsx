"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();

  const productId = params.get("id");
  const BUCKET = "product_images";

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    if (productId) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) console.error(error);
    else setProduct(data);
  }

  function getImageUrl(path) {
    if (!path) return null;
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePayment() {
    if (!form.fullName || !form.phone || !form.address) {
      return alert("Please fill all required fields!");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          amount: product.price * qty,
          receipt: `order_${productId}`,
          product_id: product.id,
          quantity: qty,
          customer_name: form.fullName,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: form.address,
          customer_city: form.city,
          customer_zip: form.zip,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorResponse = await res.json().catch(() => ({}));
        console.error("Payment API Error:", errorResponse);
        alert("Payment creation failed. Please try again.");
        setLoading(false);
        return;
      }

      const order = await res.json();

      if (!order.id) {
        console.error("Order creation failed: No order ID returned.");
        alert("Payment creation failed.");
        setLoading(false);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Azroute Shop",
          description: product.name,
          order_id: order.id,
          handler: async function (response) {
            const { error } = await supabase.from("orders").insert({
              product_id: product.id,
              quantity: qty,
              total_amount: product.price * qty,
              customer_name: form.fullName,
              customer_email: form.email,
              customer_phone: form.phone,
              customer_address: form.address,
              customer_city: form.city,
              customer_zip: form.zip,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              status: "Paid",
            });

            if (error) console.error("Supabase Insert Error:", error);

            router.push(
              `/shop/success` +
                `?oid=${response.razorpay_order_id}` +
                `&pid=${response.razorpay_payment_id}` +
                `&sig=${response.razorpay_signature}` +
                `&amount=${product.price * qty}` +
                `&name=${encodeURIComponent(form.fullName)}`
            );
          },
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: form.phone,
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      setLoading(false);
    } catch (error) {
      console.error("Error in Razorpay payment process:", error);
      alert("An error occurred during payment creation.");
      setLoading(false);
    }
  }

  if (!product)
    return <div className="text-center mt-20 text-xl">Loading product...</div>;

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>

          <form className="space-y-4">
            <input name="fullName" onChange={handleChange} className="input" placeholder="Full Name *" />
            <input name="email" onChange={handleChange} className="input" placeholder="Email" />
            <input name="phone" onChange={handleChange} className="input" placeholder="Phone Number *" />
            <input name="address" onChange={handleChange} className="input" placeholder="Address *" />
            <input name="city" onChange={handleChange} className="input" placeholder="City" />
            <input name="zip" onChange={handleChange} className="input" placeholder="ZIP Code" />
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex gap-4 mb-4">
            <img src={getImageUrl(product.image_path)} className="w-32 h-32 object-cover rounded-xl" alt={product.name} />

            <div>
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-xl font-bold mt-2">â‚¹{product.price}</p>

              <div className="flex items-center gap-3 mt-3">
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
                <span className="text-xl">{qty}</span>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-semibold">
            <span>Total:</span>
            <span>â‚¹{(product.price * qty).toFixed(2)}</span>
          </div>

          <button onClick={handlePayment} className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg text-lg mt-6">
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
}


