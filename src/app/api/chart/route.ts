import { NextResponse } from 'next/server';
import { buildChart } from '@/lib/bazi/engine';
import { generateChartHash } from '@/lib/bazi/hash';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Calculate the chart
    const chartJSON = buildChart({
      birth_date: body.birth_date,
      birth_time: body.birth_time,
      calendar_type: body.calendar_type || 'solar',
      gender: body.gender,
      province_code: body.province_code || 'HN',
      use_solar_time: body.use_solar_time || false,
      zi_hour_sect: body.zi_hour_sect || 2,
    });

    // Generate hash
    const eightCharString = `${chartJSON.pillars.year.gan}${chartJSON.pillars.year.zhi}${chartJSON.pillars.month.gan}${chartJSON.pillars.month.zhi}${chartJSON.pillars.day.gan}${chartJSON.pillars.day.zhi}${chartJSON.pillars.hour.gan}${chartJSON.pillars.hour.zhi}`;
    
    const chartHash = generateChartHash(
      eightCharString,
      chartJSON.meta.gender,
      chartJSON.da_yun.start_age,
      chartJSON.da_yun.direction,
      chartJSON.engine_version
    );

    // Get current user if any
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Insert into DB using admin client to bypass RLS issues for anonymous, or just rely on RLS
    // The blueprint says "Anyone can insert charts", so normal client is fine.
    const { data, error } = await supabase
      .from('charts')
      .insert({
        user_id: user?.id || null,
        input: body,
        normalized_datetime: chartJSON.meta.solar_datetime,
        chart_json: chartJSON,
        chart_hash: chartHash,
        near_jieqi_warning: chartJSON.meta.near_jieqi_warning,
        engine_version: chartJSON.engine_version
      })
      .select('id')
      .single();

    if (error) {
      console.error("DB Error:", error);
      return NextResponse.json({ error: "Lỗi lưu dữ liệu lá số" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      chart_id: data.id, 
      chart_json: chartJSON,
      chart_hash: chartHash
    });

  } catch (err: any) {
    console.error("Calculation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
