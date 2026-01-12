import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Fetch only the "type" column
    const { data, error } = await supabase
      .from("student_events")
      .select("type")
      .not("type", "is", null);

    if (error) {
      console.error("Error loading event types:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Extract unique non-empty types
    const uniqueTypes = [...new Set(
      data
        .map(item => item.type?.trim())
        .filter(Boolean) // remove null/empty
    )];

    return NextResponse.json({ types: uniqueTypes });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
