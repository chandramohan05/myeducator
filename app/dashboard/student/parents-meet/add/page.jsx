"use client";

import React, { useState } from "react";

export default function AddParentsMeetPage() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Parents Meet Data:", form);

    alert("Parents meet date added successfully!");
    setForm({ date: "", time: "", description: "" });
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-4">Add Parents Meet</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
        >
          Save
        </button>
      </form>
    </div>
  );
}
