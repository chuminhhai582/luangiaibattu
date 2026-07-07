"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PillarCard from "@/components/bazi/PillarCard";
import DaYunTimeline from "@/components/bazi/DaYunTimeline";
import FiveElementChart from "@/components/bazi/FiveElementChart";
import InterpretSection from "./InterpretSection";
import { getElementTextClass } from "@/components/bazi/element-utils";
import { Layers, TrendingUp, Sparkles } from "lucide-react";

interface ResultClientViewProps {
  chart: any;
  chartId: string;
}

function SectionHeading({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-primary/[0.08] border border-primary/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span>{title}</span>
      <div className="flex-1 section-divider" />
    </h2>
  );
}

export default function ResultClientView({ chart, chartId }: ResultClientViewProps) {
  return (
    <div className="space-y-10 sm:space-y-14">
      {/* ═══════ Tứ Trụ ═══════ */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeading icon={Layers} title="Bảng Tứ Trụ" />

        {/* Desktop: 4 columns, Mobile: horizontal scroll */}
        <div className="hidden sm:grid grid-cols-4 gap-3 md:gap-4">
          <PillarCard title="NĂM" pillar={chart.pillars.year} index={0} />
          <PillarCard title="THÁNG" pillar={chart.pillars.month} index={1} />
          <PillarCard title="NGÀY" pillar={chart.pillars.day} highlight index={2} />
          <PillarCard title="GIỜ" pillar={chart.pillars.hour} index={3} />
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="sm:hidden flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar -mx-1 px-1">
          <div className="shrink-0 w-[75vw] max-w-[260px] snap-center">
            <PillarCard title="NĂM" pillar={chart.pillars.year} index={0} />
          </div>
          <div className="shrink-0 w-[75vw] max-w-[260px] snap-center">
            <PillarCard title="THÁNG" pillar={chart.pillars.month} index={1} />
          </div>
          <div className="shrink-0 w-[75vw] max-w-[260px] snap-center">
            <PillarCard title="NGÀY" pillar={chart.pillars.day} highlight index={2} />
          </div>
          <div className="shrink-0 w-[75vw] max-w-[260px] snap-center">
            <PillarCard title="GIỜ" pillar={chart.pillars.hour} index={3} />
          </div>
        </div>
      </motion.section>

      {/* ═══════ Info Grid: Ngũ Hành + Đại Vận ═══════ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ngũ Hành */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-white/[0.06] noise-overlay">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Cường Nhược & Ngũ Hành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FiveElementChart
                counts={chart.five_elements?.count || { Mộc: 2, Hỏa: 2, Thổ: 2, Kim: 1, Thủy: 1 }}
                strengthLabel={chart.strength.label}
                strengthScore={chart.strength.score}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Đại Vận */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-white/[0.06] noise-overlay">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Đại Vận (10 Năm)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DaYunTimeline
                direction={chart.da_yun.direction}
                startAge={chart.da_yun.start_age}
                startYear={chart.da_yun.start_year}
                list={chart.da_yun.list}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════ Relations ═══════ */}
      {chart.relations && chart.relations.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <SectionHeading icon={Layers} title="Hợp · Xung · Hình · Hại" />
          <div className="flex flex-wrap gap-2">
            {chart.relations.map((rel: any, i: number) => {
              const typeColors: Record<string, string> = {
                "lục hợp": "bg-el-wood text-el-wood",
                "hợp": "bg-el-wood text-el-wood",
                "xung": "bg-el-fire text-el-fire",
                "hình": "bg-el-earth text-el-earth",
                "hại": "bg-el-metal text-el-metal",
                "phá": "bg-el-water text-el-water",
              };
              const colorClass = typeColors[rel.type] || "bg-white/[0.04] text-muted-foreground";
              return (
                <div
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.06] ${colorClass}`}
                >
                  <span className="uppercase tracking-wider opacity-60">{rel.type}</span>
                  <span>{rel.between.join(" ↔ ")}</span>
                  {rel.result && <span className="opacity-60">→ {rel.result}</span>}
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ═══════ Thần Sát ═══════ */}
      {chart.shen_sha && chart.shen_sha.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SectionHeading icon={Sparkles} title="Thần Sát" />
          <div className="flex flex-wrap gap-2">
            {chart.shen_sha.map((ss: any, i: number) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/[0.08] border border-accent/20 text-xs font-medium text-accent"
              >
                <span>✦</span>
                <span>{ss.name}</span>
                <span className="text-muted-foreground/50">({ss.position})</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ═══════ AI Interpret ═══════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <SectionHeading icon={Sparkles} title="Luận Giải Chuyên Sâu bằng AI" />
        <InterpretSection chartId={chartId} />
      </motion.section>
    </div>
  );
}
