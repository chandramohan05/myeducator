"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/components/ui/table";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function CompensationClassesPage() {
  const [rows, setRows] = useState([]);
  const [dateMap, setDateMap] = useState({});
  const [linkMap, setLinkMap] = useState({});
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const res = await fetch("/api/teacher/compensation", {
  credentials: "include",
});

    const json = await res.json();
    setRows(json.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const schedule = async (row) => {
    const compensation_date = dateMap[row.student_id];
    const link = linkMap[row.student_id];

    if (!compensation_date || !link) {
      alert("Date and Google Meet link required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/teacher/compensation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: row.student_id,
        original_date: row.date,
        compensation_date,
        batch_time: row.batch_time,
        note: link,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to schedule class");
      return;
    }

    alert("Compensation class scheduled");
    loadData();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Compensation Classes
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Missed Date</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Compensation Date</TableHead>
                <TableHead>GMeet Link</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No compensation pending
                  </TableCell>
                </TableRow>
              )}

              {rows.map((r) => (
                <TableRow key={`${r.student_id}-${r.date}`}>
                  <TableCell>{r.student_name}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.batch_time}</TableCell>

                  <TableCell>
                    <Input
                      type="date"
                      value={dateMap[r.student_id] || ""}
                      onChange={(e) =>
                        setDateMap((p) => ({
                          ...p,
                          [r.student_id]: e.target.value,
                        }))
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      placeholder="Google Meet link"
                      value={linkMap[r.student_id] || ""}
                      onChange={(e) =>
                        setLinkMap((p) => ({
                          ...p,
                          [r.student_id]: e.target.value,
                        }))
                      }
                    />
                  </TableCell>

                  <TableCell>
                  <Button onClick={() => schedule(r)} disabled={loading || r.scheduled}>
  {r.scheduled ? "Scheduled" : "Schedule"}
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
