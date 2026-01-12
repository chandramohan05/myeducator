// /app/api/enroll/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false }
});

export async function POST(req) {
  try {
    const { email, courseId } = await req.json();

    if (!email || !courseId) {
      return NextResponse.json(
        { success: false, error: "Missing email or courseId" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch course title from the correct table: public.course
    const { data: course, error: courseErr } = await supabase
      .from("course")
      .select("title")
      .eq("id", courseId)
      .single();

    if (courseErr) throw courseErr;

    // 2️⃣ Update student_list -> set course name
    const { data, error } = await supabase
      .from("student_list")
      .update({ course: course.title })
      .eq("email", email)
      .select("id")
      .single();

    if (error) {
      // student not found
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { success: false, error: "Student not found. Please register first." },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      course_name: course.title
    });

  } catch (err) {
    console.error("ENROLL ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
