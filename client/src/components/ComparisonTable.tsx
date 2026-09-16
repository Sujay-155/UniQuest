import React from "react";
import { Check, X, Star, ShieldCheck, Zap, ExternalLink, ArrowLeft, ArrowUpDown } from "lucide-react";
import { Bootcamp, ComparisonMetrics } from "../types/bootcamp";
import { formatINR } from "../lib/utils";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

interface ComparisonTableProps {
  b1: Bootcamp;
  b2: Bootcamp;
  comparison: ComparisonMetrics;
  onBack: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  b1,
  b2,
  comparison,
  onBack,
}) => {
  const isB1Cheaper = b1.id === comparison.cheaper_bootcamp_id;
  const isB2Cheaper = b2.id === comparison.cheaper_bootcamp_id;
  const isB1HigherRated = b1.id === comparison.higher_rated_bootcamp_id;
  const isB2HigherRated = b2.id === comparison.higher_rated_bootcamp_id;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </button>

        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Side-by-Side Comparison
        </span>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-elevated overflow-hidden">
        {/* Top Header Row with Programs */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="p-6 bg-slate-50/70 dark:bg-slate-950/50 hidden md:flex flex-col justify-end">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Metric / Feature
            </span>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
              Program Comparison
            </h3>
          </div>

          {/* Bootcamp 1 Column Header */}
          <div className="p-6 border-b md:border-b-0 md:border-l border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {b1.provider}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {b1.name}
              </h2>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={b1.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-10 px-4 text-xs gap-2"
              >
                <span>Visit {b1.provider}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Bootcamp 2 Column Header */}
          <div className="p-6 md:border-l border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {b2.provider}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {b2.name}
              </h2>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={b2.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-10 px-4 text-xs gap-2"
              >
                <span>Visit {b2.provider}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="p-5 font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20 flex items-center">
            Tuition Fee & Savings
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {formatINR(b1.price_inr)}
              </span>
              {isB1Cheaper && comparison.price_difference_inr > 0 && (
                <Badge variant="success" className="text-[10px]">
                  Saves {formatINR(comparison.price_difference_inr)}
                </Badge>
              )}
            </div>
            {b1.isa_available && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium block">
                Zero upfront payment option available
              </span>
            )}
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {formatINR(b2.price_inr)}
              </span>
              {isB2Cheaper && comparison.price_difference_inr > 0 && (
                <Badge variant="success" className="text-[10px]">
                  Saves {formatINR(comparison.price_difference_inr)}
                </Badge>
              )}
            </div>
            {b2.isa_available && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium block">
                Zero upfront payment option available
              </span>
            )}
          </div>
        </div>

        {/* Alumni Rating */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="p-5 font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20 flex items-center">
            Alumni Rating
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{b1.alumni_rating.toFixed(1)} / 5.0</span>
            </div>
            {isB1HigherRated && comparison.rating_difference > 0 && (
              <Badge variant="warning" className="text-[10px]">
                +{comparison.rating_difference} Higher
              </Badge>
            )}
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{b2.alumni_rating.toFixed(1)} / 5.0</span>
            </div>
            {isB2HigherRated && comparison.rating_difference > 0 && (
              <Badge variant="warning" className="text-[10px]">
                +{comparison.rating_difference} Higher
              </Badge>
            )}
          </div>
        </div>

        {/* Placement Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="p-5 font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20 flex items-center">
            Placement Guarantee
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80">
            {b1.placement_guarantee ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Check className="w-4 h-4" />
                <span>100% Placement Guarantee</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 font-normal text-xs">
                <X className="w-4 h-4 text-slate-300" />
                <span>Placement Assistance Only</span>
              </div>
            )}
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80">
            {b2.placement_guarantee ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Check className="w-4 h-4" />
                <span>100% Placement Guarantee</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 font-normal text-xs">
                <X className="w-4 h-4 text-slate-300" />
                <span>Placement Assistance Only</span>
              </div>
            )}
          </div>
        </div>

        {/* ISA Availability */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="p-5 font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20 flex items-center">
            Income Share Agreement (ISA)
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80">
            {b1.isa_available ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Check className="w-4 h-4" />
                <span>Yes - Pay Only After Getting Placed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 font-normal text-xs">
                <X className="w-4 h-4 text-slate-300" />
                <span>Upfront / EMI only</span>
              </div>
            )}
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80">
            {b2.isa_available ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Check className="w-4 h-4" />
                <span>Yes - Pay Only After Getting Placed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 font-normal text-xs">
                <X className="w-4 h-4 text-slate-300" />
                <span>Upfront / EMI only</span>
              </div>
            )}
          </div>
        </div>

        {/* Common Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="p-5 font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20 flex items-center">
            Shared Tech Stack
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 md:col-span-2">
            {comparison.common_technologies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {comparison.common_technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs px-2.5 py-1 rounded-lg font-mono font-medium"
                  >
                    ✓ {tech}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-400">No overlapping technologies</span>
            )}
          </div>
        </div>

        {/* Unique Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="p-5 font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20 flex items-center">
            Unique Curriculum Technologies
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Unique to {b1.provider}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {comparison.unique_to_b1.length > 0 ? (
                comparison.unique_to_b1.map((tech) => (
                  <span
                    key={tech}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-lg font-mono font-medium"
                  >
                    + {tech}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None</span>
              )}
            </div>
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Unique to {b2.provider}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {comparison.unique_to_b2.length > 0 ? (
                comparison.unique_to_b2.map((tech) => (
                  <span
                    key={tech}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-lg font-mono font-medium"
                  >
                    + {tech}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Highlights & Mentorship */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-5 font-semibold text-xs text-slate-600 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20 flex items-center">
            Program Highlights
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 space-y-2">
            {b1.highlights?.map((hl, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
          <div className="p-5 md:border-l border-slate-100 dark:border-slate-800/80 space-y-2">
            {b2.highlights?.map((hl, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
