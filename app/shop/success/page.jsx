"use client";

import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-xl">
      Loading...
    </div>}>
      <SuccessClient />
    </Suspense>
  );
}
