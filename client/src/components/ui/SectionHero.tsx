import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeroProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}

export const SectionHero: React.FC<SectionHeroProps> = ({ icon: Icon, eyebrow, title, description }) => {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-[#07110d] px-6 sm:px-10 py-10 sm:py-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-blob-1 absolute -top-24 -left-16 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.32)_0%,transparent_70%)] blur-3xl" />
        <div className="aurora-blob-2 absolute -bottom-28 right-[-8%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(4,120,87,0.38)_0%,transparent_70%)] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
          <Icon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight text-[#f7f5f0]">{title}</h1>
        <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed max-w-xl">{description}</p>
      </motion.div>
    </section>
  );
};
