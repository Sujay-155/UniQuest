import React from "react";
import { University } from "../types/university";
import { MapPin, Library, Calendar, ArrowRight, ExternalLink, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";

interface UniversityCardProps {
  university: University;
  onViewDetails?: (id: string) => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, onViewDetails }) => {
  const metaLine = [university.location || university.state, university.specialization, university.established_year ? `Est. ${university.established_year}` : null]
    .filter(Boolean)
    .join(" · ");

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
              {university.university_type} University
            </span>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors mt-0.5 line-clamp-2">
              {university.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-4">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{metaLine || university.state}</span>
        </div>

        {/* Feature Badges */}
        {(university.application_deadline || university.fee_range) && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {university.application_deadline && (
              <Badge variant="warning" className="text-[11px] py-0.5">
                <Calendar className="w-3 h-3 mr-1 inline-block" />
                Deadline: {university.application_deadline}
              </Badge>
            )}
            {university.fee_range && (
              <Badge variant="secondary" className="text-[11px] py-0.5">
                {university.fee_range}
              </Badge>
            )}
          </div>
        )}

        {/* Courses Offered */}
        {university.courses_offered.length > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Library className="w-3 h-3" />
              <span>Top Courses</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {university.courses_offered.slice(0, 4).map((course, idx) => (
                <span
                  key={idx}
                  className="bg-slate-50 text-slate-700 border border-slate-200 text-xs px-2 py-0.5 rounded-md font-mono font-medium"
                >
                  {course}
                </span>
              ))}
              {university.courses_offered.length > 4 && (
                <span className="text-[11px] text-slate-400 self-center px-1">
                  +{university.courses_offered.length - 4} more
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Course details not yet available</span>
          </div>
        )}
      </div>

      <div className="p-6 pt-3 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2 mt-2">
          {university.official_website ? (
            <a
              href={university.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border border-slate-200 text-slate-700 hover:bg-slate-100 h-8 px-3 text-xs gap-1.5"
            >
              <span>Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="w-full inline-flex items-center justify-center font-semibold rounded-lg border border-slate-100 text-slate-300 h-8 px-3 text-xs cursor-not-allowed">
              Website
            </span>
          )}

          {university.admission_portal_link ? (
            <a
              href={university.admission_portal_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] bg-slate-900 hover:bg-slate-800 text-white shadow-sm h-8 px-3 text-xs gap-1.5"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="w-full inline-flex items-center justify-center font-semibold rounded-lg bg-slate-100 text-slate-400 h-8 px-3 text-xs cursor-not-allowed">
              Not listed yet
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

