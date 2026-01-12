// app/api/teachers/[id]/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(_request, { params }) {
  try {
    const coachId = parseInt(params.id, 10);
    if (Number.isNaN(coachId)) {
      return NextResponse.json(
        { error: "Invalid coach id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("coaches")
      .select("id, name, specialty, email, phone, location, avatar, bio")
      .eq("id", coachId)
      .single();

    if (error) {
      console.error("Supabase error (coach by id):", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch coach details" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Coach not found" },
        { status: 404 }
      );
    }

    // Shape it similar to the list + extra optional fields
    const formatted = {
      id: data.id,
      name: data.name,
      department: data.specialty,
      email: data.email,
      phoneNumber: data.phone,
      location: data.location,
      profileImage: data.avatar,
      bio: data.bio,
      qualification: null,
      experience: null,
      subjectsToTeach: [],
      stats: {
        totalStudents: 0,
        activeCourses: 0,
        completionRate: 0,
      },
    };

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("API /api/teachers/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch coach details" },
      { status: 500 }
    );
  }
}
