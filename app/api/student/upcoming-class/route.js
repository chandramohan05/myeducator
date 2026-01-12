import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email } = await req.json();

    const { data: student } = await supabase
      .from("student_list")
      .select("id")
      .eq("email", email)
      .single();

    if (!student) {
      return NextResponse.json({ class: null });
    }

    const today = new Date().toISOString().slice(0, 10);

    const { data } = await supabase
      .from("classlist")
      .select("id, class_name, level, date, time, meet_link, coach, status")
      .eq("date", today)
      .eq("status", "scheduled")
      .order("time", { ascending: true })
      .limit(1);

    return NextResponse.json({
      class: data?.length ? data[0] : null,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ class: null });
  }
}
