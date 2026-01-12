"use client";

import { useEffect, useState } from "react";
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

export default function CoachTournamentPage() {
  const [students, setStudents] = useState([]);
  const [rows, setRows] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [tournament, setTournament] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const res = await fetch("/api/teacher/tournament", {
      credentials: "include",
    });
    const json = await res.json();
    setRows(json.data || []);
  };

  useEffect(() => {
    fetch("/api/teacher/students", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(json => setStudents(json.students || []));

    loadData();
  }, []);

  const submit = async () => {
    if (!studentId || !tournament) {
      alert("Student & tournament required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/teacher/tournament", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: Number(studentId),
        tournament_name: tournament,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Tournament recommended Successfully!");
      setStudentId("");
      setTournament("");
      loadData(); // ✅ refresh table
    } else {
      alert("Failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-10">
      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>Recommend Tournament to Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <select
            className="w-full border p-2 rounded"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Tournament name"
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
          />

          <Button onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </Button>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Tournaments List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Tournament</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No recommendations yet
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.student_list?.name}</TableCell>
                    <TableCell>{r.tournament_name}</TableCell>
                    <TableCell>
                      {new Date(r.created_at).toLocaleDateString()}
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
