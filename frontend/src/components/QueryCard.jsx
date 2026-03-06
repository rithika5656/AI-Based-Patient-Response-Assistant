import React from "react";

export default function QueryCard({ query, onSelect }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-green-100 text-green-800",
    delivered: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      onClick={() => onSelect(query)}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500">
          {query.patient_name} &middot; {query.patient_id}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            statusColors[query.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {query.status.toUpperCase()}
        </span>
      </div>
      <p className="text-sm text-gray-800 line-clamp-2">{query.question}</p>
      <p className="text-[11px] text-gray-400 mt-2">
        {new Date(query.created_at).toLocaleString()}
      </p>
    </div>
  );
}
