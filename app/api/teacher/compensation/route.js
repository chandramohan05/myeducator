import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyCoach() {
  const token = cookies().get("auth-token");
  if (!token?.value) return null;

  const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
  if (decoded.role !== "coach") return null;

  return decoded.userId;
}

/* ---------- GET: students with compensation ---------- */
export async function GET() {
  try {
    const coachId = await verifyCoach();
    if (!coachId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1️⃣ compensation attendance
    const { data: attendance } = await supabase
      .from("coach_student_attendance")
      .select("student_id, student_name, date")
      .eq("coach_id", coachId)
      .eq("status", "compensation");

    if (!attendance?.length)
      return NextResponse.json({ data: [] });

    // 2️⃣ scheduled compensations
    const { data: scheduled } = await supabase
      .from("compensation_classes")
      .select("student_id, original_date")
      .eq("coach_id", coachId);

    const scheduledSet = new Set(
      scheduled.map(s => `${s.student_id}-${s.original_date}`)
    );

    // 3️⃣ batch time
    const ids = attendance.map(a => a.student_id);
    const { data: students } = await supabase
      .from("student_list")
      .select("id, batch_time")
      .in("id", ids);

    const batchMap = {};
    students?.forEach(s => (batchMap[s.id] = s.batch_time));

    // 4️⃣ final merge
    const result = attendance.map(a => ({
      ...a,
      batch_time: batchMap[a.student_id] || "-",
      scheduled: scheduledSet.has(`${a.student_id}-${a.date}`),
    }));

    return NextResponse.json({ data: result });
  } catch (e) {
    console.error("compensation GET error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


/* ---------- POST: schedule compensation class ---------- */
export async function POST(req) {
  try {
    const coachId = await verifyCoach();
    if (!coachId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const { error } = await supabase
      .from("compensation_classes")
      .insert({
        student_id: body.student_id,
        coach_id: coachId,
        original_date: body.original_date,
        compensation_date: body.compensation_date,
        batch_time: body.batch_time,
        note: body.note, // gmeet link
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("compensation POST error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
