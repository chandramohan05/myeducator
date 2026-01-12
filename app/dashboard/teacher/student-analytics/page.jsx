"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StudentAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/teacher/student-analytics", {
        credentials: "include",
      });
      const json = await res.json();
      setRows(json.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
        </div>
        
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Student Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((s) => (
          <Card key={s.student_id} className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-lg">{s.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {s.stage || "-"} | {s.batch || "-"}
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Homework */}
              <div>
                <p className="text-sm mb-1 font-medium">
                  Homework Completion ({s.homework_pct}%)
                </p>
                <Progress value={s.homework_pct} className="bg-blue-100" />
              </div>

              {/* Attendance */}
              {/* <div>
                <p className="text-sm mb-1 font-medium">
                  Attendance ({s.attendance_pct}%)
                </p>
                <Progress
                  value={s.attendance_pct}
                  className="bg-green-100"
                />
              </div> */}

             {/* Monthly Rating */}
{/* Monthly Rating (Color Based) */}
<div className="bg-gray-50 rounded-lg p-4">
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm font-medium text-gray-700">
      Monthly Rating
    </p>
    <span
      className={`text-sm font-semibold ${
        s.rating_pct >= 75
          ? "text-green-600"
          : s.rating_pct >= 50
          ? "text-yellow-500"
          : "text-red-500"
      }`}
    >
      {s.rating_pct}%
    </span>
  </div>

  <div className="h-24">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={[{ name: "Performance", value: s.rating_pct }]}
      >
        <XAxis hide />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar
          dataKey="value"
          barSize={40}
          radius={[8, 8, 8, 8]}
          fill={
            s.rating_pct >= 75
              ? "#16a34a" // green
              : s.rating_pct >= 50
              ? "#eab308" // yellow
              : "#dc2626" // red
          }
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <p className="text-xs text-gray-500 mt-2 text-center">
    Overall performance this month
  </p>
</div>



              {/* Coach Note */}
              {/* <div>
                <p className="text-sm font-medium">Coach Note</p>
                <p className="text-sm text-gray-600">
                  {s.coach_note || "-"}
                </p>
              </div> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
