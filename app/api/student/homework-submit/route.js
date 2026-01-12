import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      homework_id,
      student_id,
      submission_url,
      remarks,
    } = body;

    if (!homework_id || !student_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("student_homework_submissions")
      .upsert({
        homework_id,
        student_id,
        submission_url,
        remarks,
        submitted_at: new Date(),
        status: "submitted",
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Submission failed" },
      { status: 500 }
    );
  }
}
