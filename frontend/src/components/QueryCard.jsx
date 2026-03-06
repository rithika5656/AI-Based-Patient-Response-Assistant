import React from "react";

const statusConfig = {
  pending: {
    bg: "bg-warning-50",
    text: "text-warning-500",
    dot: "bg-warning-400",
    border: "border-warning-400/30",
  },
  reviewed: {
    bg: "bg-success-50",
    text: "text-success-500",
    dot: "bg-success-400",
    border: "border-success-400/30",
  },
  delivered: {
    bg: "bg-accent-50",
    text: "text-accent-500",
    dot: "bg-accent-400",
    border: "border-accent/30",
  },
};

export default function QueryCard({ query, onSelect }) {
  const status = statusConfig[query.status] || statusConfig.pending;

  return (
    <div
      onClick={() => onSelect(query)}
      className="group card-dark p-4 hover:border-accent/20 hover:shadow-glow transition-all duration-200 cursor-pointer animate-fade-in"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-navy-800 border border-white/[0.06] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-semibold text-white block leading-tight">
              {query.patient_name}
            </span>
            <span className="text-[10px] text-navy-500">{query.patient_id}</span>
          </div>
        </div>
        <span
          className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.bg} ${status.text} ${status.border} border`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {query.status}
        </span>
      </div>

      <p className="text-sm text-navy-300 line-clamp-2 leading-relaxed group-hover:text-white transition-colors">
        {query.question}
      </p>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
        <span className="text-[11px] text-navy-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(query.created_at).toLocaleString()}
        </span>
        {query.department && (
          <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
            {query.department}
          </span>
        )}
      </div>
    </div>
  );
}
