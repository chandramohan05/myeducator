import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ classes: [] }, { status: 401 });
  }

  // student details
  const { data: student } = await supabase
    .from("student_list")
    .select("class_type, level")
    .eq("email", session.user.email)
    .single();

  if (!student) return NextResponse.json({ classes: [] });

  const today = new Date().toISOString().split("T")[0];

  const { data: classes } = await supabase
    .from("classlist")
    .select("*")
    .eq("class_type", student.class_type)
    .eq("level", student.level)
    .eq("date", today);

  return NextResponse.json({ classes: classes ?? [] });
}
