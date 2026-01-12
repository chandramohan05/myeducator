import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("coach_study_plans")
      .select("id, title, month, file_url, created_at")
      .order("month", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ studyPlans: [] }, { status: 500 });
    }

    return NextResponse.json({
      studyPlans: data ?? [],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ studyPlans: [] }, { status: 500 });
  }
}
