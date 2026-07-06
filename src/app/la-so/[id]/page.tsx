import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InterpretSection from "./InterpretSection"; // We will create this client component

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
    <main className="min-h-screen p-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Lá Số Bát Tự</h1>
        <p className="text-muted-foreground">
          {chart.meta.solar_datetime} (Dương) • {chart.meta.lunar_date} (Âm)
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <Badge variant="outline">Giới tính: {chart.meta.gender}</Badge>
          <Badge variant="outline">Giờ Tý: {chart.meta.zi_hour_sect}</Badge>
          {chart.meta.solar_time_corrected && <Badge variant="secondary">Giờ Mặt trời</Badge>}
        </div>
        {chart.meta.near_jieqi_warning && (
          <div className="text-destructive mt-2 text-sm font-semibold">
            ⚠️ Lá số nhạy cảm với sai số giờ sinh — sinh gần thời điểm giao tiết khí.
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Năm */}
        <PillarCard title="NĂM" pillar={chart.pillars.year} />
        {/* Tháng */}
        <PillarCard title="THÁNG" pillar={chart.pillars.month} />
        {/* Ngày */}
        <PillarCard title="NGÀY (NHẬT CHỦ)" pillar={chart.pillars.day} highlight={true} />
        {/* Giờ */}
        <PillarCard title="GIỜ" pillar={chart.pillars.hour} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cường Nhược & Ngũ Hành</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Điểm cường nhược: <strong>{chart.strength.score.toFixed(2)}</strong> ({chart.strength.label})</p>
          <p className="mt-2">Đại vận khởi từ năm {chart.da_yun.start_year} ({chart.da_yun.start_age} tuổi), chiều {chart.da_yun.direction}</p>
        </CardContent>
      </Card>

      {/* Client component for AI interpretation */}
      <InterpretSection chartId={params.id} />

    </main>
  );
}

function PillarCard({ title, pillar, highlight = false }: { title: string, pillar: any, highlight?: boolean }) {
  return (
    <Card className={highlight ? "border-primary shadow-md" : ""}>
      <CardHeader className="text-center p-4">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4 p-4 pt-0">
        <div>
          <div className="text-2xl font-bold">{pillar.gan}</div>
          <div className="text-xs text-muted-foreground">{pillar.shi_shen_gan}</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{pillar.zhi}</div>
          <div className="text-xs text-muted-foreground flex justify-center gap-1">
            {pillar.hide_gan.map((g: string) => <span key={g}>{g}</span>)}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{pillar.na_yin}</div>
      </CardContent>
    </Card>
  );
}
