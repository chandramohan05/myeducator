import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const role = body.role === "coach" ? "coach" : "student";

    /* ---------------------- STUDENT REGISTER ---------------------- */
    if (role === "student") {
      const {
        name,
        dob = null,
        email,
        phone = null,
        place = null,
        class_type = null,
        course = null,
        level = null,
        password,
      } = body;

      if (!name) return NextResponse.json({ success: false, error: "Name is required" });
      if (!email) return NextResponse.json({ success: false, error: "Email is required" });
      if (!password) return NextResponse.json({ success: false, error: "Password is required" });

      const reg_no = Date.now() % 1000000000;

      const payload = {
        reg_no,
        name,
        dob,
        email,
        phone,
        place,
        class_type,
        group_name: null,
        course,
        level,
        password,
        avatar: null,
        payment: null,
        status: "active",
        fees: null,
        total_score: 0,
        pdf_path: null,
        due_date: null,
        due_note: null,
        created_by: null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("student_list")
        .insert([payload])
        .select("id")
        .single();

      if (error) {
        console.error("SUPABASE STUDENT ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, id: data.id });
    }

    /* ---------------------- COACH REGISTER ----------------------- */
    else {
      const {
        name,
        email,
        phone = null,
        place = null,
        course = null, // becomes specialty
        password,
        bio = null,
        avatar = null,
      } = body;

      if (!name) return NextResponse.json({ success: false, error: "Name is required" });
      if (!email) return NextResponse.json({ success: false, error: "Email is required" });
      if (!password) return NextResponse.json({ success: false, error: "Password is required" });

      const payload = {
        name,
        specialty: course ?? "",
        email,
        phone,
        location: place ?? "",
        password,
        bio,
        avatar,
        created_by: null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("coaches")
        .insert([payload])
        .select("id")
        .single();

      if (error) {
        console.error("SUPABASE COACH ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, id: data.id });
    }
  } catch (err) {
    console.error("REGISTER API ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
