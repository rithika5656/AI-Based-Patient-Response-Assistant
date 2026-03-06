import React from "react";

export default function ChatMessage({ role, text }) {
  const isPatient = role === "patient";

  return (
    <div className={`flex ${isPatient ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isPatient
            ? "bg-primary text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
        }`}
      >
        <span className="block text-[10px] uppercase tracking-wider mb-1 opacity-60">
          {isPatient ? "You" : role === "ai" ? "AI Draft" : "Doctor"}
        </span>
        {text}
      </div>
    </div>
  );
}
