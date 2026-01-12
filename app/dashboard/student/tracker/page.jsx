"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

import {
  BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList,
} from "recharts";

export default function StudentCompleteDashboard() {
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [attendanceChart, setAttendanceChart] = useState([]);
  const [homeworkStats, setHomeworkStats] = useState({
    assigned: 0,
    submitted: 0,
    percentage: 0,
  });

  const [strengthData, setStrengthData] = useState(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const load = async () => {
      setLoading(true);

      /* ===== STUDENT ===== */
      const { data: student } = await supabase
        .from("student_list")
        .select("id")
        .eq("email", session.user.email)
        .maybeSingle();

      if (!student) return setLoading(false);

      /* ===== MONTH RANGE ===== */
      const startDate = `${month}-01`;
      const endDate = new Date(
        new Date(startDate).getFullYear(),
        new Date(startDate).getMonth() + 1,
        0
      ).toISOString().slice(0, 10);

      const year = Number(month.split("-")[0]);
      const mon = Number(month.split("-")[1]);
      const totalDays = new Date(year, mon, 0).getDate();

      /* ===== ATTENDANCE ===== */
      const { data: attendance } = await supabase
        .from("coach_student_attendance")
        .select("status")
        .eq("student_id", student.id)
        .gte("date", startDate)
        .lte("date", endDate);

      const counts = {
        present: 0,
        absent: 0,
        excused: 0,
        unexcused: 0,
        compensation: 0,
      };

      attendance?.forEach(a => counts[a.status]++);

      setAttendanceChart([
        { name: "Present", value: Math.round((counts.present / totalDays) * 100) },
        { name: "Absent", value: Math.round((counts.absent / totalDays) * 100) },
        { name: "Excused", value: Math.round((counts.excused / totalDays) * 100) },
        { name: "Unexcused", value: Math.round((counts.unexcused / totalDays) * 100) },
        { name: "Compensation", value: Math.round((counts.compensation / totalDays) * 100) },
      ]);

      /* ===== HOMEWORK ===== */
      const { data: hw } = await supabase
        .from("student_homeworks")
        .select("id")
        .eq("student_id", student.id);

      const { data: sub } = await supabase
        .from("student_homework_submissions")
        .select("homework_id")
        .eq("student_id", student.id);

      setHomeworkStats({
        assigned: hw?.length || 0,
        submitted: sub?.length || 0,
        percentage: hw?.length ? Math.round((sub.length / hw.length) * 100) : 0,
      });

      /* ⭐ ===== STRENGTH & WEAKNESS (RADAR) ===== */
      const { data: sw } = await supabase
        .from("student_strength_feedback")
        .select("tactics, opening, endgames, calculation, time_management, strength, weakness")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sw) {
        setStrengthData({
          text: sw,
          radar: [
            { skill: "Tactics", value: sw.tactics },
            { skill: "Opening", value: sw.opening },
            { skill: "Endgames", value: sw.endgames },
            { skill: "Calculation", value: sw.calculation },
            { skill: "Time Mgmt", value: sw.time_management },
          ],
        });
      } else {
        setStrengthData(null);
      }

      setLoading(false);
    };

    load();
  }, [status, session, month]);

  if (status === "loading" || loading) {
    return <p className="text-center mt-10">Loading dashboard…</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">

      <h1 className="text-2xl font-bold text-center">
        📊 Student Performance Dashboard
      </h1>

      <div className="flex justify-center">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      {/* ATTENDANCE */}
      <Section title="Class Attendance (%)">
        <BarBlock data={attendanceChart} />
      </Section>

      {/* HOMEWORK */}
      <Section title="Home Study Completion">
        <div className="grid grid-cols-3 gap-4 text-center">
          <Box label="Assigned" value={homeworkStats.assigned} />
          <Box label="Submitted" value={homeworkStats.submitted} />
          <Box label="Completion" value={`${homeworkStats.percentage}%`} />
        </div>
      </Section>

      {/* ⭐ STRENGTH & WEAKNESS RADAR */}
      <Section title="Strength & Weakness">
        {strengthData ? (
          <>
            <div className="text-center mb-4">
              <p><b>Strength:</b> {strengthData.text.strength}</p>
              <p><b>Weakness:</b> {strengthData.text.weakness}</p>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={strengthData.radar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
                <Tooltip formatter={(v) => `${v}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <Empty />
        )}
      </Section>

    </div>
  );
}

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const BarBlock = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 100]} />
      <Tooltip formatter={(v) => `${v}%`} />
      <Bar dataKey="value" fill="#2563eb">
        <LabelList dataKey="value" position="top" formatter={(v) => `${v}%`} />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const Box = ({ label, value }) => (
  <div className="bg-gray-100 p-3 rounded">
    {label}<br /><b>{value}</b>
  </div>
);

const Empty = () => (
  <p className="text-sm text-gray-500 text-center py-10">
    No data available for this month
  </p>
);
