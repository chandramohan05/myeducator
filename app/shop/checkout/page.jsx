"use client";

import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-xl">
      Loading Checkout...
    </div>}>
      <CheckoutClient />
    </Suspense>
  );
}
