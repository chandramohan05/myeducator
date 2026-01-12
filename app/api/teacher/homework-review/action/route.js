import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { submission_id, status, remarks } = await req.json();

    if (!submission_id || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("student_homework_submissions")
      .update({
        status,           // approved | rejected
        remarks,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", submission_id);

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update review" },
      { status: 500 }
    );
  }
}
