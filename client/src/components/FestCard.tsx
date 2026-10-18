import React from "react";
import { Fest } from "../types/fest";
import { MapPin, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";

interface FestCardProps {
  fest: Fest;
}

const TYPE_BADGE: Record<string, "default" | "secondary" | "warning"> = {
  Cultural: "default",
  Technical: "warning",
  Sports: "secondary",
};

export const FestCard: React.FC<FestCardProps> = ({ fest }) => {
  const metaLine = [fest.location, fest.state].filter(Boolean).join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-2xl border transition-all duration-200 bg-white overflow-hidden flex flex-col justify-between border-slate-200 hover:border-slate-300 hover:shadow-sm"
    >
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {fest.host_institution}
            </span>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors mt-0.5 line-clamp-2">
              {fest.name}
            </h3>
          </div>
        </div>

        {metaLine && (
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{metaLine}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {fest.festival_type && (
            <Badge variant={TYPE_BADGE[fest.festival_type] || "outline"} className="text-[11px] py-0.5">
              <Sparkles className="w-3 h-3 mr-1 inline-block" />
              {fest.festival_type}
            </Badge>
          )}
          {fest.first_held && (
            <Badge variant="outline" className="text-[11px] py-0.5">
              First held {fest.first_held}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 pt-3 bg-slate-50 border-t border-slate-100">
        {fest.official_website ? (
          <a
            href={fest.official_website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border border-slate-200 text-slate-700 hover:bg-slate-100 h-8 px-3 text-xs gap-1.5"
          >
            <span>Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="w-full inline-flex items-center justify-center font-semibold rounded-lg border border-slate-100 text-slate-300 h-8 px-3 text-xs cursor-not-allowed">
            Website not listed yet
          </span>
        )}
      </div>
    </motion.div>
  );
};
