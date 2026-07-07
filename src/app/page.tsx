"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Compass, ScrollText, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* ═══════ Background Ambience ═══════ */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-30%] left-[20%] w-[600px] h-[600px] rounded-full bg-primary/[0.07] blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-[130px]" />
        <div className="absolute top-[40%] left-[-10%] w-[300px] h-[300px] rounded-full bg-el-water/[0.04] blur-[100px]" />
      </div>

      {/* ═══════ Hero Section ═══════ */}
      <main className="flex-1 flex flex-col items-center pt-28 sm:pt-36 pb-12 px-4">
        <div className="w-full max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div custom={0} variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4 animate-glow-pulse" />
              <span>Phân tích Mệnh Lý bằng Trí Tuệ Nhân Tạo</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 custom={1} variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Giải Mã Vận Mệnh{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient-gold">
                Chính Xác Tuyệt Đối
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p custom={2} variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tứ Trụ được tính toán bằng thuật toán thiên văn chuẩn xác.{" "}
              AI phân tích chuyên sâu Sự nghiệp, Tài lộc, Tình duyên, Sức khỏe và 10 Đại Vận.
            </motion.p>

            {/* CTA */}
            <motion.div custom={3} variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="h-14 px-8 text-base sm:text-lg font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02]" asChild>
                <Link href="/lap-la-so">
                  Lập Lá Số Miễn Phí <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base sm:text-lg glass border-white/10 hover:bg-white/[0.06]" asChild>
                <Link href="/gioi-thieu">Tìm hiểu thêm</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* ═══════ Feature Cards ═══════ */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-20 sm:mt-28 w-full text-left"
          >
            {[
              {
                icon: Compass,
                title: "Chuẩn Giờ Mặt Trời",
                desc: "Tự động hiệu chỉnh giờ sinh theo kinh độ và múi giờ lịch sử Việt Nam. Loại bỏ sai số do giao tiết khí.",
              },
              {
                icon: Sparkles,
                title: "AI Phân Tích 5 Bước",
                desc: "Chain 5 bước: Cường nhược → Dụng thần → Luận lĩnh vực → Đại vận → Kiểm chứng tự động.",
              },
              {
                icon: ScrollText,
                title: "Đại Vận & Lưu Niên",
                desc: "Dự báo cát hung 10 đại vận và lưu niên 3 năm kế tiếp, giúp nắm bắt thời cơ.",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                custom={i + 4}
                variants={fadeInUp}
                className="glass-card-hover p-6 sm:p-8 space-y-4 noise-overlay group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/[0.08] border border-primary/20 flex items-center justify-center group-hover:glow-gold transition-shadow duration-300">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{feat.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ═══════ How It Works ═══════ */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-24 sm:mt-32"
          >
            <motion.h2 custom={0} variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">
              Cách hoạt động
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />

              {[
                { step: "01", icon: Zap, title: "Nhập thông tin", desc: "Ngày giờ sinh, giới tính, nơi sinh — hệ thống chuẩn hóa giờ chính xác" },
                { step: "02", icon: Shield, title: "Engine tính toán", desc: "Thuật toán thiên văn lập Tứ Trụ, Thập Thần, Thần Sát, Đại Vận" },
                { step: "03", icon: BarChart3, title: "AI luận giải", desc: "Claude phân tích chuyên sâu qua chain 5 bước với kiểm chứng tự động" },
              ].map((item, i) => (
                <motion.div key={item.step} custom={i + 1} variants={fadeInUp} className="text-center space-y-4">
                  <div className="relative mx-auto w-24 h-24 rounded-2xl glass flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ═══════ Bottom CTA ═══════ */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-24 sm:mt-32 glass-card p-8 sm:p-12 text-center space-y-6 noise-overlay"
          >
            <motion.h2 custom={0} variants={fadeInUp} className="text-2xl sm:text-3xl font-bold">
              Sẵn sàng khám phá <span className="text-gradient-gold">vận mệnh</span> của bạn?
            </motion.h2>
            <motion.p custom={1} variants={fadeInUp} className="text-muted-foreground max-w-lg mx-auto">
              Lập lá số miễn phí, nhận tổng quan tức thì. Mở khóa bản luận giải chuyên sâu chỉ từ 99.000đ.
            </motion.p>
            <motion.div custom={2} variants={fadeInUp}>
              <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20" asChild>
                <Link href="/lap-la-so">
                  Bắt Đầu Ngay <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
