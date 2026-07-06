"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
      }
    } catch (error) {
      alert("Đã xảy ra lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Lập Lá Số Bát Tự</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày sinh</Label>
                <Input 
                  type="date" 
                  required 
                  value={formData.birth_date}
                  onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Giờ sinh</Label>
                <Input 
                  type="time" 
                  required 
                  value={formData.birth_time}
                  onChange={(e) => setFormData({...formData, birth_time: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nam">Nam</SelectItem>
                    <SelectItem value="nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Loại lịch</Label>
                <Select value={formData.calendar_type} onValueChange={(v) => setFormData({...formData, calendar_type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Dương lịch</SelectItem>
                    <SelectItem value="lunar">Âm lịch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nơi sinh (Tỉnh/Thành phố)</Label>
              <Select value={formData.province_code} onValueChange={(v) => setFormData({...formData, province_code: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {provinces.map((p: any) => (
                    <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="solar" 
                checked={formData.use_solar_time}
                onChange={(e) => setFormData({...formData, use_solar_time: e.target.checked})}
              />
              <Label htmlFor="solar" className="cursor-pointer">Hiệu chỉnh theo giờ Mặt trời thực (True Solar Time)</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang lập lá số..." : "Lập Lá Số"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
