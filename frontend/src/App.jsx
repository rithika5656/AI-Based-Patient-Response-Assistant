import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PatientChat from "./pages/PatientChat";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<PatientChat />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
