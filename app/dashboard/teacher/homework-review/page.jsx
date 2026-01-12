"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function HomeworkReviewPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [remarks, setRemarks] = useState({});

  /* LOAD HOMEWORK REVIEW DATA */
  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data: coach } = await supabase
        .from("coaches")
        .select("id")
        .eq("created_by", auth.user.id)
        .single();

      const res = await fetch(
        `/api/teacher/homework-review?coach_id=${coach.id}`
      );
      const json = await res.json();

      setRows(json.data || []);
      setLoading(false);
    })();
  }, []);

  /* STATUS BADGE */
  const getStatus = (hw) => {
    const sub = hw.submissions?.[0];

    if (sub?.status === "approved")
      return { text: "Approved", color: "bg-green-600" };

    if (sub?.status === "rejected")
      return { text: "Rejected", color: "bg-red-600" };

    if (sub) return { text: "Submitted", color: "bg-blue-500" };

    if (new Date(hw.deadline) < new Date())
      return { text: "Late", color: "bg-red-500" };

    return { text: "Pending", color: "bg-yellow-500" };
  };

  /* SUBMIT REVIEW */
  const submitReview = async (submissionId, status) => {
    const res = await fetch("/api/teacher/homework-review/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission_id: submissionId,
        status,
        remarks: remarks[submissionId] || "",
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.message || "Failed to submit review");
      return;
    }

    alert("Review saved successfully");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Homework Review</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submission / Review</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500">
                No homework assigned
              </TableCell>
            </TableRow>
          )}

          {rows.map((hw) => {
            const status = getStatus(hw);
            const submission = hw.submissions?.[0];

            return (
              <TableRow key={hw.id}>
                <TableCell>{hw.student?.name}</TableCell>
                <TableCell>{hw.student?.stage1 || "-"}</TableCell>
                <TableCell>{hw.student?.batch_time || "-"}</TableCell>
                <TableCell>{hw.title}</TableCell>
                <TableCell className="capitalize">
                  {hw.content_type}
                </TableCell>
                <TableCell>{hw.deadline}</TableCell>
                <TableCell>
                  <Badge className={status.color}>{status.text}</Badge>
                </TableCell>

                <TableCell className="space-y-2">
                 {submission ? (
  <>
    <a
      href={submission.submission_url}
      target="_blank"
      className="text-blue-600 underline block mb-1"
    >
      View Submission
    </a>

    {/* SHOW BUTTONS ONLY IF PENDING */}
    {submission.status === "pending" && (
      <>
        <Textarea
          placeholder="Add review remarks"
          value={remarks[submission.id] || ""}
          onChange={(e) =>
            setRemarks({
              ...remarks,
              [submission.id]: e.target.value,
            })
          }
        />

        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={() =>
              submitReview(submission.id, "approved")
            }
          >
            Approve
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              submitReview(submission.id, "rejected")
            }
          >
            Reject
          </Button>
        </div>
      </>
    )}

    {/* AFTER REVIEW */}
    {submission.status !== "pending" && (
      <Badge
        className={
          submission.status === "approved"
            ? "bg-green-600"
            : "bg-red-600"
        }
      >
        {submission.status.toUpperCase()}
      </Badge>
    )}
  </>
) : (
  <span className="text-gray-500">Not yet submitted</span>
)}

                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
