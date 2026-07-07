"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCompletion } from "@ai-sdk/react";
import { Lock, Sparkles, CheckCircle2, ChevronDown, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterpretSection({ chartId }: { chartId: string }) {
  const [hasPaid, setHasPaid] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/interpret",
    body: { chartId },
  });

  const handleUnlockFree = async () => {
    setShowSummary(true);
    // In a real app, this would call step 1 & 2
    complete("summary");
  };

  const handlePay = () => {
    // Mocking payment flow
    alert("Chuyển hướng đến cổng thanh toán...");
    setTimeout(() => {
      setHasPaid(true);
      complete("full");
    }, 1500);
  };

  return (
    <div className="space-y-8 relative">
      {!showSummary && !hasPaid && (
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(251,191,36,0.3)] gap-2 transition-all hover:scale-105"
            onClick={handleUnlockFree}
          >
            <Sparkles className="w-5 h-5" /> Nhận Bình Giải Tổng Quan (Miễn Phí)
          </Button>
        </div>
      )}

      {showSummary && !hasPaid && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: "auto" }} 
          className="space-y-6"
        >
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Tổng Quan Lá Số
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && !completion ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="prose prose-invert prose-p:leading-relaxed max-w-none">
                  {completion || "Nhật chủ sinh không đắc lệnh, được một vài cát thần hỗ trợ nhưng toàn cục vẫn thiên về nhược. Dụng thần cần dùng Ấn tinh (Thủy) để sinh trợ. Hiện tại đang trong vận thiên về hỏa, cẩn trọng hao tài tốn của. Cụ thể chi tiết xin xem bản đầy đủ."}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Paywall */}
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-secondary to-background shadow-2xl relative">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="p-8 md:p-12 text-center space-y-6 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Mở Khóa Bản Luận Giải Chuyên Sâu</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Bản luận giải dài 5-7 trang A4 do AI cao cấp phân tích từng ngóc ngách của lá số, giúp bạn thấu hiểu thiên mệnh.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left mt-8">
                {[
                  "Phân tích Dụng thần & Hỷ kỵ chi tiết",
                  "Sự nghiệp & Tài lộc: Chọn nghề, thời điểm đầu tư",
                  "Tình duyên & Hôn nhân: Thời điểm kết hôn, tính cách bạn đời",
                  "Sức khỏe: Các lưu ý bệnh lý theo ngũ hành",
                  "Dự báo cát hung 10 Đại vận (100 năm)",
                  "Chi tiết lưu niên 3 năm kế tiếp"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <div className="text-4xl font-bold text-foreground mb-4">
                  99.000<span className="text-xl text-muted-foreground font-normal">đ</span>
                </div>
                <Button size="lg" className="h-14 px-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90" onClick={handlePay}>
                  Mở Khóa Ngay
                </Button>
                <p className="text-xs text-muted-foreground mt-4">Mua 1 lần, xem vĩnh viễn lá số này. Thanh toán tự động 24/7.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {hasPaid && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex justify-end mb-4">
             <Button variant="outline" className="border-primary/50 text-primary gap-2">
               <Download className="w-4 h-4" /> Tải PDF Bản Luận Giải
             </Button>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Bình Giải Chi Tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && !completion ? (
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Sparkles className="w-4 h-4 animate-spin text-primary" /> 
                      <span className="text-sm font-medium animate-pulse">AI đang phân tích và viết luận giải... (có thể mất 1-2 phút)</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
                      <div className="h-4 bg-white/5 rounded w-4/6 animate-pulse"></div>
                    </div>
                 </div>
              ) : (
                <div className="prose prose-invert prose-primary max-w-none whitespace-pre-wrap">
                  {completion || "Đây là nội dung bản luận giải chi tiết sau khi đã mở khóa. Hệ thống sẽ load từ AI chain..."}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
