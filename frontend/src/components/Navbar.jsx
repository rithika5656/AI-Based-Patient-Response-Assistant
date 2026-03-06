import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg font-medium transition ${
      pathname === path
        ? "bg-white text-primary shadow"
        : "text-blue-100 hover:text-white"
    }`;

  return (
    <nav className="bg-primary px-6 py-3 flex items-center justify-between shadow-md">
      <h1 className="text-white text-xl font-bold tracking-tight">
        🩺 Patient Response Assistant
      </h1>
      <div className="flex gap-2">
        <Link to="/" className={linkClass("/")}>
          Patient Chat
        </Link>
        <Link to="/doctor" className={linkClass("/doctor")}>
          Doctor Dashboard
        </Link>
      </div>
    </nav>
  );
}
