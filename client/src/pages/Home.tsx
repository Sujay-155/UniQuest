import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, SlidersHorizontal, AlertCircle, Loader2 } from "lucide-react";
import { Bootcamp, FilterState } from "../types/bootcamp";
import { fetchBootcamps } from "../services/api";
import { BootcampCard } from "../components/BootcampCard";
import { FilterSidebar } from "../components/FilterSidebar";
import { FloatingCompareBar } from "../components/FloatingCompareBar";
import { Button } from "../components/ui/Button";

interface HomeProps {
  selectedForCompare: Bootcamp[];
  onToggleCompare: (bootcamp: Bootcamp) => void;
  onRemoveCompare: (id: string) => void;
  onClearCompare: () => void;
}

export const Home: React.FC<HomeProps> = ({
  selectedForCompare,
  onToggleCompare,
  onRemoveCompare,
  onClearCompare,
}) => {
  const navigate = useNavigate();
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    techStack: [],
    placementGuarantee: null,
    isaAvailable: null,
    maxPrice: null,
    sortBy: "rating_desc",
  });

  // Extract all distinct tech stacks for the filter list
  const availableTechStacks = useMemo(() => {
    const set = new Set<string>();
    bootcamps.forEach((b) => {
      b.tech_stack.forEach((tech) => set.add(tech));
    });
    // Fallback default list if bootcamps not loaded yet
    if (set.size === 0) {
      return [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Python",
        "Java",
        "Docker",
        "PostgreSQL",
        "MongoDB",
        "AWS",
        "System Design",
      ];
    }
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
        setError(res.error || "Failed to load bootcamps");
      }
    } catch (err: any) {
      setError(err.message || "Could not connect to the API server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBootcamps();
  }, [
    filters.techStack,
    filters.placementGuarantee,
    filters.isaAvailable,
    filters.maxPrice,
    filters.sortBy,
  ]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      loadBootcamps();
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      techStack: [],
      placementGuarantee: null,
      isaAvailable: null,
      maxPrice: null,
      sortBy: "rating_desc",
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest Discovery & Direct Affiliate Comparisons</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Find the private tech bootcamp that actually gets you hired.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Compare tuition, verified alumni ratings, ISA payback terms, and modern tech stacks
            side-by-side without marketing fluff.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Curriculum Specs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Verified Placement Metrics
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Direct Official Enrolment Links
            </span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      </section>

      {/* Mobile Filter Toggle */}
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
          Showing {bootcamps.length} program{bootcamps.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block w-full lg:w-72`}>
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            availableTechStacks={availableTechStacks}
          />
        </div>

        {/* Bootcamp Grid Area */}
        <main className="flex-1 w-full space-y-4">
          <div className="hidden lg:flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Featured Tech Bootcamps
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Showing {bootcamps.length} program{bootcamps.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
              <p className="text-sm font-medium text-slate-500">Finding matching bootcamps...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              <div>
                <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                  Unable to load bootcamps
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadBootcamps} className="text-xs">
                Retry Connection
              </Button>
            </div>
          )}

          {/* Empty Results State */}
          {!loading && !error && bootcamps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No bootcamps matched your criteria
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your tech stack filters, increasing your max budget, or clearing filters.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleResetFilters} className="text-xs">
                Reset All Filters
              </Button>
            </div>
          )}

          {/* Bootcamp Cards Grid */}
          {!loading && !error && bootcamps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bootcamps.map((bootcamp) => {
                const isSelected = selectedForCompare.some((b) => b.id === bootcamp.id);
                return (
                  <BootcampCard
                    key={bootcamp.id}
                    bootcamp={bootcamp}
                    isSelectedForCompare={isSelected}
                    onToggleCompare={onToggleCompare}
                    onViewDetails={(id) => navigate(`/bootcamp/${id}`)}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Floating Compare Action Bar */}
      <FloatingCompareBar
        selected={selectedForCompare}
        onRemove={onRemoveCompare}
        onClear={onClearCompare}
      />
    </div>
  );
};
