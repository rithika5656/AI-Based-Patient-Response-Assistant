import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import { submitPatientQuery, getPatientQueries } from "../api/axios";

const PATIENT_ID = "patient-001"; // In production this comes from auth

export default function PatientChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Load past conversations on mount
  // Fresh chat on every page load (prototype mode)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "patient", text: question }]);
    setLoading(true);

    try {
      const { data } = await submitPatientQuery({
        patient_id: PATIENT_ID,
        patient_name: "John Doe",
        question,
      });
      if (data.ai_response) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: data.ai_response },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-64px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-navy-900 border border-white/[0.08] flex items-center justify-center mb-6 shadow-dark">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-navy-400 text-sm text-center max-w-sm leading-relaxed">
              Ask any health-related question and our AI will provide a helpful draft.
              A qualified doctor will review before sending the final response.
            </p>
            <div className="flex gap-2 mt-6 flex-wrap justify-center">
              {["What are common flu symptoms?", "How to manage stress?", "When should I see a doctor?"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-xs px-3.5 py-2 rounded-full border border-white/10 text-navy-300 bg-navy-900/50 hover:bg-navy-800 hover:text-white hover:border-accent/30 transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} />
        ))}
        {loading && (
          <div className="flex gap-2.5 mb-4 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="card-dark px-4 py-3 rounded-2xl rounded-tl-md">
              <span className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-accent">AI Assistant</span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-navy-900/60 backdrop-blur-md px-4 py-4 flex gap-3">
        <textarea
          rows={1}
          className="flex-1 resize-none input-dark"
          placeholder="Type your health question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="btn-primary px-5 py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send
        </button>
      </div>
    </div>
  );
}
