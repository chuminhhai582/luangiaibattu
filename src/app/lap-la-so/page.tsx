"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Sparkles, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import provinces from "../../../data/vn-provinces.json";

export default function LapLaSoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-900/20 blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
              <Compass className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Lập Lá Số Bát Tự</h1>
          <p className="text-muted-foreground">Nhập thông tin sinh của bạn để khám phá vận mệnh</p>
        </div>

        <div className="glass-card p-8 relative overflow-hidden">
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-foreground/80">Ngày sinh</Label>
                <Input 
                  type="date" 
                  required 
                  className="bg-background/50 border-white/10 focus-visible:ring-primary"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-foreground/80">Giờ sinh</Label>
                <Input 
                  type="time" 
                  required 
                  className="bg-background/50 border-white/10 focus-visible:ring-primary"
                  value={formData.birth_time}
                  onChange={(e) => setFormData({...formData, birth_time: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-foreground/80">Giới tính</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                  <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nam">Nam</SelectItem>
                    <SelectItem value="nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-foreground/80">Loại lịch</Label>
                <Select value={formData.calendar_type} onValueChange={(v) => setFormData({...formData, calendar_type: v})}>
                  <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Dương lịch</SelectItem>
                    <SelectItem value="lunar">Âm lịch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-foreground/80">Nơi sinh (Tỉnh/Thành phố)</Label>
              <Select value={formData.province_code} onValueChange={(v) => setFormData({...formData, province_code: v})}>
                <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p: any) => (
                    <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="solar" 
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-background/50 text-primary focus:ring-primary focus:ring-offset-background"
                  checked={formData.use_solar_time}
                  onChange={(e) => setFormData({...formData, use_solar_time: e.target.checked})}
                />
                <div className="space-y-1">
                  <Label htmlFor="solar" className="cursor-pointer text-sm font-medium">
                    Hiệu chỉnh theo giờ Mặt Trời thực (True Solar Time)
                  </Label>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Khuyến nghị bật để tăng độ chính xác của giờ sinh.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 text-base font-semibold transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> Đang tính toán...
                </span>
              ) : "An Sao Lập Số"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
