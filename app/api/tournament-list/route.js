import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/* =========================
   GET – Fetch tournaments
========================= */
export async function GET() {
  const { data, error } = await supabase
    .from("tournament_list")
    .select("*")
    .order("tournament_date", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

/* =========================
   POST – Create tournament
========================= */
export async function POST(req) {
  try {
    const body = await req.json();

    const { student_name, game, score, tournament_date } = body;

    if (!student_name || !game || !score || !tournament_date) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("tournament_list")
      .insert([
        {
          student_name,
          game,
          score,
          tournament_date
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

/* =========================
   PUT – Update tournament
========================= */
export async function PUT(req) {
  try {
    const body = await req.json();

    const { id, student_name, game, score, tournament_date } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Tournament ID required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("tournament_list")
      .update({
        student_name,
        game,
        score,
        tournament_date
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

/* =========================
   DELETE – Remove tournament
========================= */
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Tournament ID required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("tournament_list")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
