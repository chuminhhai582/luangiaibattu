"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { getElementTextClass } from "./element-utils";

interface DaYunItem {
  index: number;
  gan_zhi: string;
  from_age: number;
  to_age: number;
  from_year: number;
  to_year: number;
  shi_shen?: string;
}

interface DaYunTimelineProps {
  direction: string;
  startAge: number;
  startYear: number;
  list: DaYunItem[];
  currentYear?: number;
}

export default function DaYunTimeline({
  direction,
  startAge,
  startYear,
  list,
  currentYear = new Date().getFullYear(),
}: DaYunTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const isCurrentYun = (yun: DaYunItem) =>
    currentYear >= yun.from_year && currentYear <= yun.to_year;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Khởi vận: <strong className="text-foreground">{startYear}</strong> ({startAge} tuổi)
        </span>
        <span className="text-white/20">·</span>
        <span>
          Chiều: <strong className="text-foreground">{direction}</strong>
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar -mx-1 px-1"
      >
        {list.map((yun, i) => {
          const isCurrent = isCurrentYun(yun);
          const gan = yun.gan_zhi.charAt(0);
          const zhi = yun.gan_zhi.charAt(1);

          return (
            <motion.div
              key={yun.index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`
                relative shrink-0 w-[88px] sm:w-24 snap-center rounded-xl p-3 text-center
                transition-all duration-300 cursor-default
                ${isCurrent
                  ? "bg-primary/[0.08] border-2 border-primary/40 glow-gold"
                  : "glass-card hover:bg-white/[0.06]"
                }
              `}
            >
              {/* Current badge */}
              {isCurrent && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold uppercase tracking-wider whitespace-nowrap">
                  Hiện tại
                </div>
              )}

              {/* Year range */}
              <div className="text-[10px] text-muted-foreground mb-2">
                {yun.from_year}
              </div>

              {/* Can Chi */}
              <div className="flex flex-col items-center font-bold text-xl sm:text-2xl leading-tight">
                <span className={getElementTextClass(gan)}>{gan}</span>
                <span className={getElementTextClass(zhi)}>{zhi}</span>
              </div>

              {/* Age range */}
              <div className="text-[10px] text-muted-foreground/60 mt-2">
                {yun.from_age}t – {yun.to_age}t
              </div>

              {/* Thập thần */}
              {yun.shi_shen && (
                <div className="text-[9px] text-muted-foreground/50 mt-1 truncate">
                  {yun.shi_shen}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
