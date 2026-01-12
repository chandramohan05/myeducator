import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const coach_id = Number(searchParams.get("coach_id"));

    if (!coach_id) {
      return NextResponse.json(
        { message: "coach_id required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("student_homeworks")
      .select(`
        id,
        title,
        deadline,
        content_type,
        created_at,
        student:student_id (
          id,
          name,
          stage1,
          batch_time
        ),
        submissions:student_homework_submissions (
          id,
          status,
          submitted_at,
          submission_url,
          remarks
        )
      `)
      .eq("coach_id", coach_id)
      .order("deadline", { ascending: true });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Failed to load review data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
