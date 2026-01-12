import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

/* ================= GET: Student Compensation Classes ================= */

export async function GET() {
  try {
    /* 1️⃣ Check login session */
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* 2️⃣ Get student ID using email */
    const { data: student, error: studentErr } = await supabase
      .from("student_list")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (studentErr || !student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    /* 3️⃣ Fetch compensation classes for this student */
    const { data, error } = await supabase
      .from("compensation_classes")
      .select("*")
      .eq("student_id", student.id)
      .order("compensation_date", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch compensation classes" },
        { status: 500 }
      );
    }

    /* 4️⃣ Success response */
    return NextResponse.json({
      success: true,
      student_id: student.id,
      data: data || [],
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
