import React from "react";
import { Filter, Search, RotateCcw, X, Check } from "lucide-react";
import { UniversityFilterState } from "../types/university";

interface UniversityFilterSidebarProps {
  filters: UniversityFilterState;
  onFilterChange: (newFilters: Partial<UniversityFilterState>) => void;
  availableStates: string[];
}

export const UniversityFilterSidebar: React.FC<UniversityFilterSidebarProps> = ({
  filters,
  onFilterChange,
  availableStates,
}) => {
  const hasActiveFilters =
    filters.search !== "" || filters.state !== null || filters.universityType !== null;

  const onReset = () => {
    onFilterChange({
      search: "",
      state: null,
      universityType: null,
    });
  };

  const toggleType = (type: string) => {
    onFilterChange({
      universityType: filters.universityType === type ? null : type,
    });
  };

  const universityTypes = ["Central", "State", "Private", "Deemed"];

  return (
    <aside className="w-full lg:w-72 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6 shrink-0 h-fit sticky top-20">
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
          Course Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="e.g., B.Tech, MBA"
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

      {/* University Type Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          University Type
        </label>
        <div className="flex flex-col gap-2">
          {universityTypes.map((type) => {
            const isSelected = filters.universityType === type;
            return (
              <label
                key={type}
                className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900 select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleType(type)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
                />
                <span>{type} University</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* State Filter */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          State
        </label>
        <select
          value={filters.state || ""}
          onChange={(e) =>
            onFilterChange({ state: e.target.value || null })
          }
          className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all font-medium cursor-pointer"
        >
          <option value="">All States</option>
          {availableStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};

