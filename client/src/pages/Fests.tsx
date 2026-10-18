import React, { useState, useEffect, useMemo } from "react";
import { PartyPopper, SlidersHorizontal, AlertCircle, Loader2 } from "lucide-react";
import { Fest, FestFilterState } from "../types/fest";
import { fetchFests } from "../services/api";
import { FestCard } from "../components/FestCard";
import { FestFilterSidebar } from "../components/FestFilterSidebar";
import { SectionHero } from "../components/ui/SectionHero";
import { Button } from "../components/ui/Button";

export const Fests: React.FC = () => {
  const [fests, setFests] = useState<Fest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FestFilterState>({
    search: "",
    state: null,
    festivalType: null,
  });

  const availableStates = useMemo(() => {
    const set = new Set<string>();
    fests.forEach((f) => {
      if (f.state) set.add(f.state);
    });
    return Array.from(set).sort();
  }, [fests]);

  const loadFests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFests(filters);
      setFests(data);
    } catch (err: any) {
      setError(err.message || "Could not connect to the API server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFests();
  }, [filters.state, filters.festivalType]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadFests();
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const handleFilterChange = (newFilters: Partial<FestFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-8 pb-16">
      <SectionHero
        icon={PartyPopper}
        eyebrow="Cultural, Technical & Sports Fests"
        title="Discover College Fests Across India"
        description="Explore the flagship cultural, technical, and sports festivals hosted by IITs, NITs, and universities nationwide — real listings crawled from public records."
      />

      <div className="lg:hidden flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="gap-2 text-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{mobileFiltersOpen ? "Hide Filters" : "Filter Fests"}</span>
        </Button>
        <span className="text-xs text-slate-500">
          Showing {fests.length} result{fests.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block w-full lg:w-72`}>
          <FestFilterSidebar filters={filters} onFilterChange={handleFilterChange} availableStates={availableStates} />
        </div>

        <main className="flex-1 w-full space-y-4">
          <div className="hidden lg:flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Featured Fests</h2>
            <span className="text-xs font-semibold text-slate-500">
              Showing {fests.length} result{fests.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
              <p className="text-sm font-medium text-slate-500">Finding matching fests...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-600" />
              <div>
                <h3 className="font-bold text-rose-900 text-sm">Unable to load fests</h3>
                <p className="text-xs text-rose-700 mt-1 max-w-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadFests} className="mt-2 bg-white text-rose-700 border-rose-200 hover:bg-rose-100">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && fests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-1">
                <PartyPopper className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">No fests found</h3>
              <p className="text-xs text-slate-500 max-w-sm">Try adjusting your filters to find more results.</p>
            </div>
          )}

          {!loading && !error && fests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fests.map((fest, idx) => (
                <FestCard key={idx} fest={fest} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
