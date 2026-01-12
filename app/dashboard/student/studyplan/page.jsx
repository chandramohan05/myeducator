"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

import {
  FileText,
  CalendarDays,
  UserCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function StudentStudyPlanPage() {
  const { data: session, status } = useSession();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH STUDY PLANS ================= */

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchStudyPlans = async () => {
      setLoading(true);

      // fetch all coach study plans
      const { data, error } = await supabase
        .from("coach_study_plans")
        .select("id, title, month, file_url, coach_id, created_at")
        .order("month", { ascending: false });

      if (error) {
        console.error(error);
        setPlans([]);
      } else {
        setPlans(data || []);
      }

      setLoading(false);
    };

    fetchStudyPlans();
  }, [status]);

  /* ================= UI STATES ================= */

  if (status === "loading" || loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading study plans...
      </p>
    );
  }

  if (plans.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No study plans available.
      </p>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-4">

      <h2 className="text-xl font-semibold mb-6">
        📘 Monthly Study Plans
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.id}
            className="rounded-xl border bg-white shadow-sm hover:shadow-md transition-all"
          >
            {/* HEADER */}
            <CardHeader className="pb-2">
              <span className="inline-block w-fit px-4 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-blue-600">
                Study Plan
              </span>

              <CardTitle className="mt-3 flex items-center gap-2 text-lg font-semibold">
                <FileText className="w-5 h-5 text-indigo-600" />
                {p.title || "Monthly Plan"}
              </CardTitle>
            </CardHeader>

            {/* DETAILS */}
            <CardContent className="space-y-2 text-sm text-gray-700">

              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <span>
                  <b>Month:</b> {p.month || "-"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span>
                  <b>Assigned by Coach</b>
                </span>
              </div>

              <a
                href={p.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 underline font-medium"
              >
                📄 View / Download
              </a>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
