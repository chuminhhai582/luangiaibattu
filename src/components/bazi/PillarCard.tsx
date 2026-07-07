"use client";

import { motion } from "framer-motion";
import { getElementTextClass, getElementBgClass } from "./element-utils";

interface PillarData {
  gan: string;
  zhi: string;
  hide_gan: string[];
  na_yin: string;
  shi_shen_gan: string;
  shi_shen_zhi?: string[];
}

interface PillarCardProps {
  title: string;
  pillar: PillarData;
  highlight?: boolean;
  index?: number;
}

export default function PillarCard({ title, pillar, highlight = false, index = 0 }: PillarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        relative flex flex-col items-center p-3 sm:p-5 rounded-2xl border backdrop-blur-sm
        ${highlight
          ? "bg-primary/[0.06] border-primary/30 glow-gold"
          : "glass-card"
        }
      `}
    >
      {/* Nhật Chủ Badge */}
      {highlight && (
        <div className="absolute -top-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-amber-400 text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-lg">
          Nhật Chủ
        </div>
      )}

      {/* Pillar Label */}
      <div className="text-[10px] sm:text-xs text-muted-foreground font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4">
        {title}
      </div>

      {/* Thập thần (Can) */}
      <div className="text-[10px] sm:text-xs text-muted-foreground/60 h-4 mb-1">
        {pillar.shi_shen_gan !== "NHẬT CHỦ" ? pillar.shi_shen_gan : ""}
      </div>

      {/* Thiên Can */}
      <div className={`text-4xl sm:text-5xl md:text-6xl font-bold ${getElementTextClass(pillar.gan)} transition-colors`}>
        {pillar.gan}
      </div>

      {/* Divider */}
      <div className="w-full my-3 sm:my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Địa Chi */}
      <div className={`text-4xl sm:text-5xl md:text-6xl font-bold ${getElementTextClass(pillar.zhi)} transition-colors`}>
        {pillar.zhi}
      </div>

      {/* Tàng Can */}
      <div className="flex items-center justify-center gap-1.5 mt-2 min-h-[20px]">
        {pillar.hide_gan.map((g: string, i: number) => (
          <span
            key={i}
            className={`
              text-[10px] sm:text-xs px-1.5 py-0.5 rounded
              ${getElementTextClass(g)} ${getElementBgClass(g)}
            `}
          >
            {g}
          </span>
        ))}
      </div>

      {/* Nạp Âm */}
      <div className="mt-3 sm:mt-4 pt-3 w-full border-t border-white/[0.04] text-center">
        <div className="text-[10px] sm:text-xs text-muted-foreground/60 truncate" title={pillar.na_yin}>
          {pillar.na_yin}
        </div>
      </div>
    </motion.div>
  );
}
