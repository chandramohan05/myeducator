"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

import { CalendarDays, Clock, Video } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";


export default function StudentCompensationPage() {
  const { data: session, status } = useSession();

  const [compensations, setCompensations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ONLY LOGGED-IN STUDENT ================= */

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.user?.email) {
      setCompensations([]);
      setLoading(false);
      return;
    }

    const fetchCompensations = async () => {
      setLoading(true);

      // 1️⃣ Get student id using email
      const { data: student, error: studentErr } = await supabase
        .from("student_list")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (studentErr || !student) {
        setCompensations([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch compensation classes
      const { data, error } = await supabase
        .from("compensation_classes")
        .select(`
          id,
          original_date,
          compensation_date,
          batch_time,
          note
        `)
        .eq("student_id", student.id)
        .order("compensation_date", { ascending: false });

      setCompensations(error ? [] : data || []);
      setLoading(false);
    };

    fetchCompensations();
  }, [status, session]);

  /* ================= UI STATES ================= */

  if (status === "loading" || loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading compensation classes...
      </p>
    );
  }

  if (status !== "authenticated") {
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view compensation classes.
      </p>
    );
  }

  if (compensations.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No compensation classes found.
      </p>
    );
  }

  /* ================= MEET HANDLER ================= */

  const joinMeet = (link) => {
    if (!link) return;
    const url = link.startsWith("http") ? link : `https://${link}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">

      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Video className="w-5 h-5 text-blue-600" />
        Compensation Classes
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {compensations.map((c) => (
          <Card
            key={c.id}
            className="rounded-xl border bg-white shadow-sm hover:shadow-md transition-all"
          >
            {/* HEADER */}
            <CardHeader className="pb-2">
              <span className="inline-block w-fit px-4 py-1 text-xs font-semibold rounded-full text-white bg-blue-600">
                Compensation
              </span>

              <CardTitle className="mt-3 flex items-center gap-2 text-lg font-semibold">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                {formatDate(c.compensation_date)}
              </CardTitle>
            </CardHeader>

            {/* DETAILS */}
            <CardContent className="space-y-3 text-sm text-gray-700">

              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <span>
                  <b>Original Date:</b>{" "}
                  {formatDate(c.original_date)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>
                  <b>Batch Time:</b> {c.batch_time}
                </span>
              </div>

              {/* 🎥 JOIN MEET (note field used as meet link) */}
              {c.note && (
                <button
                  onClick={() => joinMeet(c.note)}
                  className="flex items-center gap-2 mt-2 px-4 py-2 text-xs font-semibold
                             rounded-lg text-white bg-emerald-600
                             hover:bg-emerald-700 transition"
                >
                  <Video className="w-4 h-4" />
                  Join Meet
                </button>
              )}

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}
