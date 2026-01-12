export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import { Readable } from "stream";

const PDFDocument = require("pdfkit/js/pdfkit.standalone");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");

    if (!paymentId) {
      return new Response("Payment ID missing", { status: 400 });
    }

    // 🔹 Payment
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (!payment || payment.status !== "paid") {
      return new Response("Invalid payment", { status: 403 });
    }

    // 🔹 Student
    const { data: student } = await supabase
      .from("student_list")
      .select("name, reg_no, email, course")
      .eq("id", payment.student_id)
      .single();

    if (!student) {
      return new Response("Student not found", { status: 404 });
    }

    // 🔹 Create PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.fontSize(20).text("PAYMENT RECEIPT", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Receipt No : AZR-${payment.id}`);
    doc.text(`Date       : ${payment.date}`);
    doc.moveDown();

    doc.text(`Student    : ${student.name}`);
    doc.text(`Register No: ${student.reg_no}`);
    doc.text(`Course     : ${student.course}`);
    doc.text(`Email      : ${student.email}`);
    doc.moveDown();

    doc.text(`Payment    : ${payment.method}`);
    doc.text(`Amount     : ₹${payment.amount}`);
    doc.moveDown(3);

    doc.fontSize(10).text(
      
    );

    doc.end();

    // 🔹 Convert Node stream → Web stream
    const stream = Readable.from(doc);

    return new Response(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=receipt_${payment.id}.pdf`,
      },
    });
  } catch (err) {
    console.error("Receipt error:", err);
    return new Response("Server error", { status: 500 });
  }
}
