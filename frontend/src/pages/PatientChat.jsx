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
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getPatientQueries(PATIENT_ID);
        const history = [];
        data.reverse().forEach((q) => {
          history.push({ role: "patient", text: q.question });
          if (q.doctor_response) {
            history.push({ role: "doctor", text: q.doctor_response });
          } else if (q.ai_response) {
            history.push({ role: "ai", text: q.ai_response });
          }
        });
        setMessages(history);
      } catch {
        // No history yet — that's fine
      }
    })();
  }, []);

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
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-56px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            👋 Ask any health-related question to get started.
          </p>
        )}
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-gray-400 animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3 flex gap-2">
        <textarea
          rows={1}
          className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your health question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
