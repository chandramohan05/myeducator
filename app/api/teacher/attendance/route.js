import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  /* Get logged-in user from client auth */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const end = new Date(year, month + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabaseServer
    .from("coach_attendance")
    .select("*")
    .eq("coach_id", user.id)
    .gte("date", start)
    .lte("date", end)
    .order("date");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
