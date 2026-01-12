"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

import {
  CalendarDays,
  Video,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

export default function StudentMeetLinksPage() {
  const { data: session, status } = useSession();

  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ONLY LOGGED-IN STUDENT ================= */

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.user?.email) {
      setMeets([]);
      setLoading(false);
      return;
    }

    const fetchMeets = async () => {
      setLoading(true);

      // 1️⃣ Get student id
      const { data: student, error: studentErr } = await supabase
        .from("student_list")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (studentErr || !student) {
        setMeets([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch compensation classes with meet link
      const { data, error } = await supabase
        .from("compensation_classes")
        .select(`
          id,
          compensation_date,
          meet_link,
          created_at
        `)
        .eq("student_id", student.id)
        .order("compensation_date", { ascending: false });

      setMeets(error ? [] : data || []);
      setLoading(false);
    };

    fetchMeets();
  }, [status, session]);

  /* ================= UI STATES ================= */

  if (status === "loading" || loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading meet links...
      </p>
    );
  }

  if (status !== "authenticated") {
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view meet links.
      </p>
    );
  }

  if (meets.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No meet links found.
      </p>
    );
  }

  /* ================= HANDLER ================= */

  const joinMeet = (link) => {
    const url = link.startsWith("http") ? link : `https://${link}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* ================= UI ================= */

  return (
    <div className="p-4">

      <h2 className="text-xl font-semibold mb-6">
        🎥 Join Your Classes
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meets.map((m) => (
          <Card
            key={m.id}
            className="rounded-xl border bg-white shadow-sm hover:shadow-md transition-all"
          >
            {/* HEADER */}
            <CardHeader className="pb-2">
              <span className="inline-block w-fit px-4 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600">
                Meet
              </span>

              <CardTitle className="mt-3 flex items-center gap-2 text-lg font-semibold">
                <CalendarDays className="w-5 h-5 text-purple-600" />
                {new Date(m.compensation_date).toLocaleDateString("en-GB")}
              </CardTitle>
            </CardHeader>

            {/* DETAILS */}
            <CardContent className="space-y-3 text-sm text-gray-700">

              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <span>
                  <b>Class Date:</b>{" "}
                  {new Date(m.compensation_date).toLocaleDateString("en-GB")}
                </span>
              </div>

              {/* ✅ JOIN MEET BUTTON */}
              {m.meet_link && (
                <button
                  onClick={() => joinMeet(m.meet_link)}
                  className="flex items-center gap-2 mt-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-90 transition"
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
