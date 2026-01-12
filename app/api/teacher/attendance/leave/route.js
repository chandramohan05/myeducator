import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  const { date, reason } = await req.json();

  if (!date || !reason) {
    return NextResponse.json(
      { error: "Date & reason required" },
      { status: 400 }
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseServer.from("coach_attendance").upsert({
    coach_id: user.id,
    date,
    status: "leave",
    leave_reason: reason,
    leave_status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
