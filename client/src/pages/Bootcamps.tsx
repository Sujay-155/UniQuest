import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, SlidersHorizontal, AlertCircle, Loader2 } from "lucide-react";
import { Bootcamp, FilterState } from "../types/bootcamp";
import { fetchBootcamps } from "../services/api";
import { BootcampCard } from "../components/BootcampCard";
import { FilterSidebar } from "../components/FilterSidebar";
import { SectionHero } from "../components/ui/SectionHero";
import { Button } from "../components/ui/Button";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  techStack: [],
  placementGuarantee: null,
  isaAvailable: null,
  maxPrice: null,
  sortBy: "rating_desc",
};

interface BootcampsProps {
  selectedForCompare: Bootcamp[];
  onToggleCompare: (bootcamp: Bootcamp) => void;
}

export const Bootcamps: React.FC<BootcampsProps> = ({ selectedForCompare, onToggleCompare }) => {
  const navigate = useNavigate();
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const availableTechStacks = useMemo(() => {
    const set = new Set<string>();
    bootcamps.forEach((b) => b.tech_stack.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [bootcamps]);

  const loadBootcamps = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchBootcamps(filters);
      if (res.success) {
        setBootcamps(res.data);
      } else {
        setError(res.error || "Failed to fetch bootcamps");
      }
    } catch (err: any) {
      setError(err.message || "Could not connect to the API server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBootcamps();
  }, [filters.techStack, filters.placementGuarantee, filters.isaAvailable, filters.maxPrice, filters.sortBy]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadBootcamps();
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-8 pb-16">
      <SectionHero
        icon={Rocket}
        eyebrow="Private Tech Bootcamps"
        title="Compare Coding Bootcamps"
        description="Side-by-side tuition, placement guarantees, ISA terms, and tech stacks for India's private coding bootcamps — an alternative track alongside traditional universities."
      />

      <div className="lg:hidden flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="gap-2 text-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{mobileFiltersOpen ? "Hide Filters" : "Filter Bootcamps"}</span>
        </Button>
        <span className="text-xs text-slate-500">
          Showing {bootcamps.length} result{bootcamps.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block w-full lg:w-72`}>
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            availableTechStacks={availableTechStacks}
          />
        </div>

        <main className="flex-1 w-full space-y-4">
          <div className="hidden lg:flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Featured Bootcamps</h2>
            <span className="text-xs font-semibold text-slate-500">
              Showing {bootcamps.length} result{bootcamps.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
              <p className="text-sm font-medium text-slate-500">Finding matching bootcamps...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-600" />
              <div>
                <h3 className="font-bold text-rose-900 text-sm">Unable to load bootcamps</h3>
                <p className="text-xs text-rose-700 mt-1 max-w-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadBootcamps} className="mt-2 bg-white text-rose-700 border-rose-200 hover:bg-rose-100">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && bootcamps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-1">
                <Rocket className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">No bootcamps found</h3>
              <p className="text-xs text-slate-500 max-w-sm">Try adjusting your filters to find more results.</p>
            </div>
          )}

          {!loading && !error && bootcamps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bootcamps.map((bootcamp) => (
                <BootcampCard
                  key={bootcamp.id}
                  bootcamp={bootcamp}
                  isSelectedForCompare={selectedForCompare.some((b) => b.id === bootcamp.id)}
                  onToggleCompare={onToggleCompare}
                  onViewDetails={(id) => navigate(`/bootcamp/${id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
