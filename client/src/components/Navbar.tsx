import React, { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Scale } from "lucide-react";
import { animate, svg, stagger } from "animejs";
import { Bootcamp } from "../types/bootcamp";
import { Button } from "./ui/Button";

interface NavbarProps {
  selectedForCompare: Bootcamp[];
  onClearCompare: () => void;
}

const navLinks = [
  { to: "/", label: "Universities" },
  { to: "/fests", label: "Fests" },
  { to: "/bootcamps", label: "Bootcamps" },
];

export const Navbar: React.FC<NavbarProps> = ({ selectedForCompare, onClearCompare }) => {
  const navigate = useNavigate();

  const handleCompareClick = () => {
    if (selectedForCompare.length === 2) {
      navigate(`/compare?b1=${selectedForCompare[0].id}&b2=${selectedForCompare[1].id}`);
    }
  };

  // Draw the compass mark in stroke-by-stroke on first load
  useEffect(() => {
    animate(svg.createDrawable(".compass-line"), {
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 900,
      delay: stagger(200),
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #10b981, #047857)" }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle className="compass-line" cx="12" cy="12" r="10" />
              <path
                className="compass-line"
                d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"
              />
            </svg>
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
              Uni<span className="text-slate-600">Quest</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 block -mt-1 tracking-wider uppercase">
              University Intelligence
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-full p-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Compare Button with counter badge */}
        <div className="flex items-center gap-2 shrink-0">
          {selectedForCompare.length > 0 && (
            <>
              <span className="text-xs text-slate-500 hidden md:inline">
                {selectedForCompare.length}/2 selected
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={handleCompareClick}
                disabled={selectedForCompare.length < 2}
                className="gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({selectedForCompare.length})</span>
              </Button>

              <button
                onClick={onClearCompare}
                className="text-xs text-slate-400 hover:text-slate-600 underline px-1"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
