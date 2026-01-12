import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

async function verifyCoach() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token");
  if (!token) return null;

  const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
  if (decoded.role !== "coach") return null;

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("id", decoded.userId)
    .single();

  return coach;
}

export async function GET() {
  try {
    const coach = await verifyCoach();
    if (!coach)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("coach_library")
      .select("id, file_url, created_at")
      .eq("coach_id", coach.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load library" }, { status: 500 });
  }
}
