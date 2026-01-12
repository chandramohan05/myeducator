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

export async function POST(req) {
  try {
    const coachId = await verifyCoach();
    if (!coachId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const { error, data } = await supabase
      .from("coach_student_attendance")
      .upsert(
        {
          coach_id: coachId,
          coach_name: body.coach_name,
          student_id: body.student_id,
          student_name: body.student_name,
          reg_no: body.reg_no,
          date: body.date,
          status: body.status,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "coach_id,student_id,date",
        }
      )
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
