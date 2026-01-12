"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

import {
  User,
  Trophy,
  CalendarDays,
  Gamepad2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../components/ui/card";

export default function StudentTournamentPage() {
  const { data: session, status } = useSession();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ONLY LOGGED STUDENT ================= */

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchTournaments = async () => {
      setLoading(true);

      const studentEmail = session.user.email;

      // 🔑 get student name from student_list
      const { data: student } = await supabase
        .from("student_list")
        .select("name")
        .eq("email", studentEmail)
        .single();

      if (!student) {
        setTournaments([]);
        setLoading(false);
        return;
      }

      // 🔑 fetch tournaments ONLY for this student
      const { data } = await supabase
        .from("tournament_list")
        .select("*")
        .eq("student_name", student.name)
        .order("tournament_date", { ascending: false });

      setTournaments(data || []);
      setLoading(false);
    };

    fetchTournaments();
  }, [status, session]);

  /* ================= UI STATES ================= */

  if (status === "loading" || loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading tournaments...
      </p>
    );
  }

  if (tournaments.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No tournament records found.
      </p>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-4">

      <h2 className="text-xl font-semibold mb-6">
        🏆 Tournament Performance
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((t) => (
          <Card
            key={t.id}
            className="rounded-xl border bg-white shadow-sm hover:shadow-md transition-all"
          >
            {/* DARK BADGE + GAME */}
            <CardHeader className="pb-2">
              <span
                className={`inline-block w-fit px-4 py-1 text-xs font-semibold rounded-full text-white
                ${
                  t.tournament_type === "Rapid"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                    : "bg-gradient-to-r from-gray-900 to-gray-700"
                }`}
              >
                {t.tournament_type} 
              </span>

              <CardTitle className="mt-3 flex items-center gap-2 text-lg font-semibold">
                <Gamepad2 className="w-5 h-5 text-indigo-600" />
                {t.game}
              </CardTitle>
            </CardHeader>

            {/* DETAILS */}
            <CardContent className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>
                  <b>Student:</b> {t.student_name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-600" />
                <span>
                  <b>Score:</b>{" "}
                  <span className="font-semibold text-green-700">
                    {t.score}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <span>
                  <b>Date:</b>{" "}
                  {new Date(t.tournament_date).toLocaleDateString()}
                </span>
              </div>
            </CardContent>

            {/* FOOTER */}
           
          </Card>
        ))}
      </div>
    </div>
  );
}
