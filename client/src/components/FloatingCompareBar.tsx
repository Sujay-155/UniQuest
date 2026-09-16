import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale, X, ArrowRight } from "lucide-react";
import { Bootcamp } from "../types/bootcamp";
import { Button } from "./ui/Button";

interface FloatingCompareBarProps {
  selected: Bootcamp[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const FloatingCompareBar: React.FC<FloatingCompareBarProps> = ({
  selected,
  onRemove,
  onClear,
}) => {
  const navigate = useNavigate();

  if (selected.length === 0) return null;

  const canCompare = selected.length === 2;

  const handleCompare = () => {
    if (canCompare) {
      navigate(`/compare?b1=${selected[0].id}&b2=${selected[1].id}`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl bg-slate-900 text-white rounded-2xl p-3 px-5 shadow-2xl border border-slate-700/60 flex items-center justify-between gap-4 backdrop-blur-lg"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {selected.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-1.5 bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700 shrink-0"
              >
                <span className="font-semibold">{b.provider}</span>
                <span className="text-slate-400 truncate max-w-[120px]">{b.name}</span>
                <button
                  onClick={() => onRemove(b.id)}
                  className="text-slate-400 hover:text-rose-400 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {selected.length === 1 && (
              <span className="text-xs text-slate-400 italic shrink-0">
                + Select 1 more to compare
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            Clear
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCompare}
            disabled={!canCompare}
            className="gap-1.5 text-xs font-bold whitespace-nowrap shadow-glow"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
