"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompletion } from "@ai-sdk/react";
import { Lock, Sparkles, Download, Share2, Star, ChevronDown, Briefcase, Heart, HeartPulse, Brain, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PaywallCard from "@/components/PaywallCard";

const SECTION_ICONS: Record<string, any> = {
  "tính cách": Brain,
  "sự nghiệp": Briefcase,
  "tài lộc": Coins,
  "hôn nhân": Heart,
  "sức khỏe": HeartPulse,
};

function ShimmerSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-4 rounded-md animate-shimmer"
          style={{
            width: `${85 - i * 10}%`,
            backgroundImage: "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.08) 50%, hsl(var(--muted)) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      ))}
    </div>
  );
}

export default function InterpretSection({ chartId }: { chartId: string }) {
  const [hasPaid, setHasPaid] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/interpret",
    body: { chartId },
  });

  const handleUnlockFree = async () => {
    setShowSummary(true);
    complete("summary");
  };

  const handlePay = () => {
    alert("Chuyển hướng đến cổng thanh toán...");
    setTimeout(() => {
      setHasPaid(true);
      complete("full");
    }, 1500);
  };

  // ═══════ State 1: CTA Button ═══════
  if (!showSummary && !hasPaid) {
    return (
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            size="lg"
            className="h-14 px-8 text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2 transition-all hover:scale-[1.02] animate-float"
            onClick={handleUnlockFree}
          >
            <Sparkles className="w-5 h-5" />
            Nhận Bình Giải Tổng Quan (Miễn Phí)
          </Button>
        </motion.div>
      </div>
    );
  }

  // ═══════ State 2: Summary + Paywall ═══════
  if (showSummary && !hasPaid) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Summary Card */}
        <Card className="glass-card border-primary/20 noise-overlay">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              Tổng Quan Lá Số
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !completion ? (
              <ShimmerSkeleton />
            ) : (
              <div className="prose-bazi">
                {completion || "Nhật chủ sinh không đắc lệnh, được một vài cát thần hỗ trợ nhưng toàn cục vẫn thiên về nhược. Dụng thần cần dùng Ấn tinh (Thủy) để sinh trợ. Hiện tại đang trong vận thiên về hỏa, cẩn trọng hao tài tốn của. Cụ thể chi tiết xin xem bản đầy đủ."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blur-lock preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-10 rounded-2xl" />
          <div className="blur-[6px] opacity-40 pointer-events-none space-y-3 p-6 glass-card">
            <div className="h-5 bg-white/[0.06] rounded w-1/3" />
            <div className="h-4 bg-white/[0.04] rounded w-full" />
            <div className="h-4 bg-white/[0.04] rounded w-5/6" />
            <div className="h-4 bg-white/[0.04] rounded w-4/5" />
            <div className="h-5 bg-white/[0.06] rounded w-1/4 mt-4" />
            <div className="h-4 bg-white/[0.04] rounded w-full" />
            <div className="h-4 bg-white/[0.04] rounded w-3/4" />
          </div>
        </div>

        {/* Paywall */}
        <PaywallCard onPay={handlePay} />
      </motion.div>
    );
  }

  // ═══════ State 3: Full Content ═══════
  const sections = [
    { key: "tinh-cach", label: "Tính cách", icon: Brain },
    { key: "su-nghiep", label: "Sự nghiệp", icon: Briefcase },
    { key: "tai-loc", label: "Tài lộc", icon: Coins },
    { key: "hon-nhan", label: "Hôn nhân & Tình duyên", icon: Heart },
    { key: "suc-khoe", label: "Sức khỏe", icon: HeartPulse },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="outline" size="sm" className="gap-2 glass border-white/10 text-sm">
          <Download className="w-4 h-4" /> Tải PDF
        </Button>
        <Button variant="outline" size="sm" className="gap-2 glass border-white/10 text-sm">
          <Share2 className="w-4 h-4" /> Chia sẻ
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && !completion && (
        <Card className="glass-card noise-overlay">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 text-muted-foreground mb-6">
              <Sparkles className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm font-medium animate-pulse">AI đang phân tích và viết luận giải... (1-2 phút)</span>
            </div>
            <ShimmerSkeleton />
          </CardContent>
        </Card>
      )}

      {/* Full Content - Accordion */}
      {(!isLoading || completion) && (
        <div className="space-y-3">
          {sections.map((section) => {
            const isOpen = expandedSection === section.key;
            const Icon = section.icon;

            return (
              <div key={section.key} className="glass-card overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isOpen ? null : section.key)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/[0.08] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm sm:text-base">{section.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/[0.04]">
                        <div className="prose-bazi">
                          {completion || `Nội dung phân tích ${section.label} sẽ được hiển thị ở đây sau khi AI hoàn thành luận giải...`}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating */}
      <div className="glass-card p-5 sm:p-6 text-center space-y-3 noise-overlay">
        <p className="text-sm text-muted-foreground">Bạn đánh giá bài luận giải này thế nào?</p>
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="p-1 transition-all hover:scale-110"
            >
              <Star
                className={`w-7 h-7 ${
                  star <= rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30 hover:text-muted-foreground/50"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground/40 text-center leading-relaxed">
        Mọi bình giải mang tính tham khảo, không thay thế tư vấn chuyên gia. Hệ thống không phán đoán tuyệt đối về sinh tử, bệnh tật, tai nạn.
      </p>
    </motion.div>
  );
}
