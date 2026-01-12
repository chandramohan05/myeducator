import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {

    let email = null;

    try {
      const body = await req.json();
      email = body?.email ?? null;
    } catch {
      email = null;
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }


    // Get student
    const { data: student, error: studentError } = await supabase
      .from("student_list")
      .select("id")
      .eq("email", email)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Get latest payment ONLY
    const { data: latestPayment } = await supabase
      .from("payments")
      .select("status, due_date, balance_fee")
      .eq("student_id", student.id)
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (!latestPayment) {
      return NextResponse.json({
        paid: false,
        due_date: null,
      });
    }

    const isPaid =
      latestPayment.status?.toLowerCase() === "paid" &&
      Number(latestPayment.balance_fee ?? 0) === 0;

    return NextResponse.json({
      paid: isPaid,
      status: latestPayment.status,
      due_date: latestPayment.due_date,
    });

  } catch (err) {
    console.error("Payment API ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
