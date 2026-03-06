import React, { useState, useEffect } from "react";
import QueryCard from "../components/QueryCard";
import { getDoctorQueries, reviewQuery } from "../api/axios";

export default function DoctorDashboard() {
  const [queries, setQueries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const doFetch = async () => {
      try {
        const { data } = await getDoctorQueries(filter);
        setQueries(data);
      } catch {
        console.error("Failed to load queries");
      }
    };
    doFetch();
    const interval = setInterval(doFetch, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleSelect = (query) => {
    setSelected(query);
    setEditText(query.doctor_response || query.ai_response || "");
  };

  const handleApprove = async () => {
    if (!selected || !editText.trim()) return;
    setSaving(true);
    try {
      await reviewQuery(selected.id, { doctor_response: editText });
      setSelected(null);
      const { data } = await getDoctorQueries(filter);
      setQueries(data);
    } catch {
      alert("Failed to save response.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 h-[calc(100vh-56px)]">
      {/* Left panel — Query list */}
      <div className="w-1/3 flex flex-col gap-3 overflow-y-auto pr-2">
        <h2 className="text-lg font-bold text-gray-700">Patient Queries</h2>

        {/* Status filter */}
        <div className="flex gap-2 text-xs">
          {["", "pending", "reviewed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full border font-medium transition ${
                filter === s
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-300 hover:border-primary"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>

        {queries.length === 0 && (
          <p className="text-gray-400 text-sm mt-10 text-center">
            No queries found.
          </p>
        )}
        {queries.map((q) => (
          <QueryCard key={q.id} query={q} onSelect={handleSelect} />
        ))}
      </div>

      {/* Right panel — Review & Edit */}
      <div className="flex-1 bg-white border rounded-xl shadow-sm p-6 flex flex-col">
        {!selected ? (
          <p className="text-gray-400 m-auto">
            ← Select a patient query to review
          </p>
        ) : (
          <>
            <div className="mb-4">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Patient: {selected.patient_name}
              </span>
              <h3 className="text-base font-semibold text-gray-800 mt-1">
                {selected.question}
              </h3>
            </div>

            <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
              <span className="block text-[10px] uppercase tracking-wider text-blue-500 mb-1">
                AI-Generated Draft
              </span>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {selected.ai_response || "No AI response available."}
              </p>
            </div>

            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Your Final Response
            </label>
            <textarea
              className="flex-1 border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />

            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={saving || !editText.trim()}
                className="px-5 py-2 rounded-lg text-sm bg-accent hover:bg-emerald-600 text-white font-medium disabled:opacity-50 transition"
              >
                {saving ? "Saving..." : "Approve & Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
