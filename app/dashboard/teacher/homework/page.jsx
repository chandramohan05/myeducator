"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/app/components/ui/select";
import { Loader2 } from "lucide-react";

const CONTENT_TYPES = [
  { value: "puzzle", label: "Puzzle" },
  { value: "video", label: "Video Link" },
  { value: "pgn", label: "PGN File" },
  { value: "pdf", label: "PDF Document" },
  { value: "image", label: "Image / Screenshot" },
  { value: "link", label: "External Link" },
];

export default function TeacherHomeworkPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coachId, setCoachId] = useState(null);
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [file, setFile] = useState(null);
  const [deadline, setDeadline] = useState("");

  /* LOAD COACH + STUDENTS */
  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data: coach } = await supabase
        .from("coaches")
        .select("id")
        .eq("created_by", auth.user.id)
        .single();

      setCoachId(coach.id);

      const res = await fetch("/api/teacher/students", {
        credentials: "include",
      });
      const json = await res.json();
      setStudents(json.students || []);

      setLoading(false);
    })();
  }, []);

  /* FILE UPLOAD */
  const uploadFile = async () => {
    if (!file) return null;

    const filePath = `homework/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("homework-files")
      .upload(filePath, file);

    if (error) {
      alert("File upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("homework-files")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  /* SUBMIT */
  const submitHomework = async () => {
    if (!studentId || !title || !contentType || !deadline) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    let finalUrl = contentUrl;

    if (contentType === "pdf" || contentType === "image") {
      finalUrl = await uploadFile();
      if (!finalUrl) {
        setSubmitting(false);
        return;
      }
    }

    const res = await fetch("/api/teacher/homeworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coach_id: coachId,
        student_id: Number(studentId),
        title,
        description,
        content_type: contentType,
        content_url: finalUrl,
        deadline,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.message);
      setSubmitting(false);
      return;
    }

    alert("Homework assigned successfully");

    setStudentId("");
    setTitle("");
    setDescription("");
    setContentType("");
    setContentUrl("");
    setFile(null);
    setDeadline("");
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Assign Homework
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <label className="text-sm font-medium">Student</label>
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="text-sm font-medium">Homework Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="text-sm font-medium">Content Type</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(contentType === "pdf" || contentType === "image") ? (
            <>
              <label className="text-sm font-medium">Upload File</label>
              <Input
                type="file"
                accept={contentType === "pdf" ? ".pdf" : "image/*"}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </>
          ) : (
            <>
              <label className="text-sm font-medium">Content URL</label>
              <Input
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
              />
            </>
          )}

          <label className="text-sm font-medium">Deadline</label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <Button
            onClick={submitHomework}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Assigning..." : "Assign Homework"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
