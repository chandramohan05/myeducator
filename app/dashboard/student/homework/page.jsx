"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

export default function StudentHomeworksWithUpload() {
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [homeworks, setHomeworks] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [uploadingId, setUploadingId] = useState(null);

  /* ================= FETCH STUDENT + HOMEWORKS + SUBMISSIONS ================= */
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchData = async () => {
      setLoading(true);

      /* ===== STUDENT ===== */
      const { data: student, error: studentErr } = await supabase
        .from("student_list")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (studentErr || !student) {
        setLoading(false);
        return;
      }

      setStudentId(student.id);

      /* ===== HOMEWORKS ===== */
      const { data: hw } = await supabase
        .from("student_homeworks")
        .select("*")
        .eq("student_id", student.id)
        .order("deadline", { ascending: true });

      /* ===== SUBMISSIONS ===== */
      const { data: subs } = await supabase
        .from("student_homework_submissions")
        .select("homework_id, submission_url, status, remarks")
        .eq("student_id", student.id);

      const map = {};
      subs?.forEach((s) => {
        map[s.homework_id] = s;
      });

      setHomeworks(hw || []);
      setSubmissions(map);
      setLoading(false);
    };

    fetchData();
  }, [status, session]);

  /* ================= UPLOAD HANDLER ================= */
  const handleUpload = async (homeworkId, file) => {
    if (!file || !studentId) return;

    try {
      setUploadingId(homeworkId);

      const ext = file.name.split(".").pop();
      const path = `student_${studentId}/homework_${homeworkId}/${Date.now()}.${ext}`;

      /* ===== UPLOAD FILE ===== */
      const { error: uploadError } = await supabase.storage
        .from("homework_submissions")
        .upload(path, file);

      if (uploadError) throw uploadError;

      /* ===== PUBLIC URL ===== */
      const { data } = supabase.storage
        .from("homework_submissions")
        .getPublicUrl(path);

      /* ===== INSERT SUBMISSION (NO REMARK FROM STUDENT) ===== */
      const { error: insertError } = await supabase
        .from("student_homework_submissions")
        .insert({
          homework_id: homeworkId,
          student_id: studentId,
          submission_url: data.publicUrl,
          status: "submitted",
        });

      if (insertError) throw insertError;

      /* ===== UPDATE UI ===== */
      setSubmissions((prev) => ({
        ...prev,
        [homeworkId]: {
          submission_url: data.publicUrl,
          status: "submitted",
          remarks: null,
        },
      }));

      alert("✅ Homework submitted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-6">
        📚 My Homeworks
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Deadline</th>
              <th className="border px-3 py-2">Homework</th>
              <th className="border px-3 py-2">Coach Remark</th>
              <th className="border px-3 py-2">Submission</th>
            </tr>
          </thead>

          <tbody>
            {homeworks.map((hw) => {
              const submitted = submissions[hw.id];

              return (
                <tr key={hw.id} className="hover:bg-gray-50 align-top">
                  {/* TITLE */}
                  <td className="border px-3 py-2 font-medium">
                    {hw.title}
                  </td>

                  {/* DEADLINE */}
                  <td className="border px-3 py-2">
                    {new Date(hw.deadline).toLocaleDateString()}
                  </td>

                  {/* HOMEWORK CONTENT */}
                  <td className="border px-3 py-2">
                    {hw.content_url ? (
                      <a
                        href={hw.content_url}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* REMARK (READ ONLY) */}
                  <td className="border px-3 py-2">
                    {submitted?.remarks ? (
                      <span className="text-gray-700">
                        {submitted.remarks}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        No remarks yet
                      </span>
                    )}
                  </td>

                  {/* UPLOAD */}
                  <td className="border px-3 py-2">
                    {submitted ? (
                      <span className="text-green-600 font-semibold">
                        ✅ Finished
                      </span>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          disabled={uploadingId === hw.id}
                          onChange={(e) =>
                            handleUpload(hw.id, e.target.files[0])
                          }
                        />
                        {uploadingId === hw.id && (
                          <p className="text-xs text-blue-600 mt-1">
                            Uploading...
                          </p>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {homeworks.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  No homeworks assigned
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
