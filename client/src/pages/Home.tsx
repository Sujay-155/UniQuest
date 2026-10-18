import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { animate, utils, createLayout, stagger } from "animejs";
import {
  Sparkles,
  SlidersHorizontal,
  AlertCircle,
  Loader2,
  ArrowDown,
  MapPin,
  Landmark,
  ShieldCheck,
  LayoutGrid,
  Rows3,
} from "lucide-react";
import { University, UniversityFilterState } from "../types/university";
import { fetchUniversities } from "../services/api";
import { UniversityCard } from "../components/UniversityCard";
import { UniversityFilterSidebar } from "../components/UniversityFilterSidebar";
import { Button } from "../components/ui/Button";

const trustPoints = [
  { icon: MapPin, label: "28+ states covered" },
  { icon: Landmark, label: "Central, State & Private" },
  { icon: ShieldCheck, label: "Verified admission links" },
];

export const Home: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [cardLayout, setCardLayout] = useState<"grid" | "compact">("grid");
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const cardsLayoutRef = useRef<ReturnType<typeof createLayout> | null>(null);

  const [filters, setFilters] = useState<UniversityFilterState>({
    search: "",
    state: null,
    universityType: null,
  });

  const availableStates = useMemo(() => {
    const set = new Set<string>();
    universities.forEach((u) => {
      if (u.state) set.add(u.state);
    });
    if (set.size === 0) {
      return ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Gujarat"];
    }
    return Array.from(set).sort();
  }, [universities]);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUniversities(filters);
      setUniversities(data);
    } catch (err: any) {
      setError(err.message || "Could not connect to the API server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, [filters.state, filters.universityType]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadUniversities();
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const handleFilterChange = (newFilters: Partial<UniversityFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Breathing emerald glow behind the hero CTA, driven by anime.js CSS custom properties
  useEffect(() => {
    utils.set(".aurora-cta", { "--glow-scale": 0.8, "--glow-opacity": 0.45 });
    animate(".aurora-cta", {
      "--glow-scale": [0.8, 1.25, 0.8],
      "--glow-opacity": [0.45, 0.75, 0.45],
      duration: 3400,
      ease: "inOutSine",
      loop: true,
    });
  }, []);

  // Track the results grid so toggling density reflows the cards with a FLIP animation
  useEffect(() => {
    if (cardsGridRef.current) {
      cardsLayoutRef.current = createLayout(cardsGridRef.current);
    }
  }, []);

  const handleCardLayoutChange = (mode: "grid" | "compact") => {
    if (mode === cardLayout) return;
    const el = cardsGridRef.current;
    const layout = cardsLayoutRef.current;
    if (!el || !layout) {
      setCardLayout(mode);
      return;
    }
    layout.update(
      () => {
        el.dataset.layout = mode;
      },
      { duration: 500, delay: stagger(25), ease: "inOutQuad" }
    );
    setCardLayout(mode);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-[#07110d] min-h-[560px] sm:min-h-[600px] flex flex-col justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)]">
        {/* Aurora glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="aurora-blob-1 absolute -top-32 -left-20 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.35)_0%,transparent_70%)] blur-3xl" />
          <div className="aurora-blob-2 absolute -bottom-40 right-[-10%] w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle,rgba(4,120,87,0.4)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15)_0%,transparent_35%,transparent_65%,rgba(0,0,0,0.35)_100%)]" />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-end px-6 sm:px-12 pt-[14vh] pb-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 self-start rounded-full pl-1.5 pr-4 py-1.5 bg-white/[0.06] border border-white/15 backdrop-blur-sm w-fit"
          >
            <div className="flex">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-[#07110d]"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #047857)",
                    marginLeft: i === 0 ? 0 : "-8px",
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-white/70">
              Honest discovery, <strong className="text-white font-semibold">trusted by students across India</strong>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-5 max-w-2xl text-[2.2rem] sm:text-6xl font-medium tracking-tight leading-[1.08] text-[#f7f5f0]"
          >
            Find the University<br />That's Right for You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-white/60"
          >
            Compare courses, university types, deadlines, and official admission portals — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
            className="mt-7 flex items-center gap-3.5"
          >
            <motion.a
              href="#universities"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="aurora-cta inline-flex items-center rounded-full bg-[#f7f5f0] text-[#07110d] px-6 py-3.5 text-sm font-semibold shadow-lg shadow-black/20"
            >
              Explore Universities
            </motion.a>
            <motion.a
              href="#universities"
              aria-label="Scroll to universities"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5 px-6 sm:px-12 pb-6">
          {trustPoints.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/70"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="lg:hidden flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="gap-2 text-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{mobileFiltersOpen ? "Hide Filters" : "Filter Universities"}</span>
        </Button>
        <span className="text-xs text-slate-500">
          Showing {universities.length} result{universities.length === 1 ? "" : "s"}
        </span>
      </div>

      <div id="universities" className="flex flex-col lg:flex-row gap-8 items-start scroll-mt-24">
        <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block w-full lg:w-72`}>
          <UniversityFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            availableStates={availableStates}
          />
        </div>

        <main className="flex-1 w-full space-y-4">
          <div className="hidden lg:flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Featured Universities
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Showing {universities.length} result{universities.length === 1 ? "" : "s"}
              </span>
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  onClick={() => handleCardLayoutChange("grid")}
                  aria-label="Comfortable grid view"
                  className={`p-1.5 rounded-md transition-colors ${
                    cardLayout === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCardLayoutChange("compact")}
                  aria-label="Compact grid view"
                  className={`p-1.5 rounded-md transition-colors ${
                    cardLayout === "compact" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Rows3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
              <p className="text-sm font-medium text-slate-500">Finding matching universities...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-600" />
              <div>
                <h3 className="font-bold text-rose-900 text-sm">Unable to load universities</h3>
                <p className="text-xs text-rose-700 mt-1 max-w-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadUniversities} className="mt-2 bg-white text-rose-700 border-rose-200 hover:bg-rose-100">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && universities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-1">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">No universities found</h3>
              <p className="text-xs text-slate-500 max-w-sm">Try adjusting your filters to find more results.</p>
            </div>
          )}

          {!loading && !error && universities.length > 0 && (
            <div ref={cardsGridRef} data-layout={cardLayout} className="uq-cards-grid">
              {universities.map((uni, idx) => (
                <UniversityCard key={idx} university={uni} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
