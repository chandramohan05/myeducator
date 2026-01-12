import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get("student_id");

  if (!student_id) {
    return NextResponse.json(
      { message: "student_id required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("student_homeworks")
    .select("*")
    .eq("student_id", student_id)
    .order("deadline", { ascending: true });

  if (error) {
    return NextResponse.json(
      { message: "Failed to load homework" },
      { status: 500 }
    );
  }

  return NextResponse.json({ homeworks: data });
}
