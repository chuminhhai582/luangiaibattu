import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InterpretSection from "./InterpretSection";
import { AlertCircle, Clock, MapPin } from "lucide-react";

const getElementColorClass = (name: string) => {
  const wood = ["Giáp", "Ất", "Dần", "Mão", "Mộc"];
  const fire = ["Bính", "Đinh", "Tỵ", "Ngọ", "Hỏa"];
  const earth = ["Mậu", "Kỷ", "Thìn", "Tuất", "Sửu", "Mùi", "Thổ"];
  const metal = ["Canh", "Tân", "Thân", "Dậu", "Kim"];
  const water = ["Nhâm", "Quý", "Hợi", "Tý", "Thủy"];

  if (wood.includes(name)) return "text-element-wood bg-element-wood";
  if (fire.includes(name)) return "text-element-fire bg-element-fire";
  if (earth.includes(name)) return "text-element-earth bg-element-earth";
  if (metal.includes(name)) return "text-element-metal bg-element-metal";
  if (water.includes(name)) return "text-element-water bg-element-water";
  return "text-muted-foreground bg-muted";
};

const getTextColorClass = (name: string) => {
  const wood = ["Giáp", "Ất", "Dần", "Mão", "Mộc"];
  const fire = ["Bính", "Đinh", "Tỵ", "Ngọ", "Hỏa"];
  const earth = ["Mậu", "Kỷ", "Thìn", "Tuất", "Sửu", "Mùi", "Thổ"];
  const metal = ["Canh", "Tân", "Thân", "Dậu", "Kim"];
  const water = ["Nhâm", "Quý", "Hợi", "Tý", "Thủy"];

  if (wood.includes(name)) return "text-element-wood";
  if (fire.includes(name)) return "text-element-fire";
  if (earth.includes(name)) return "text-element-earth";
  if (metal.includes(name)) return "text-element-metal";
  if (water.includes(name)) return "text-element-water";
  return "text-foreground";
};

export default async function LaSoPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  
  const { data: chartRecord, error } = await supabase
    .from('charts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !chartRecord) {
    return notFound();
  }

  const chart = chartRecord.chart_json;

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10" />

      <main className="max-w-5xl mx-auto px-4 pt-12 space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-2">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Lá Số Bát Tự</h1>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {chart.meta.solar_datetime} (Dương Lịch)
            </p>
            <p className="text-sm">{chart.meta.lunar_date}</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-primary/30 bg-background/50 backdrop-blur-sm">Giới tính: {chart.meta.gender}</Badge>
            <Badge variant="outline" className="border-primary/30 bg-background/50 backdrop-blur-sm">Giờ Tý: {chart.meta.zi_hour_sect}</Badge>
            {chart.meta.solar_time_corrected && (
              <Badge variant="secondary" className="bg-primary/20 text-primary">Giờ Mặt trời (Hiệu chỉnh)</Badge>
            )}
          </div>

          {chart.meta.near_jieqi_warning && (
            <div className="flex items-center justify-center gap-2 text-amber-500 mt-4 text-sm font-medium bg-amber-500/10 p-3 rounded-lg max-w-xl mx-auto border border-amber-500/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Lá số nhạy cảm: Sinh gần thời điểm giao tiết khí (±2h). Cần cẩn trọng khi xác định tháng sinh.</span>
            </div>
          )}
        </header>

        {/* Four Pillars */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-[1px] bg-primary/50" />
            Bảng Tứ Trụ
            <div className="flex-1 h-[1px] bg-primary/20" />
          </h2>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            <PillarCard title="NĂM" pillar={chart.pillars.year} />
            <PillarCard title="THÁNG" pillar={chart.pillars.month} />
            <PillarCard title="NGÀY (NHẬT CHỦ)" pillar={chart.pillars.day} highlight={true} />
            <PillarCard title="GIỜ" pillar={chart.pillars.hour} />
          </div>
        </section>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Cường Nhược & Ngũ Hành</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-background/50 border border-white/5">
                <span className="text-muted-foreground">Trạng thái Nhật Chủ</span>
                <span className="font-bold text-lg text-primary">{chart.strength.label}</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-2">Phân bổ Ngũ Hành (Ước lượng)</div>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                  {Object.entries(chart.five_elements?.count || { Mộc: 2, Hỏa: 2, Thổ: 2, Kim: 1, Thủy: 1 }).map(([el, count]) => {
                    const width = `${((count as number) / 8) * 100}%`;
                    const colorClass = getElementColorClass(el).split(' ')[1]; // get bg class
                    return count ? <div key={el} style={{ width }} className={colorClass} title={`${el}: ${count}`} /> : null;
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Mộc</span><span>Hỏa</span><span>Thổ</span><span>Kim</span><span>Thủy</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Đại Vận (10 Năm)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Khởi vận năm {chart.da_yun.start_year} ({chart.da_yun.start_age} tuổi), chiều <strong>{chart.da_yun.direction}</strong>.
              </p>
              {/* Horizontal Scroll Da Yun */}
              <div className="flex gap-2 overflow-x-auto pb-4 snap-x custom-scrollbar">
                {chart.da_yun.list.map((yun: any) => (
                  <div key={yun.index} className="shrink-0 w-24 p-3 rounded-xl bg-background/50 border border-white/5 text-center snap-center">
                    <div className="text-xs text-muted-foreground mb-1">{yun.from_year}</div>
                    <div className="font-bold flex flex-col">
                      <span className={getTextColorClass(yun.gan_zhi.charAt(0))}>{yun.gan_zhi.charAt(0)}</span>
                      <span className={getTextColorClass(yun.gan_zhi.charAt(1))}>{yun.gan_zhi.charAt(1)}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-2">{yun.from_age}t - {yun.to_age}t</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Interpret Section */}
        <section className="pt-8">
           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-[1px] bg-primary/50" />
            Luận Giải Chuyên Sâu bằng AI
            <div className="flex-1 h-[1px] bg-primary/20" />
          </h2>
          <InterpretSection chartId={params.id} />
        </section>

      </main>
    </div>
  );
}

function PillarCard({ title, pillar, highlight = false }: { title: string, pillar: any, highlight?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center p-2 md:p-4 rounded-xl border ${highlight ? 'bg-primary/5 border-primary/50 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'bg-background/40 border-white/5'} backdrop-blur-sm`}>
      {highlight && <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">Nhật Chủ</div>}
      
      <div className="text-[10px] md:text-xs text-muted-foreground mb-3 font-medium tracking-widest uppercase">{title}</div>
      
      <div className="w-full space-y-4 text-center">
        <div className="space-y-1">
          <div className="text-[10px] md:text-xs text-muted-foreground/70 h-4">{pillar.shi_shen_gan}</div>
          <div className={`text-3xl md:text-5xl font-bold ${getTextColorClass(pillar.gan)}`}>{pillar.gan}</div>
        </div>
        
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="space-y-1">
          <div className={`text-3xl md:text-5xl font-bold ${getTextColorClass(pillar.zhi)}`}>{pillar.zhi}</div>
          <div className="flex justify-center gap-1.5 h-4">
            {pillar.hide_gan.map((g: string, i: number) => (
              <span key={i} className={`text-[10px] md:text-xs ${getTextColorClass(g)}`}>{g}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 w-full border-t border-white/5 text-center">
        <div className="text-[10px] text-muted-foreground truncate" title={pillar.na_yin}>{pillar.na_yin}</div>
      </div>
    </div>
  );
}
