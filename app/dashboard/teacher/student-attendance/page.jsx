"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Input } from "@/app/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ---------- helpers ---------- */
const todayStr = new Date().toISOString().split("T")[0];

const STATUS = [
  { key: "present", label: "P", color: "bg-emerald-500" },
  { key: "absent", label: "A", color: "bg-red-500" },
  { key: "excused", label: "EX", color: "bg-yellow-400" },
  { key: "unexcused", label: "UE", color: "bg-orange-500" },
  { key: "compensation", label: "CC", color: "bg-blue-500" },
];

const STATUS_COLORS = {
  present: "#10b981",
  absent: "#ef4444",
  excused: "#facc15",
  unexcused: "#fb923c",
  compensation: "#3b82f6",
};

const STATUS_LABELS = {
  present: "Present",
  absent: "Absent",
  excused: "Excused",
  unexcused: "Unexcused",
  compensation: "Compensation",
};

export default function StudentAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState(null);
  const [students, setStudents] = useState([]);
  const [todayMap, setTodayMap] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  /* ---------- UI refresh helper ---------- */
  const refreshAfterMark = (studentId, status) => {
    setTodayMap((p) => ({ ...p, [studentId]: status }));
    setAttendance((p) => [
      ...p,
      { student_id: studentId, status, date: todayStr },
    ]);
  };

  /* ---------- LOAD COACH ---------- */
  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data } = await supabase
        .from("coaches")
        .select("id, name")
        .eq("created_by", auth.user.id)
        .single();

      setCoach(data);
    })();
  }, []);

  /* ---------- LOAD STUDENTS + ATTENDANCE ---------- */
  useEffect(() => {
    if (!coach) return;

    (async () => {
      setLoading(true);

      const res = await fetch("/api/teacher/students", {
        credentials: "include",
      });
      const json = await res.json();
      setStudents(json.students || []);

      const start = `${month}-01`;
      const end = new Date(
        new Date(start).getFullYear(),
        new Date(start).getMonth() + 1,
        0
      )
        .toISOString()
        .split("T")[0];

      const { data } = await supabase
        .from("coach_student_attendance")
        .select("student_id, status, date")
        .eq("coach_id", coach.id)
        .gte("date", start)
        .lte("date", end);

      const map = {};
      data?.forEach((r) => {
        if (r.date === todayStr) map[r.student_id] = r.status;
      });

      setTodayMap(map);
      setAttendance(data || []);
      setLoading(false);
    })();
  }, [coach, month]);

  /* ---------- MONTHLY SUMMARY ---------- */
  const summary = useMemo(() => {
    const m = {};
    attendance.forEach((a) => {
      if (!m[a.student_id]) {
        m[a.student_id] = {
          present: 0,
          absent: 0,
          excused: 0,
          unexcused: 0,
          compensation: 0,
        };
      }
      m[a.student_id][a.status]++;
    });
    return m;
  }, [attendance]);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  /* ---------- MARK ATTENDANCE ---------- */
  const markAttendance = async (student, status) => {
    const res = await fetch("/api/teacher/student-attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: student.id,
        student_name: student.name,
        reg_no: student.reg_no,
        date: todayStr,
        status,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Failed");
      return;
    }

    refreshAfterMark(student.id, status);
    alert(`Attendance saved for ${student.name}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Daily Student Attendance
          </CardTitle>
          <p className="text-sm text-gray-500">Date: {todayStr}</p>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reg / ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead className="text-center">Mark</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((s) => {
                const locked = !!todayMap[s.id];
                return (
                  <TableRow key={s.id}>
                    <TableCell>{s.reg_no ?? s.id}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.stage1 || "-"}</TableCell>
                    <TableCell>{s.batch_time || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        {STATUS.map((st) => (
                          <button
                            key={st.key}
                            disabled={locked}
                            onClick={() => markAttendance(s, st.key)}
                            className={`px-2 py-1 rounded text-xs text-white ${st.color}
                              ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MONTHLY SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((s) => {
          const m = summary[s.id] || {};
          const pieData = Object.keys(STATUS_LABELS).map((k) => ({
            name: STATUS_LABELS[k],
            value: m[k] || 0,
            color: STATUS_COLORS[k],
          }));

          return (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={80} label>
                      {pieData.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
