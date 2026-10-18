import React from "react";
import { Filter, X, RotateCcw, Search, Check } from "lucide-react";
import { FilterState } from "../types/bootcamp";
import { Button } from "./ui/Button";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  availableTechStacks: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableTechStacks,
}) => {
  const toggleTech = (tech: string) => {
    const exists = filters.techStack.includes(tech);
    const updated = exists
      ? filters.techStack.filter((t) => t !== tech)
      : [...filters.techStack, tech];
    onFilterChange({ techStack: updated });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.techStack.length > 0 ||
    filters.placementGuarantee !== null ||
    filters.isaAvailable !== null ||
    filters.maxPrice !== null;

  return (
    <aside className="w-full lg:w-72 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6 shrink-0 h-fit sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-900" />
          <h2 className="font-bold text-slate-900 text-base">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="e.g., Scaler, Full Stack, DevOps"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all placeholder:text-slate-400"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tech Stack Multi-select */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tech Stack
          </label>
          {filters.techStack.length > 0 && (
            <span className="text-[11px] font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
              {filters.techStack.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {availableTechStacks.map((tech) => {
            const isSelected = filters.techStack.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all flex items-center gap-1 ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{tech}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial & Outcome Filters */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Outcomes & Terms
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900 select-none">
          <input
            type="checkbox"
            checked={filters.placementGuarantee === true}
            onChange={(e) =>
              onFilterChange({
                placementGuarantee: e.target.checked ? true : null,
              })
            }
            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
          />
          <span>100% Placement Guarantee</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900 select-none">
          <input
            type="checkbox"
            checked={filters.isaAvailable === true}
            onChange={(e) =>
              onFilterChange({
                isaAvailable: e.target.checked ? true : null,
              })
            }
            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
          />
          <span>Income Share Agreement (ISA)</span>
        </label>
      </div>

      {/* Max Price Range */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-slate-500">
            Max Budget
          </span>
          <span className="font-bold text-slate-900">
            {filters.maxPrice ? `₹${(filters.maxPrice / 1000).toFixed(0)}k` : "Any"}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="300000"
          step="5000"
          value={filters.maxPrice || 300000}
          onChange={(e) => {
            const val = Number(e.target.value);
            onFilterChange({ maxPrice: val >= 300000 ? null : val });
          }}
          className="w-full accent-slate-900 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>₹5k</span>
          <span>₹1.5L</span>
          <span>₹3L+</span>
        </div>
      </div>

      {/* Sort Option */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({ sortBy: e.target.value as FilterState["sortBy"] })
          }
          className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all font-medium cursor-pointer"
        >
          <option value="rating_desc">Highest Alumni Rating</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
};
