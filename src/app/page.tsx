"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Compass, ScrollText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-900/20 blur-[100px] -z-10" />

      {/* Navbar placeholder */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
          <Compass className="w-6 h-6 text-primary" />
          <span>Bát Tự <span className="text-primary">AI</span></span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/lap-la-so" className="hover:text-primary transition-colors">Lập Lá Số</Link>
          <Link href="/kien-thuc" className="hover:text-primary transition-colors">Kiến Thức</Link>
          <Link href="/gioi-thieu" className="hover:text-primary transition-colors">Giới Thiệu</Link>
        </nav>
        <div className="flex gap-4">
          <Button variant="ghost" className="hidden md:inline-flex">Đăng Nhập</Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/lap-la-so">Thử Ngay</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20 z-10 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Phân tích Mệnh Lý bằng Trí Tuệ Nhân Tạo</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-sm leading-tight">
            Giải Mã Vận Mệnh <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">
              Với Độ Chính Xác Tuyệt Đối
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hệ thống tính toán Tứ Trụ dựa trên thuật toán thiên văn chuẩn xác, kết hợp cùng AI phân tích chuyên sâu các lĩnh vực: Sự nghiệp, Tài lộc, Tình duyên và Sức khỏe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="h-14 px-8 text-lg gap-2" asChild>
              <Link href="/lap-la-so">
                Lập Lá Số Miễn Phí <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg glass" asChild>
              <Link href="/gioi-thieu">Tìm hiểu thêm</Link>
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mt-24 w-full text-left"
        >
          <div className="glass-card p-8 space-y-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Chuẩn Giờ Mặt Trời</h3>
            <p className="text-muted-foreground leading-relaxed">
              Tự động hiệu chỉnh giờ sinh thực tế theo kinh độ và múi giờ lịch sử Việt Nam, loại bỏ sai số do giao tiết khí.
            </p>
          </div>
          
          <div className="glass-card p-8 space-y-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">AI Phân Tích Chuyên Sâu</h3>
            <p className="text-muted-foreground leading-relaxed">
              Nhận diện chính xác cường nhược, cách cục và dụng thần. Bình giải chi tiết từng khía cạnh cuộc sống qua thuật toán độc quyền.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Lưu Niên & Đại Vận</h3>
            <p className="text-muted-foreground leading-relaxed">
              Dự báo cát hung qua 10 đại vận và các năm lưu niên kế tiếp, giúp bạn nắm bắt thời cơ và phòng tránh rủi ro.
            </p>
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 mt-24 border-t border-white/10 text-center text-sm text-muted-foreground z-10">
        <p>© {new Date().getFullYear()} Bát Tự AI. Mọi bình giải mang tính tham khảo.</p>
      </footer>
    </div>
  );
}
