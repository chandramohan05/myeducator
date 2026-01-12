"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function ProfileEditForm({ onSaved, onCancel }) {
  const { data: session, status } = useSession();

  const [loadingRow, setLoadingRow] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [studentRow, setStudentRow] = useState(null);

  const [formData, setFormData] = useState({
    reg_no: "",
    Student_name: "",
    dob: "",
    email: "",
    mobile: "",
    location: "",
    class_type: "",
    group_name: "",
    course: "",
    level: "",
    fide_id: "",
    aicf_id: "",
    state_id_classical: "",
    state_id_rapid: "",
    state_id_blitz: "",
    lichess_id: "",
    chesscom_id: "",
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    async function load() {
      if (status !== "authenticated") return;

      try {
        setLoadingRow(true);

        const email = session?.user?.email;
        if (!email) throw new Error("No email in session");

        const { data, error } = await supabase
          .from("student_list")
          .select(`
            id, reg_no, name, dob, email, phone, place,
            class_type, group_name, course, level,
            fide_id, aicf_id,
            state_id_classical, state_id_rapid, state_id_blitz,
            lichess_id, chesscom_id
          `)
          .eq("email", email)
          .single();

        if (error) throw error;

        setStudentRow(data);

        setFormData({
          reg_no: data.reg_no ?? "",
          Student_name: data.name ?? "",
          dob: data.dob ? String(data.dob).slice(0, 10) : "",
          email: data.email ?? "",
          mobile: data.phone ?? "",
          location: data.place ?? "",
          class_type: data.class_type ?? "",
          group_name: data.group_name ?? "",
          course: data.course ?? "",
          level: data.level ?? "",
          fide_id: data.fide_id ?? "",
          aicf_id: data.aicf_id ?? "",
          state_id_classical: data.state_id_classical ?? "",
          state_id_rapid: data.state_id_rapid ?? "",
          state_id_blitz: data.state_id_blitz ?? "",
          lichess_id: data.lichess_id ?? "",
          chesscom_id: data.chesscom_id ?? "",
        });
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoadingRow(false);
      }
    }

    load();
  }, [session, status]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentRow) return;

    try {
      setSaving(true);

      const payload = {
        reg_no: formData.reg_no ? Number(formData.reg_no) : null,
        name: formData.Student_name,
        dob: formData.dob || null,
        email: formData.email || null,
        phone: formData.mobile || null,
        place: formData.location || null,
        class_type: formData.class_type || null,
        group_name: formData.group_name || null,
        course: formData.course || null,
        level: formData.level || null,
        fide_id: formData.fide_id || null,
        aicf_id: formData.aicf_id || null,
        state_id_classical: formData.state_id_classical || null,
        state_id_rapid: formData.state_id_rapid || null,
        state_id_blitz: formData.state_id_blitz || null,
        lichess_id: formData.lichess_id || null,
        chesscom_id: formData.chesscom_id || null,
      };

      const { data, error } = await supabase
        .from("student_list")
        .update(payload)
        .eq("id", studentRow.id)
        .select()
        .single();

      if (error) throw error;

      setStudentRow(data);
      setSuccess("Profile updated successfully");
      if (onSaved) onSaved(data);
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 2500);
    }
  };

  if (loadingRow) return <p className="text-center p-6">Loading...</p>;

  /* ================= UI ================= */
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-100 border-green-300 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Input name="Student_name" value={formData.Student_name} onChange={handleChange} placeholder="Student Name" required />
          <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <Input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" />
          <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />

          <div className="grid grid-cols-2 gap-3">
            <Input name="fide_id" value={formData.fide_id} onChange={handleChange} placeholder="FIDE ID" />
            <Input name="aicf_id" value={formData.aicf_id} onChange={handleChange} placeholder="AICF ID" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input name="state_id_classical" value={formData.state_id_classical} onChange={handleChange} placeholder="State ID (Classical)" />
            <Input name="state_id_rapid" value={formData.state_id_rapid} onChange={handleChange} placeholder="State ID (Rapid)" />
            <Input name="state_id_blitz" value={formData.state_id_blitz} onChange={handleChange} placeholder="State ID (Blitz)" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input name="lichess_id" value={formData.lichess_id} onChange={handleChange} placeholder="Lichess ID" />
            <Input name="chesscom_id" value={formData.chesscom_id} onChange={handleChange} placeholder="Chess.com ID" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}