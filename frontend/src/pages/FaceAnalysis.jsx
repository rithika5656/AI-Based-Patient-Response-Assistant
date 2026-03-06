import React, { useState, useRef, useCallback } from "react";

export default function FaceAnalysis() {
  const [cameraActive, setCameraActive] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 480 },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setCaptured(null);
      setResults(null);
    } catch {
      alert("Camera access denied. Please allow camera permission.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCaptured(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const runAnalysis = useCallback(() => {
    setAnalyzing(true);
    // Simulated AI analysis for prototype
    setTimeout(() => {
      // Randomized AI analysis for prototype
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const score = (min, max) => {
        const s = rand(min, max);
        if (s >= 80) return { score: s, status: "Normal", color: "text-success" };
        if (s >= 60) return { score: s, status: "Mild", color: "text-warning-500" };
        return { score: s, status: "Concern", color: "text-red-400" };
      };

      const indicators = [
        { name: "Eye Redness", ...score(55, 98) },
        { name: "Dark Circles", ...score(40, 95) },
        { name: "Skin Pallor", ...score(60, 99) },
        { name: "Facial Swelling", ...score(70, 99) },
        { name: "Fatigue Signs", ...score(35, 95) },
      ];

      const avg = Math.round(indicators.reduce((a, i) => a + i.score, 0) / indicators.length);
      const mildCount = indicators.filter((i) => i.status === "Mild").length;
      const concernCount = indicators.filter((i) => i.status === "Concern").length;

      let overall, suggestion;
      if (concernCount >= 2) {
        overall = "Needs Attention";
        suggestion = "Multiple health indicators show concern. Please consult a healthcare professional for a thorough check-up. Stay hydrated, rest well, and avoid strain.";
      } else if (mildCount >= 2 || concernCount === 1) {
        overall = "Fair";
        suggestion = "Some mild indicators detected — possible fatigue or stress. Ensure 7-8 hours of sleep, balanced diet, and hydration. Consult a doctor if symptoms persist.";
      } else {
        overall = "Normal";
        suggestion = "Your facial health indicators look good! Maintain a healthy routine — proper sleep, hydration, and regular check-ups. No immediate concerns detected.";
      }

      setResults({ overall, confidence: avg, indicators, suggestion });
      setAnalyzing(false);
    }, 2500);
  }, []);

  const reset = useCallback(() => {
    setCaptured(null);
    setResults(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2" />
            <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
            <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth={1.5} />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">AI Visual Health Analysis</h1>
        <p className="text-navy-400 text-sm max-w-md mx-auto">
          Capture your face to get a quick AI-powered preliminary health screening.
          This is a prototype — not a medical diagnosis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left — Camera / Captured Image */}
        <div className="card-dark p-5 flex flex-col items-center animate-slide-up">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3" strokeWidth={2} />
            </svg>
            Face Capture
          </h2>

          {/* View area */}
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-navy-950 border border-white/[0.06] flex items-center justify-center relative mb-4">
            {!cameraActive && !captured && (
              <div className="flex flex-col items-center gap-3 text-center px-6">
                {/* Face scan icon */}
                <svg className="w-20 h-20 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2" />
                  <circle cx="12" cy="12" r="4" strokeWidth={1} />
                  <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth={1} />
                </svg>
                <p className="text-navy-500 text-xs">Click below to activate camera</p>
              </div>
            )}
            {cameraActive && (
              <>
                <video
                  ref={(el) => {
                    videoRef.current = el;
                    if (el && streamRef.current) {
                      el.srcObject = streamRef.current;
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Scan overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent/60 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent/60 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/60 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent/60 rounded-br-lg" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-accent/30 rounded-full" />
                </div>
              </>
            )}
            {captured && (
              <img src={captured} alt="Captured" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            {!cameraActive && !captured && (
              <button onClick={startCamera} className="btn-primary px-5 py-2.5 text-sm w-full flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <circle cx="12" cy="13" r="3" strokeWidth={2} />
                </svg>
                Open Camera
              </button>
            )}
            {cameraActive && (
              <>
                <button onClick={capturePhoto} className="btn-primary px-5 py-2.5 text-sm flex-1 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <circle cx="12" cy="12" r="4" strokeWidth={2} />
                  </svg>
                  Capture
                </button>
                <button onClick={stopCamera} className="btn-ghost px-5 py-2.5 text-sm">
                  Cancel
                </button>
              </>
            )}
            {captured && !results && (
              <>
                <button
                  onClick={runAnalysis}
                  disabled={analyzing}
                  className="btn-primary px-5 py-2.5 text-sm flex-1 flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {analyzing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2" />
                        <circle cx="12" cy="12" r="4" strokeWidth={2} />
                        <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth={2} />
                      </svg>
                      Analyze Face
                    </>
                  )}
                </button>
                <button onClick={reset} className="btn-ghost px-5 py-2.5 text-sm">
                  Retake
                </button>
              </>
            )}
            {results && (
              <button onClick={reset} className="btn-primary px-5 py-2.5 text-sm w-full flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Scan
              </button>
            )}
          </div>
        </div>

        {/* Right — Results */}
        <div className="card-dark p-5 flex flex-col animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Analysis Report
          </h2>

          {!results && !analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-white/[0.06] flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-navy-400 text-sm font-medium">No analysis yet</p>
              <p className="text-navy-600 text-xs mt-1">Capture and analyze a photo to see results</p>
            </div>
          )}

          {analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full border-2 border-accent/20 border-t-accent animate-spin mb-4" />
              <p className="text-white text-sm font-medium">Analyzing facial features...</p>
              <p className="text-navy-500 text-xs mt-1">Detecting health indicators</p>
            </div>
          )}

          {results && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Overall Score */}
              <div className="bg-navy-950/60 rounded-xl p-4 border border-white/[0.06] text-center">
                <p className="text-[10px] uppercase tracking-wider text-navy-500 font-semibold mb-1">Overall Health</p>
                <p className="text-3xl font-bold text-white">{results.confidence}%</p>
                <span className={`text-xs font-semibold px-3 py-0.5 rounded-full mt-1 inline-block ${
                  results.overall === "Normal"
                    ? "text-success bg-success-50/10 border border-success/20"
                    : results.overall === "Fair"
                    ? "text-warning-500 bg-warning-50/10 border border-warning-400/20"
                    : "text-red-400 bg-red-500/10 border border-red-400/20"
                }`}>
                  {results.overall}
                </span>
              </div>

              {/* Indicators */}
              <div className="space-y-2">
                {results.indicators.map((ind) => (
                  <div key={ind.name} className="flex items-center justify-between bg-navy-950/40 rounded-lg px-3 py-2.5 border border-white/[0.04]">
                    <span className="text-xs text-navy-300 font-medium">{ind.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${ind.score >= 80 ? "bg-success" : "bg-warning-400"}`}
                          style={{ width: `${ind.score}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${ind.color}`}>
                        {ind.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestion */}
              <div className="bg-accent/5 border border-accent/15 rounded-xl p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-accent font-semibold mb-1.5 flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  AI Insight
                </p>
                <p className="text-xs text-navy-300 leading-relaxed">{results.suggestion}</p>
              </div>

              <p className="text-[9px] text-navy-600 text-center mt-1">
                * Prototype simulation — Not a medical diagnosis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
