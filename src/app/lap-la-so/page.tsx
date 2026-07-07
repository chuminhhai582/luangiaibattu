"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Sparkles, ChevronDown, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import provinces from "../../../data/vn-provinces.json";

export default function LapLaSoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    birth_date: "1990-01-01",
    birth_time: "12:00",
    calendar_type: "solar",
    gender: "nam",
    province_code: "HN",
    use_solar_time: false,
    zi_hour_sect: 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/la-so/${data.chart_id}`);
      } else {
        alert("Lỗi: " + data.error);
        setLoading(false);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi kết nối");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/[0.1] border border-primary/20 flex items-center justify-center glow-gold">
                <Compass className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Lập Lá Số Bát Tự</h1>
            <p className="text-muted-foreground">Nhập thông tin sinh để khám phá vận mệnh của bạn</p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-6 sm:p-8 noise-overlay relative overflow-hidden">
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Row 1: Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-medium text-foreground/80">Ngày sinh</Label>
                  <Input
                    type="date"
                    required
                    className="h-11 bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary/50 focus-visible:border-primary/30"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-medium text-foreground/80">Giờ sinh</Label>
                  <Input
                    type="time"
                    required
                    className="h-11 bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary/50 focus-visible:border-primary/30"
                    value={formData.birth_time}
                    onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: Gender + Calendar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-medium text-foreground/80">Giới tính</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                    <SelectTrigger className="h-11 bg-white/[0.04] border-white/[0.08] focus:ring-primary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nam">Nam</SelectItem>
                      <SelectItem value="nữ">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-medium text-foreground/80">Loại lịch</Label>
                  <Select value={formData.calendar_type} onValueChange={(v) => setFormData({ ...formData, calendar_type: v })}>
                    <SelectTrigger className="h-11 bg-white/[0.04] border-white/[0.08] focus:ring-primary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solar">Dương lịch</SelectItem>
                      <SelectItem value="lunar">Âm lịch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Province */}
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Nơi sinh (Tỉnh/Thành phố)</Label>
                <Select value={formData.province_code} onValueChange={(v) => setFormData({ ...formData, province_code: v })}>
                  <SelectTrigger className="h-11 bg-white/[0.04] border-white/[0.08] focus:ring-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {provinces.map((p: any) => (
                      <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Options Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`} />
                <span>Tùy chọn nâng cao</span>
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  {/* Solar time toggle */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.use_solar_time}
                        onChange={(e) => setFormData({ ...formData, use_solar_time: e.target.checked })}
                      />
                      <div className="w-10 h-5 rounded-full bg-white/10 peer-checked:bg-primary/60 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Giờ Mặt Trời thực (True Solar Time)</span>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        Hiệu chỉnh theo kinh độ nơi sinh. Khuyến nghị bật.
                      </p>
                    </div>
                  </label>

                  {/* Zi hour sect */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Quy tắc giờ Tý</Label>
                    <Select
                      value={String(formData.zi_hour_sect)}
                      onValueChange={(v) => setFormData({ ...formData, zi_hour_sect: parseInt(v) })}
                    >
                      <SelectTrigger className="h-10 bg-white/[0.04] border-white/[0.08] focus:ring-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Giờ Tý muộn (23h→0h = ngày hiện tại)</SelectItem>
                        <SelectItem value="1">Giờ Tý sớm (23h→0h = ngày hôm sau)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-13 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" /> Đang tính toán...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Compass className="w-5 h-5" /> An Sao Lập Số
                  </span>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
