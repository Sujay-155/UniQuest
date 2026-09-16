import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Zap,
  ExternalLink,
  Layers,
  Clock,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Scale
} from "lucide-react";
import { Bootcamp } from "../types/bootcamp";
import { fetchBootcampById } from "../services/api";
import { formatINR } from "../lib/utils";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

interface DetailProps {
  onSelectForCompare: (bootcamp: Bootcamp) => void;
}

export const Detail: React.FC<DetailProps> = ({ onSelectForCompare }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bootcamp, setBootcamp] = useState<Bootcamp | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      fetchBootcampById(id)
        .then((res) => {
          if (res.success) {
            setBootcamp(res.data);
          } else {
            setError(res.error || "Bootcamp details not found");
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to load bootcamp details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
        <p className="text-sm font-medium text-slate-500">Loading program curriculum & specifications...</p>
      </div>
    );
  }

  if (error || !bootcamp) {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 bg-rose-50 dark:bg-rose-950/30 rounded-3xl border border-rose-200 dark:border-rose-800 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="text-base font-bold text-rose-900 dark:text-rose-100">
          Could not find bootcamp details
        </h2>
        <p className="text-xs text-rose-700 dark:text-rose-300">{error || "Requested program does not exist."}</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/")} className="text-xs">
          Return to Bootcamps Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back link */}
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Bootcamps</span>
      </button>

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 shadow-elevated space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {bootcamp.provider}
              </span>

              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{bootcamp.alumni_rating.toFixed(1)} / 5.0 Rating</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {bootcamp.name}
            </h1>

            <div className="flex flex-wrap gap-2 pt-2">
              {bootcamp.placement_guarantee && (
                <Badge variant="default" className="text-xs py-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Placement Guarantee
                </Badge>
              )}
              {bootcamp.isa_available && (
                <Badge variant="warning" className="text-xs py-1">
                  Income Share Agreement (ISA)
                </Badge>
              )}
              {bootcamp.duration_weeks && (
                <Badge variant="secondary" className="text-xs py-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {bootcamp.duration_weeks} Weeks Duration
                </Badge>
              )}
              {bootcamp.mode && (
                <Badge variant="outline" className="text-xs py-1">
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  {bootcamp.mode}
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing & CTA box */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0 md:w-72 space-y-4 text-center md:text-left">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Tuition Fee
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                {formatINR(bootcamp.price_inr)}
              </div>
              {bootcamp.isa_available && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  Pay ₹0 until you get placed in a high-paying role.
                </p>
              )}
            </div>

            <a
              href={bootcamp.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow h-11 px-5 text-sm gap-2 transition-all transform active:scale-95"
            >
              <span>Visit & Enroll</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSelectForCompare(bootcamp);
                navigate("/");
              }}
              className="w-full text-xs font-semibold gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Add to Compare</span>
            </Button>
          </div>
        </div>

        {/* Description */}
        {bootcamp.description && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About the Curriculum
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              {bootcamp.description}
            </p>
          </div>
        )}

        {/* Tech Stack Matrix */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Covered Technologies & Tools
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {bootcamp.tech_stack.map((tech) => (
              <span
                key={tech}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1.5 rounded-lg font-mono font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Highlights */}
        {bootcamp.highlights && bootcamp.highlights.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Program Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bootcamp.highlights.map((hl, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
