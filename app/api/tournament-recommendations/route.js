import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase client (server-only)
const supabase = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false },
});

export async function GET(request) {
  try {
    // Optional: accept student_id as query param
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");

    let query = supabase
      .from("tournament_recommendations")
      .select(`
        id,
        tournament_name,
        created_at,
        coach_id,
        student_id,
        coaches (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false });

    // If student_id is provided, filter by it
    if (studentId) {
      query = query.eq("student_id", Number(studentId));
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      recommendations: data ?? [],
    });
  } catch (err) {
    console.error("tournament recommendations api error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
