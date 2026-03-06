import React from "react";

const avatars = {
  patient: (
    <div className="w-8 h-8 rounded-full bg-white border border-navy-200 flex items-center justify-center flex-shrink-0 shadow-sm">
      <svg className="w-4 h-4 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  ),
  ai: (
    <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  ),
  doctor: (
    <div className="w-8 h-8 rounded-full bg-success-50 border border-success-400/30 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
  ),
};

const labels = {
  patient: "You",
  ai: "AI Assistant",
  doctor: "Doctor",
};

export default function ChatMessage({ role, text }) {
  const isPatient = role === "patient";

  return (
    <div className={`flex gap-2.5 ${isPatient ? "flex-row-reverse" : "flex-row"} mb-4 animate-slide-up`}>
      {avatars[role]}
      <div
        className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isPatient
            ? "bg-white text-navy-800 rounded-2xl rounded-tr-md shadow-card border border-navy-100"
            : role === "doctor"
            ? "bg-success-50 text-navy-800 border border-success-400/20 rounded-2xl rounded-tl-md"
            : "card-dark text-white/90 rounded-2xl rounded-tl-md"
        }`}
      >
        <span className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${
          isPatient ? "text-navy-400" : role === "doctor" ? "text-success-600" : "text-accent"
        }`}>
          {labels[role]}
        </span>
        {text}
      </div>
    </div>
  );
}
