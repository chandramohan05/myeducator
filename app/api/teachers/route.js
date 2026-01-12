// app/api/teachers/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("coaches")
      .select("id, name, specialty, email, phone, location, avatar, bio")
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase error (coaches):", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch coaches" },
        { status: 500 }
      );
    }

    // Format result to match "teacher-like" structure
    const formatted = (data || []).map((coach) => ({
      id: coach.id,
      name: coach.name,
      department: coach.specialty,
      email: coach.email,
      phoneNumber: coach.phone,
      profileImage: coach.avatar,
      bio: coach.bio,
      location: coach.location,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("API /api/teachers error:", err);
    return NextResponse.json(
      { error: err.message || "Server error fetching coaches" },
      { status: 500 }
    );
  }
}
