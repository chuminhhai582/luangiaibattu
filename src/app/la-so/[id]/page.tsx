import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AlertCircle, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResultClientView from "./ResultClientView";

export default async function LaSoPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();

  const { data: chartRecord, error } = await supabase
    .from("charts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !chartRecord) {
    return notFound();
  }

  const chart = chartRecord.chart_json;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/[0.06] via-accent/[0.02] to-transparent" />
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-24 pb-12 space-y-10 sm:space-y-14">
        {/* ═══════ Header ═══════ */}
        <header className="text-center space-y-5">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/[0.1] border border-primary/20 glow-gold">
            <span className="text-3xl">☯</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Lá Số <span className="text-gradient-gold">Bát Tự</span>
          </h1>

          {/* Birth info */}
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <p className="flex items-center gap-2 text-sm sm:text-base">
              <Clock className="w-4 h-4 shrink-0" />
              {chart.meta.solar_datetime} (Dương lịch)
            </p>
            <p className="text-sm text-muted-foreground/60">{chart.meta.lunar_date}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-white/[0.1] bg-white/[0.03] backdrop-blur-sm text-xs">
              <User className="w-3 h-3 mr-1" /> {chart.meta.gender === "nam" ? "Nam" : "Nữ"}
            </Badge>
            <Badge variant="outline" className="border-white/[0.1] bg-white/[0.03] backdrop-blur-sm text-xs">
              Giờ Tý: {chart.meta.zi_hour_sect === 1 ? "Sớm" : "Muộn"}
            </Badge>
            {chart.meta.solar_time_corrected && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                ☀️ Giờ Mặt Trời
              </Badge>
            )}
          </div>

          {/* Jieqi Warning */}
          {chart.meta.near_jieqi_warning && (
            <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-medium bg-amber-500/[0.08] p-3 rounded-xl max-w-xl mx-auto border border-amber-500/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Lá số nhạy cảm: Sinh gần thời điểm giao tiết khí (±2h). Cần cẩn trọng khi xác định tháng sinh.</span>
            </div>
          )}
        </header>

        {/* ═══════ Client-rendered sections (Pillars, Charts, Interpret) ═══════ */}
        <ResultClientView chart={chart} chartId={params.id} />
      </main>

      <Footer />
    </div>
  );
}
