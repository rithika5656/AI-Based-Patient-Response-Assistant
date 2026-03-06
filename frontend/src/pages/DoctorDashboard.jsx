import React, { useState, useEffect } from "react";
import QueryCard from "../components/QueryCard";
import {
  getDoctorQueries,
  reviewQuery,
  getDepartmentConfig,
  updateDepartmentConfig,
} from "../api/axios";

const DEPARTMENTS = ["General", "Billing", "Scheduling", "Medical Query"];

export default function DoctorDashboard() {
  const [queries, setQueries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [configOpen, setConfigOpen] = useState(false);
  const [department, setDepartment] = useState("General");
  const [deptSaving, setDeptSaving] = useState(false);

  // Fetch current department config on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getDepartmentConfig();
        setDepartment(data.department);
      } catch {
        // default stays General
      }
    })();
  }, []);

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

  const handleDepartmentChange = async (newDept) => {
    setDepartment(newDept);
    setDeptSaving(true);
    try {
      await updateDepartmentConfig(newDept);
    } catch {
      alert("Failed to update department.");
    } finally {
      setDeptSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-5 h-[calc(100vh-64px)]">
      {/* Left panel — Query list + Config */}
      <div className="w-[380px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
        {/* Configuration Panel */}
        <div className="card-dark overflow-hidden">
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold text-white hover:bg-white/[0.03] transition rounded-2xl"
          >
            <span className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Configuration
            </span>
            <svg className={`w-4 h-4 text-navy-400 transition-transform duration-200 ${configOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {configOpen && (
            <div className="px-4 pb-4 border-t border-white/[0.06] animate-fade-in">
              <label className="block text-xs font-semibold text-navy-400 uppercase tracking-wider mt-3 mb-2">
                Response Department
              </label>
              <select
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                disabled={deptSaving}
                className="input-dark w-full"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-navy-500 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Do not include real PHI in web queries.
              </p>
            </div>
          )}
        </div>

        {/* Header + Filter */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Patient Queries</h2>
          <span className="text-xs text-navy-500 font-medium">{queries.length} total</span>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 text-xs">
          {["", "pending", "reviewed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ${
                filter === s
                  ? "bg-accent text-white text-xs shadow-glow"
                  : "bg-navy-900/60 text-navy-400 border border-white/[0.08] hover:border-accent/30 hover:text-white"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>

        {queries.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-16 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-navy-900 border border-white/[0.06] flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-navy-400 text-sm font-medium">No queries found</p>
            <p className="text-navy-600 text-xs">Queries will appear here when patients submit them</p>
          </div>
        )}
        {queries.map((q) => (
          <QueryCard key={q.id} query={q} onSelect={handleSelect} />
        ))}
      </div>

      {/* Right panel — Review & Edit */}
      <div className="flex-1 card-white p-6 flex flex-col animate-fade-in">
        {!selected ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-20 h-20 rounded-3xl bg-navy-50 border border-navy-100 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <p className="text-navy-700 font-semibold text-base">Select a query to review</p>
            <p className="text-navy-400 text-sm mt-1">Choose a patient query from the left panel</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 animate-slide-up">
            {/* Patient info header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-900">{selected.patient_name}</h3>
                  <span className="text-xs text-navy-400">{selected.patient_id}</span>
                </div>
              </div>
              {selected.department && (
                <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-3 py-1 rounded-lg border border-accent-100">
                  {selected.department}
                </span>
              )}
            </div>

            {/* Question */}
            <div className="mb-4 bg-navy-50 rounded-xl p-4 border border-navy-100">
              <span className="block text-[10px] uppercase tracking-wider text-navy-400 font-semibold mb-1.5">
                Patient Question
              </span>
              <p className="text-sm font-medium text-navy-800 leading-relaxed">
                {selected.question}
              </p>
            </div>

            {/* AI Draft */}
            <div className="mb-4 bg-accent-50 rounded-xl p-4 border border-accent-100">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent-600 font-semibold mb-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                AI-Generated Draft
              </span>
              <p className="text-sm text-navy-700 whitespace-pre-wrap leading-relaxed">
                {selected.ai_response || "No AI response available."}
              </p>
            </div>

            {/* Doctor response */}
            <label className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Your Final Response
            </label>
            <textarea
              className="flex-1 input-light resize-none text-sm leading-relaxed"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />

            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2.5 rounded-xl text-sm border border-navy-200 text-navy-600 hover:bg-navy-50 hover:border-navy-300 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={saving || !editText.trim()}
                className="btn-success px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {saving ? "Saving..." : "Approve & Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
