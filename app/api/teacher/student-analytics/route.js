import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  if (!token?.value) return null;

  const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
  if (decoded.role !== "coach") return null;

  const { data: coach } = await supabase
    .from("coaches")
    .select("id, name")
    .eq("id", decoded.userId)
    .single();

  return coach;
}

export async function GET() {
  try {
    const coach = await verifyAuth();
    if (!coach) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 🗓️ Month range */
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    /* 1️⃣ Coach courses */
    const { data: courses } = await supabase
      .from("course")
      .select("title")
      .or(`coach_id_int.eq.${coach.id},coach_name.ilike.%${coach.name}%`);

    if (!courses?.length) {
      return NextResponse.json({ data: [] });
    }

    const courseTitles = courses.map(c => c.title);

    /* 2️⃣ Students */
    const orCondition = courseTitles
      .map(t => `course.ilike.%${t}%`)
      .join(",");

    const { data: students } = await supabase
      .from("student_list")
      .select("id, name, stage1, batch_time")
      .or(orCondition);

    if (!students?.length) {
      return NextResponse.json({ data: [] });
    }

    const studentIds = students.map(s => s.id);

    /* 3️⃣ Homework */
    const { data: hwTotal } = await supabase
      .from("student_homeworks")
      .select("student_id")
      .in("student_id", studentIds);

    const { data: hwSubmitted } = await supabase
      .from("student_homework_submissions")
      .select("student_id")
      .in("student_id", studentIds)
      .neq("status", "pending");

    /* 4️⃣ Attendance (FIXED) */
    const { data: attendance } = await supabase
      .from("coach_student_attendance")
      .select("student_id, status")
      .eq("coach_id", coach.id)
      .gte("date", monthStart.toISOString())
      .lte("date", monthEnd.toISOString());

    /* 5️⃣ Progress */
    const { data: progress } = await supabase
      .from("student_progress")
      .select("student_id, progress_percentage, notes")
      .eq("coach_id", coach.id);

    /* 6️⃣ Build response */
    const result = students.map(s => {
      const totalHw =
        hwTotal?.filter(h => h.student_id === s.id).length || 0;

      const submittedHw =
        hwSubmitted?.filter(h => h.student_id === s.id).length || 0;

      const att =
        attendance?.filter(a => a.student_id === s.id) || [];

      const presentDays =
        att.filter(a =>
          ["present", "compensation"].includes(
            a.status?.toLowerCase().trim()
          )
        ).length || 0;

      const attendance_pct = att.length
        ? Math.round((presentDays / att.length) * 100)
        : 0;

      const prog = progress?.find(p => p.student_id === s.id);

      return {
        student_id: s.id,
        name: s.name,
        stage: s.stage1,
        batch: s.batch_time,
        homework_pct: totalHw
          ? Math.round((submittedHw / totalHw) * 100)
          : 0,
        attendance_pct,
        rating_pct: prog?.progress_percentage || 0,
        coach_note: prog?.notes || "-"
      };
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("student-analytics error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
