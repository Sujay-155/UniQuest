import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Check, ExternalLink, ArrowRight, Layers, Clock } from "lucide-react";
import { Bootcamp } from "../types/bootcamp";
import { formatINR } from "../lib/utils";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

interface BootcampCardProps {
  bootcamp: Bootcamp;
  isSelectedForCompare: boolean;
  onToggleCompare: (bootcamp: Bootcamp) => void;
  onViewDetails: (id: string) => void;
}

export const BootcampCard: React.FC<BootcampCardProps> = ({
  bootcamp,
  isSelectedForCompare,
  onToggleCompare,
  onViewDetails,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className={`group relative rounded-2xl border transition-all duration-200 bg-white overflow-hidden flex flex-col justify-between ${
        isSelectedForCompare
          ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Top Banner / Provider info */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {bootcamp.provider}
            </span>
            <h3
              onClick={() => onViewDetails(bootcamp.id)}
              className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors cursor-pointer mt-0.5 line-clamp-1"
            >
              {bootcamp.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{bootcamp.alumni_rating.toFixed(1)}</span>
          </div>
        </div>

        {bootcamp.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {bootcamp.description}
          </p>
        )}

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bootcamp.placement_guarantee && (
            <Badge variant="default" className="text-[11px] py-0.5 bg-slate-100 text-slate-800 border-slate-200">
              <ShieldCheck className="w-3 h-3 text-slate-600" />
              Job Guarantee
            </Badge>
          )}
          {bootcamp.isa_available && (
            <Badge variant="warning" className="text-[11px] py-0.5">
              ISA / Pay After Placement
            </Badge>
          )}
          {bootcamp.duration_weeks && (
            <Badge variant="secondary" className="text-[11px] py-0.5 text-slate-600">
              <Clock className="w-3 h-3 text-slate-400" />
              {bootcamp.duration_weeks} Weeks
            </Badge>
          )}
        </div>

        {/* Tech Stack Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Layers className="w-3 h-3" />
            <span>Core Technologies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {bootcamp.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="bg-slate-50 text-slate-700 border border-slate-200 text-xs px-2 py-0.5 rounded-md font-mono font-medium"
              >
                {tech}
              </span>
            ))}
            {bootcamp.tech_stack.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center px-1">
                +{bootcamp.tech_stack.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Pricing & Actions */}
      <div className="p-6 pt-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Tuition Fee
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900">
                {formatINR(bootcamp.price_inr)}
              </span>
              {bootcamp.isa_available && (
                <span className="text-[11px] text-slate-600 font-medium">
                  or ₹0 upfront
                </span>
              )}
            </div>
          </div>

          <label
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-slate-600 hover:text-slate-900 select-none py-1 px-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare(bootcamp)}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
            />
            <span>Compare</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(bootcamp.id)}
            className="w-full text-xs font-semibold group/btn border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>

          <a
            href={bootcamp.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full inline-flex items-center justify-center font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] bg-slate-900 hover:bg-slate-800 text-white shadow-sm h-8 px-3 text-xs gap-1.5"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
