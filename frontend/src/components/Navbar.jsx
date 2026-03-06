import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      pathname === path
        ? "bg-accent text-white shadow-glow"
        : "text-navy-300 hover:text-white hover:bg-white/[0.06]"
    }`;

  return (
    <nav className="bg-navy-900 border-b border-white/[0.06] px-6 py-3 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-3.5">
        {/* Logo mark */}
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-white text-lg font-bold tracking-tight leading-tight">
            Patient Response Assistant
          </h1>
          <p className="text-navy-500 text-[10px] font-semibold tracking-widest uppercase">
            AI-Powered Healthcare
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-navy-950/60 border border-white/[0.06] rounded-2xl p-1">
        <Link to="/" className={linkClass("/")}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Patient Chat
          </span>
        </Link>
        <Link to="/doctor" className={linkClass("/doctor")}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Doctor Dashboard
          </span>
        </Link>
        <Link to="/face-analysis" className={linkClass("/face-analysis")}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2" />
              <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
              <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth={1.8} />
            </svg>
            Face Analysis
          </span>
        </Link>
      </div>
    </nav>
  );
}
