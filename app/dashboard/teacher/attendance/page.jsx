"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

/* Helpers */
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const formatDate = (date) => date.toISOString().split("T")[0];

export default function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveMode, setLeaveMode] = useState(false);

  const [coachId, setCoachId] = useState(null);
  const [coachName, setCoachName] = useState("");

  const today = new Date();
  const todayStr = formatDate(today);

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const emptySlots = Array(firstDay).fill(null);

  const days = Array.from({ length: daysInMonth }, (_, i) =>
    formatDate(new Date(year, month, i + 1))
  );

  /* LOAD COACH */
  useEffect(() => {
    const loadCoach = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data } = await supabase
        .from("coaches")
        .select("id, name")
        .eq("created_by", auth.user.id)
        .single();

      if (data) {
        setCoachId(data.id);
        setCoachName(data.name);
      }
    };

    loadCoach();
  }, []);

  /* LOAD ATTENDANCE */
  useEffect(() => {
    if (!coachId) return;

    const loadAttendance = async () => {
      const start = formatDate(new Date(year, month, 1));
      const end = formatDate(new Date(year, month + 1, 0));

      const { data } = await supabase
        .from("coach_attendance")
        .select("date, status, leave_status")
        .eq("coach_id", coachId)
        .gte("date", start)
        .lte("date", end);

      const map = {};
      data?.forEach(row => (map[row.date] = row));
      setAttendance(map);
    };

    loadAttendance();
  }, [coachId, month, year]);

  const markAttendance = async (status) => {
    if (!selectedDate || !coachId) return;

    setLoading(true);

    await supabase.from("coach_attendance").upsert({
      coach_id: coachId,
      coach_name: coachName,
      date: selectedDate,
      status,
      leave_reason: status === "leave" ? leaveReason : null,
      leave_status: status === "leave" ? "pending" : null,
    });

    setAttendance(prev => ({
      ...prev,
      [selectedDate]: {
        status,
        leave_status: status === "leave" ? "pending" : null,
      },
    }));

    setLeaveMode(false);
    setLeaveReason("");
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const selectedAttendance = selectedDate
    ? attendance[selectedDate]
    : null;

  /* 📊 MONTHLY CALCULATION */
  const totalDays = daysInMonth;

  const presentCount = Object.values(attendance).filter(a => a.status === "present").length;
  const absentCount = Object.values(attendance).filter(a => a.status === "absent").length;
  const leaveCount = Object.values(attendance).filter(a => a.status === "leave").length;

  const notMarkedCount =
    totalDays - (presentCount + absentCount + leaveCount);

  const presentPercent = Math.round((presentCount / totalDays) * 100);
  const absentPercent = Math.round((absentCount / totalDays) * 100);
  const leavePercent = Math.round((leaveCount / totalDays) * 100);
  const notMarkedPercent = Math.round((notMarkedCount / totalDays) * 100);

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold">Attendance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CALENDAR */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between flex-row">
            <Button size="icon" variant="ghost" onClick={() => setMonth(m => m - 1)}>
              <ChevronLeft />
            </Button>
            <CardTitle>{monthNames[month]} {year}</CardTitle>
            <Button size="icon" variant="ghost" onClick={() => setMonth(m => m + 1)}>
              <ChevronRight />
            </Button>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
              {weekDays.map(d => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {emptySlots.map((_, i) => <div key={i} />)}

              {days.map(date => {
                const row = attendance[date];
                let color = "bg-gray-100";

                if (row?.status === "present") color = "bg-emerald-500 text-white";
                if (row?.status === "absent") color = "bg-red-500 text-white";
                if (row?.status === "leave") {
                  color =
                    row.leave_status === "approved"
                      ? "bg-yellow-400"
                      : "bg-yellow-200 border border-dashed";
                }

                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setLeaveMode(false);
                      setLeaveReason("");
                    }}
                    className={`h-9 rounded-md text-xs font-medium ${color}`}
                  >
                    {date.split("-")[2]}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ACTION CARD – FIXED */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {selectedDate && (
              <>
                <p className="text-sm font-medium">{selectedDate}</p>

                {selectedAttendance ? (
                  <div className="text-sm font-semibold">
                    {selectedAttendance.status === "present" && (
                      <span className="text-emerald-600">✔ Already marked as Present</span>
                    )}
                    {selectedAttendance.status === "absent" && (
                      <span className="text-red-600">✖ Already marked as Absent</span>
                    )}
                    {selectedAttendance.status === "leave" && (
                      <span className="text-yellow-700">
                        ⏳ Leave submitted ({selectedAttendance.leave_status})
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Button onClick={() => markAttendance("present")}>Present</Button>
                      <Button variant="destructive" onClick={() => markAttendance("absent")}>
                        Absent
                      </Button>
                      <Button variant="outline" onClick={() => setLeaveMode(true)}>
                        Leave
                      </Button>
                    </div>

                    {leaveMode && (
                      <>
                        <textarea
                          value={leaveReason}
                          onChange={e => setLeaveReason(e.target.value)}
                          placeholder="Leave reason"
                          className="w-full border rounded-md p-2 text-sm"
                        />
                        <Button disabled={!leaveReason} onClick={() => markAttendance("leave")}>
                          Submit Leave
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 📊 MONTHLY ATTENDANCE GRAPH */}
      <Card>
        <CardHeader>
          <CardTitle>
            Monthly Attendance Graph ({monthNames[month]})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {[
            { label: "Present", count: presentCount, percent: presentPercent, color: "bg-emerald-500" },
            { label: "Absent", count: absentCount, percent: absentPercent, color: "bg-red-500" },
            // { label: "Leave", count: leaveCount, percent: leavePercent, color: "bg-yellow-400" },
            // { label: "Not Marked", count: notMarkedCount, percent: notMarkedPercent, color: "bg-gray-400" },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm">
                <span>{item.label} ({item.count})</span>
                <span>{item.percent}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded">
                <div
                  className={`h-3 ${item.color} rounded`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
