import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Scale, Sparkles } from "lucide-react";
import { Bootcamp } from "../types/bootcamp";
import { Button } from "./ui/Button";

interface NavbarProps {
  selectedForCompare: Bootcamp[];
  onClearCompare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedForCompare,
  onClearCompare,
}) => {
  const navigate = useNavigate();

  const handleCompareClick = () => {
    if (selectedForCompare.length === 2) {
      navigate(`/compare?b1=${selectedForCompare[0].id}&b2=${selectedForCompare[1].id}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Uni<span className="text-emerald-600 dark:text-emerald-400">Quest</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 block -mt-1 tracking-wider uppercase">
              Bootcamp Intelligence
            </span>
          </div>
        </Link>

        {/* Center / Right controls */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors hidden sm:block"
          >
            Discover Bootcamps
          </Link>

          {/* Compare Button with counter badge */}
          {selectedForCompare.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">
                {selectedForCompare.length}/2 selected
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={handleCompareClick}
                disabled={selectedForCompare.length < 2}
                className="gap-1.5 text-xs font-semibold"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({selectedForCompare.length})</span>
              </Button>

              <button
                onClick={onClearCompare}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline px-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
