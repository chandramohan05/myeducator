'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function ShopPage() {
  const BUCKET = "product_images";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    setProducts(data);
  }

  function getImageUrl(path) {
    if (!path) return null;
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  return (
    <div className="max-w-6xl mx-auto pt-6 pb-20 px-6">

      {/* Title */}
      <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">
        Azroute Shop
      </h1>

      <p className="text-xl text-gray-600 mb-12 text-center">
        Explore premium learning kits, digital tools, and resources.
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {products.length === 0 ? (
          <p className="text-gray-600 text-center col-span-3">
            No products available
          </p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition"
            >

              {/* Image */}
              {p.image_path ? (
                <img
                  src={getImageUrl(p.image_path)}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  alt={p.name}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              {/* Name */}
              <h3 className="text-2xl font-semibold mb-2">{p.name}</h3>

              {/* Description */}
              <p className="text-gray-600 mb-4">{p.description}</p>

              {/* Price */}
              <p className="text-xl font-bold mb-4">₹{p.price}</p>

              {/* Buy Button → Checkout */}
              <Link href={`/shop/checkout?id=${p.id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full">
                  Buy Now
                </button>
              </Link>

            </div>
          ))
        )}

      </div>
    </div>
  );
}
