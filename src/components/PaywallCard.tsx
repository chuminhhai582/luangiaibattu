"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2, Shield, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaywallCardProps {
  onPay: () => void;
  price?: number;
}

const FEATURES = [
  "Phân tích Dụng thần & Hỷ kỵ chi tiết",
  "Sự nghiệp & Tài lộc: Chọn nghề, thời điểm đầu tư",
  "Tình duyên & Hôn nhân: Thời điểm, tính cách bạn đời",
  "Sức khỏe: Lưu ý bệnh lý theo ngũ hành",
  "Dự báo cát hung 10 Đại Vận (100 năm)",
  "Chi tiết lưu niên 3 năm kế tiếp",
  "Xuất file PDF bản luận giải",
];

export default function PaywallCard({ onPay, price = 99000 }: PaywallCardProps) {
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
      <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[300px] h-[300px] rounded-full bg-accent/[0.04] blur-[80px] pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-10 md:p-12 text-center space-y-8">
        {/* Lock Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/[0.1] border border-primary/20 glow-gold">
          <Lock className="w-7 h-7 text-primary" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h3 className="text-2xl sm:text-3xl font-bold">
            Mở Khóa Bản Luận Giải{" "}
            <span className="text-gradient-gold">Chuyên Sâu</span>
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Bản luận giải 5-7 trang A4 do AI cao cấp phân tích từng ngóc ngách lá số, giúp bạn thấu hiểu thiên mệnh.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-foreground/80">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="space-y-4 pt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl sm:text-5xl font-bold text-foreground">{formattedPrice}</span>
            <span className="text-lg text-muted-foreground">đ</span>
          </div>

          <Button
            size="lg"
            className="h-14 px-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.02]"
            onClick={onPay}
          >
            Mở Khóa Ngay
          </Button>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground/60 pt-2">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Thanh toán tự động 24/7</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Mua 1 lần, xem vĩnh viễn</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Hỗ trợ hoàn tiền</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
