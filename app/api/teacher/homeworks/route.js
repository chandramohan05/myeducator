import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const {
      coach_id,
      student_id,
      title,
      description,
      content_type,
      content_url,
      deadline,
    } = await req.json();

    const { error } = await supabase
      .from("student_homeworks")
      .insert({
        coach_id: Number(coach_id),
        student_id: Number(student_id),
        title,
        description,
        content_type,
        content_url,
        deadline,
      });

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to assign homework" },
      { status: 500 }
    );
  }
}
