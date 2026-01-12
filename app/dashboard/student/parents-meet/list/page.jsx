"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ParentsMeetListPage() {
  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeets();
  }, []);

  const fetchMeets = async () => {
    const { data, error } = await supabase
      .from("parents_meets")
      .select("*")
      .order("meet_date", { ascending: true });

    if (!error) setMeets(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Parents Meet List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : meets.length === 0 ? (
        <p className="text-gray-500">No parents meet found.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {meets.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-3">{m.meet_date}</td>
                  <td className="p-3">{m.meet_time}</td>
                  <td className="p-3">{m.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
