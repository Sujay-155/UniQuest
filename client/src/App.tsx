import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Bootcamp } from "./types/bootcamp";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Compare } from "./pages/Compare";
import { Detail } from "./pages/Detail";

export function App() {
  const [selectedForCompare, setSelectedForCompare] = useState<Bootcamp[]>([]);

  const handleToggleCompare = (bootcamp: Bootcamp) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((b) => b.id === bootcamp.id);
      if (exists) {
        return prev.filter((b) => b.id !== bootcamp.id);
      }
      if (prev.length >= 2) {
        // Keep the second one and append the new one
        return [prev[1], bootcamp];
      }
      return [...prev, bootcamp];
    });
  };

  const handleSelectForCompare = (bootcamp: Bootcamp) => {
    setSelectedForCompare((prev) => {
      if (prev.some((b) => b.id === bootcamp.id)) return prev;
      if (prev.length >= 2) return [prev[1], bootcamp];
      return [...prev, bootcamp];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setSelectedForCompare((prev) => prev.filter((b) => b.id !== id));
  };

  const handleClearCompare = () => {
    setSelectedForCompare([]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar
          selectedForCompare={selectedForCompare}
          onClearCompare={handleClearCompare}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  selectedForCompare={selectedForCompare}
                  onToggleCompare={handleToggleCompare}
                  onRemoveCompare={handleRemoveCompare}
                  onClearCompare={handleClearCompare}
                />
              }
            />
            <Route path="/compare" element={<Compare />} />
            <Route
              path="/bootcamp/:id"
              element={<Detail onSelectForCompare={handleSelectForCompare} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">UniQuest</span>
              <span>— Independent Discovery Platform for Private Tech Bootcamps</span>
            </div>
            <p className="text-center sm:text-right max-w-md text-[11px] leading-relaxed">
              Affiliate Disclosure: UniQuest independently evaluates bootcamps. We may earn a commission
              from verified affiliate links at zero additional expense to you.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
