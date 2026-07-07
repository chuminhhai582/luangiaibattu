"use client";

import { motion } from "framer-motion";
import { type ElementType, getElementLabel, getElementEmoji } from "./element-utils";

interface FiveElementChartProps {
  counts: Record<string, number>;
  strengthLabel: string;
  strengthScore: number;
}

const ELEMENT_ORDER: ElementType[] = ["wood", "fire", "earth", "metal", "water"];
const VN_NAMES: Record<string, ElementType> = {
  "Mộc": "wood", "Hỏa": "fire", "Thổ": "earth", "Kim": "metal", "Thủy": "water",
};

const ELEMENT_COLORS: Record<ElementType, string> = {
  wood:  "hsl(142, 71%, 45%)",
  fire:  "hsl(0, 90%, 64%)",
  earth: "hsl(43, 96%, 56%)",
  metal: "hsl(210, 20%, 78%)",
  water: "hsl(217, 91%, 60%)",
};

export default function FiveElementChart({ counts, strengthLabel, strengthScore }: FiveElementChartProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  // Normalize counts to element order
  const data = ELEMENT_ORDER.map((el) => {
    const vnName = getElementLabel(el);
    const count = counts[vnName] || 0;
    const pct = (count / total) * 100;
    return { el, vnName, count, pct, emoji: getElementEmoji(el), color: ELEMENT_COLORS[el] };
  });

  return (
    <div className="space-y-5">
      {/* Strength Badge */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <span className="text-sm text-muted-foreground">Cường nhược Nhật Chủ</span>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-primary">{strengthLabel}</span>
          <span className="text-xs text-muted-foreground/60">({Math.round(strengthScore * 100)}%)</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-3">
        {data.map((item, i) => (
          <motion.div
            key={item.el}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            {/* Label */}
            <div className="w-16 flex items-center gap-1.5 shrink-0">
              <span className="text-sm">{item.emoji}</span>
              <span className="text-xs font-medium" style={{ color: item.color }}>
                {item.vnName}
              </span>
            </div>

            {/* Bar */}
            <div className="flex-1 h-5 rounded-full bg-white/[0.04] overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(item.pct, 4)}%` }}
                transition={{ duration: 0.8, delay: i * 0.08 + 0.2, ease: "easeOut" }}
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, ${item.color}33, ${item.color}88)`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: `0 0 12px ${item.color}40` }}
                />
              </motion.div>
            </div>

            {/* Count */}
            <span className="w-6 text-right text-xs text-muted-foreground font-mono">
              {item.count}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
