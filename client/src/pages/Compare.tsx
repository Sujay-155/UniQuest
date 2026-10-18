import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Scale, AlertCircle, Loader2, ArrowLeft, ArrowRightLeft } from "lucide-react";
import { Bootcamp, ComparisonResponse } from "../types/bootcamp";
import { compareBootcamps, fetchBootcamps } from "../services/api";
import { ComparisonTable } from "../components/ComparisonTable";
import { Button } from "../components/ui/Button";

export const Compare: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const b1Id = searchParams.get("b1") || "";
  const b2Id = searchParams.get("b2") || "";

  const [allBootcamps, setAllBootcamps] = useState<Bootcamp[]>([]);
  const [selectedB1, setSelectedB1] = useState<string>(b1Id);
  const [selectedB2, setSelectedB2] = useState<string>(b2Id);
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load all bootcamps to populate selectors
  useEffect(() => {
    fetchBootcamps()
      .then((res) => {
        if (res.success && res.data.length >= 2) {
          setAllBootcamps(res.data);
          if (!b1Id && !b2Id) {
            setSelectedB1(res.data[0].id);
            setSelectedB2(res.data[1].id);
            setSearchParams({ b1: res.data[0].id, b2: res.data[1].id });
          } else if (b1Id && !b2Id) {
            const alternate = res.data.find((b) => b.id !== b1Id) || res.data[1];
            setSelectedB2(alternate.id);
            setSearchParams({ b1: b1Id, b2: alternate.id });
          }
        }
      })
      .catch((err) => console.error("Error fetching bootcamps list", err));
  }, []);

  // Fetch comparison whenever b1 or b2 query parameters change
  useEffect(() => {
    if (b1Id && b2Id) {
      setSelectedB1(b1Id);
      setSelectedB2(b2Id);
      setLoading(true);
      setError(null);

      compareBootcamps(b1Id, b2Id)
        .then((data) => {
          if (data.success) {
            setComparisonData(data);
          } else {
            setError(data.error || "Failed to compare bootcamps");
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch comparison metrics");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [b1Id, b2Id]);

  const handleApplySelection = () => {
    if (selectedB1 && selectedB2) {
      setSearchParams({ b1: selectedB1, b2: selectedB2 });
    }
  };

  const handleSwap = () => {
    setSearchParams({ b1: selectedB2, b2: selectedB1 });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Comparison Configuration Bar */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Compare Bootcamps Side-by-Side
              </h1>
              <p className="text-xs text-slate-500">
                Choose any two programs to inspect fee differences, shared tech stacks, and career guarantees.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/bootcamps")}
            className="text-xs gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </Button>
        </div>

        {/* Bootcamp Selection Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Bootcamp 1
            </label>
            <select
              value={selectedB1}
              onChange={(e) => {
                setSelectedB1(e.target.value);
                setSearchParams({ b1: e.target.value, b2: selectedB2 });
              }}
              className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              {allBootcamps.map((b) => (
                <option key={b.id} value={b.id} disabled={b.id === selectedB2}>
                  {b.provider} - {b.name} (₹{b.price_inr.toLocaleString("en-IN")})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center pt-4 md:pt-5">
            <button
              onClick={handleSwap}
              title="Swap programs"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-transform active:rotate-180"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Bootcamp 2
            </label>
            <select
              value={selectedB2}
              onChange={(e) => {
                setSelectedB2(e.target.value);
                setSearchParams({ b1: selectedB1, b2: e.target.value });
              }}
              className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              {allBootcamps.map((b) => (
                <option key={b.id} value={b.id} disabled={b.id === selectedB1}>
                  {b.provider} - {b.name} (₹{b.price_inr.toLocaleString("en-IN")})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
          <p className="text-sm font-medium text-slate-500">Calculating comparison metrics...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
          <div>
            <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Comparison could not be completed
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/bootcamps")}
            className="text-xs"
          >
            Return to Discovery
          </Button>
        </div>
      )}

      {/* Comparison Table */}
      {!loading && !error && comparisonData && (
        <ComparisonTable
          b1={comparisonData.bootcamps[0]}
          b2={comparisonData.bootcamps[1]}
          comparison={comparisonData.comparison}
          onBack={() => navigate("/bootcamps")}
        />
      )}
    </div>
  );
};
