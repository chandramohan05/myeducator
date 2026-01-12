"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/components/ui/table";

export default function CoachStudyPlanPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  const fetchPlans = async () => {
    const res = await fetch("/api/teacher/studyplan");
    const json = await res.json();
    setPlans(json.data || []);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleUpload = async () => {
    if (!file || !month) {
      alert("File and month required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("month", month);

    const res = await fetch("/api/teacher/studyplan", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      alert("Study plan uploaded successfully");
      setFile(null);
      setTitle("");
      setMonth("");
      fetchPlans();
    } else {
      const json = await res.json();
      alert(json.error || "Upload failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Monthly Study Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Study Plan Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload Study Plan"}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Uploaded Study Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Uploaded On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No study plans uploaded
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.title || "-"}</TableCell>
                    <TableCell>{p.month}</TableCell>
                    <TableCell>
                      <a
                        href={p.file_url}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(p.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
