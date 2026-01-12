import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getCoach() {
  const token = cookies().get("auth-token")?.value;
  if (!token) return null;
  return jwt.verify(token, process.env.JWT_SECRET);
}

/* INSERT */
export async function POST(req) {
  const coach = await getCoach();
  if (!coach)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { student_id, tournament_name } = await req.json();

  const { error } = await supabase
    .from("tournament_recommendations")
    .insert({
      coach_id: coach.userId,
      student_id,
      tournament_name,
    });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}

/* FETCH */
export async function GET() {
  const coach = await getCoach();
  if (!coach)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("tournament_recommendations")
    .select(`
      id,
      tournament_name,
      created_at,
      student_list ( name )
    `)
    .eq("coach_id", coach.userId)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data });
}
