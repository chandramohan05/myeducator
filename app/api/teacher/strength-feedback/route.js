import { supabase } from "@/lib/supabaseClient";

/* ========= GET ========= */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("student_strength_feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

/* ========= POST ========= */
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      student_id,
      strength,
      weakness,
      percentage,
      tactics,
      opening,
      endgames,
      calculation,
      time_management,
    } = body;

    if (!student_id)
      return Response.json(
        { success: false, error: "Student ID required" },
        { status: 400 }
      );

    const { data: student } = await supabase
      .from("student_list")
      .select("name")
      .eq("id", student_id)
      .single();

    const student_name = student?.name || null;

    const { error } = await supabase
      .from("student_strength_feedback")
      .insert([
        {
          student_id,
          student_name,
          strength,
          weakness,
          percentage,
          tactics,
          opening,
          endgames,
          calculation,
          time_management,
        },
      ]);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

/* ========= PATCH ========= */
export async function PATCH(req) {
  try {
    const body = await req.json();

    const {
      id,
      strength,
      weakness,
      percentage,
      tactics,
      opening,
      endgames,
      calculation,
      time_management,
    } = body;

    if (!id)
      return Response.json(
        { success: false, error: "ID required" },
        { status: 400 }
      );

    const { error } = await supabase
      .from("student_strength_feedback")
      .update({
        strength,
        weakness,
        percentage,
        tactics,
        opening,
        endgames,
        calculation,
        time_management,
        updated_at: new Date(),
      })
      .eq("id", id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

/* ========= DELETE ========= */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id)
      return Response.json(
        { success: false, error: "ID required" },
        { status: 400 }
      );

    const { error } = await supabase
      .from("student_strength_feedback")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
