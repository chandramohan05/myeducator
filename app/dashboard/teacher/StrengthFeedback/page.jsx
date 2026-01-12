"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function StrengthFeedback() {
  const [students, setStudents] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [form, setForm] = useState({
    student_id: "",
    strength: "",
    weakness: "",
    percentage: 0,
    tactics: 0,
    opening: 0,
    endgames: 0,
    calculation: 0,
    time_management: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(form);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadStudents();
    loadFeedback();
  }, []);

  const loadStudents = async () => {
    const res = await fetch("/api/teacher/progress");
    const j = await res.json();
    setStudents(j.students || []);
  };

  const loadFeedback = async () => {
    const res = await fetch("/api/teacher/strength-feedback");
    const j = await res.json();
    setFeedback(j.data || []);
  };

  const saveFeedback = async () => {
    if (!form.student_id) return alert("Select student");

    const res = await fetch("/api/teacher/strength-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Saved");
      setShowForm(false);
      loadFeedback();
    }
  };

  const saveEdit = async () => {
    const res = await fetch("/api/teacher/strength-feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...editForm }),
    });

    if (res.ok) {
      setEditingId(null);
      loadFeedback();
    }
  };

  const deleteFeedback = async (id) => {
    if (!confirm("Delete this feedback?")) return;

    const res = await fetch("/api/teacher/strength-feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) loadFeedback();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-4">Student Strength & Weakness</h1>

      <Button className="mb-4" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add Feedback"}
      </Button>

      {/* ===== FORM (unchanged) ===== */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Strength Feedback</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-3">
            <select
              className="border p-2 rounded col-span-2"
              value={form.student_id}
              onChange={(e) => setForm({ ...form, student_id: e.target.value })}
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <Input placeholder="Strength" onChange={e => setForm({ ...form, strength: e.target.value })} />
            <Input placeholder="Weakness" onChange={e => setForm({ ...form, weakness: e.target.value })} />
            <Input type="number" placeholder="Overall %" onChange={e => setForm({ ...form, percentage: e.target.value })} />

            <Input type="number" placeholder="Tactics %" onChange={e => setForm({ ...form, tactics: e.target.value })} />
            <Input type="number" placeholder="Opening %" onChange={e => setForm({ ...form, opening: e.target.value })} />
            <Input type="number" placeholder="Endgames %" onChange={e => setForm({ ...form, endgames: e.target.value })} />
            <Input type="number" placeholder="Calculation %" onChange={e => setForm({ ...form, calculation: e.target.value })} />
            <Input type="number" placeholder="Time Mgmt %" onChange={e => setForm({ ...form, time_management: e.target.value })} />

            <Button className="col-span-2" onClick={saveFeedback}>
              Save Feedback
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ===== TABLE ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Weakness</TableHead>
                <TableHead>Overall %</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {feedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : feedback.map(f => (
                <TableRow key={f.id}>
                  <TableCell>{f.student_name}</TableCell>
                  <TableCell>{f.strength}</TableCell>
                  <TableCell>{f.weakness}</TableCell>
                  <TableCell>{f.percentage}%</TableCell>

                  <TableCell className="text-xs">
                    T:{f.tactics} | O:{f.opening} | E:{f.endgames}<br/>
                    C:{f.calculation} | TM:{f.time_management}
                  </TableCell>

                  <TableCell>
                    <Button size="sm" onClick={() => {
                      setEditingId(f.id);
                      setEditForm(f);
                    }}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="ml-2"
                      onClick={() => deleteFeedback(f.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
