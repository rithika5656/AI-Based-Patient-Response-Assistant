import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PatientChat from "./pages/PatientChat";
import DoctorDashboard from "./pages/DoctorDashboard";
import FaceAnalysis from "./pages/FaceAnalysis";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<PatientChat />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/face-analysis" element={<FaceAnalysis />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
