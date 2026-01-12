// app/api/teacher/attendance/mark/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  // ✅ FIXED ROLE CHECK
  if (
    !session ||
    !["teacher", "coach"].includes(session.user.role)
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { date, status } = await req.json();

  if (!date || !status) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  const coachId = session.user.id;

  const { data: existing } = await supabaseServer
    .from("coach_attendance")
    .select("status")
    .eq("coach_id", coachId)
    .eq("date", date)
    .maybeSingle();

  if (existing && ["present", "absent"].includes(existing.status)) {
    return NextResponse.json(
      { error: "Attendance already marked" },
      { status: 409 }
    );
  }

  const { error } = await supabaseServer
    .from("coach_attendance")
    .upsert({
      coach_id: coachId,
      date,
      status,
      leave_reason: null,
      leave_status: null,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
