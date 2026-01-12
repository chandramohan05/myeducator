// app/terms/page.jsx
import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Terms and Conditions – Azroute Chess Institute
            </CardTitle>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    </div>
  );
}
