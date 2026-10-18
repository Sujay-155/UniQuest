import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Fests } from "./pages/Fests";
import { Bootcamps } from "./pages/Bootcamps";
import { Compare } from "./pages/Compare";
import { Detail } from "./pages/Detail";
import { Bootcamp } from "./types/bootcamp";

export function App() {
  const [selectedForCompare, setSelectedForCompare] = useState<Bootcamp[]>([]);

  const onToggleCompare = (bootcamp: Bootcamp) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((b) => b.id === bootcamp.id);
      if (exists) return prev.filter((b) => b.id !== bootcamp.id);
      if (prev.length >= 2) return [prev[1], bootcamp];
      return [...prev, bootcamp];
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
        <Navbar selectedForCompare={selectedForCompare} onClearCompare={() => setSelectedForCompare([])} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fests" element={<Fests />} />
            <Route
              path="/bootcamps"
              element={<Bootcamps selectedForCompare={selectedForCompare} onToggleCompare={onToggleCompare} />}
            />
            <Route path="/bootcamp/:id" element={<Detail onSelectForCompare={onToggleCompare} />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">UniQuest</span>
              <span>— Discovery Platform for Indian Universities</span>
            </div>
            <p className="text-center sm:text-right max-w-md text-[11px] leading-relaxed">
              UniQuest independently evaluates universities and courses to help you find the right future.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
