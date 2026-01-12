import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const token = cookies().get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const coachId = Number(decoded.userId);

    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const month = formData.get("month");

    if (!file || !month) {
      return NextResponse.json(
        { error: "Missing file or month" },
        { status: 400 }
      );
    }

    const filePath = `${coachId}/${month}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("study-plans")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("study-plans")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from("coach_study_plans")
      .upsert(
        {
          coach_id: coachId,
          title,
          month,
          file_url: data.publicUrl,
        },
        { onConflict: "coach_id,month" }
      );

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const token = cookies().get("auth-token")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const coachId = Number(decoded.userId);

    const { data, error } = await supabase
      .from("coach_study_plans")
      .select("id, title, month, file_url, created_at")
      .eq("coach_id", coachId)
      .order("month", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
