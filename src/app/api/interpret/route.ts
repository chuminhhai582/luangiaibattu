import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { runStep1, runStep2, runStep25Summary, streamStep3 } from '@/lib/ai/chain';

export const maxDuration = 120; // Vercel function timeout limit for long AI requests

export async function POST(req: Request) {
  try {
    const { chart_id, tier = 'free' } = await req.json();

    const supabase = createAdminClient();
    
    // Fetch chart
    const { data: chartRecord, error: chartError } = await supabase
      .from('charts')
      .select('*')
      .eq('id', chart_id)
      .single();

    if (chartError || !chartRecord) {
      return NextResponse.json({ error: "Không tìm thấy lá số" }, { status: 404 });
    }

    const chartJSON = chartRecord.chart_json;
    const chartHash = chartRecord.chart_hash;
    const PROMPT_VERSION = "v1";

    // Helper to check cache
    const checkCache = async (step: number) => {
      const { data } = await supabase
        .from('interpretations')
        .select('content_json')
        .eq('chart_hash', chartHash)
        .eq('step', step)
        .eq('prompt_version', PROMPT_VERSION)
        .single();
      return data ? data.content_json : null;
    };

    // Helper to save cache
    const saveCache = async (step: number, content: any, model: string = "claude-3-5-sonnet-20241022") => {
      await supabase.from('interpretations').insert({
        chart_hash: chartHash,
        step,
        content_json: content,
        model,
        prompt_version: PROMPT_VERSION
      }).upsert({ chart_hash: chartHash, step, prompt_version: PROMPT_VERSION } as any);
    };

    // Run Step 1
    let step1Output = await checkCache(1);
    if (!step1Output) {
      step1Output = await runStep1(chartJSON);
      await saveCache(1, step1Output);
    }

    // Run Step 2
    let step2Output = await checkCache(2);
    if (!step2Output) {
      step2Output = await runStep2(chartJSON, step1Output);
      await saveCache(2, step2Output);
    }

    if (tier === 'free') {
      // Run Step 2.5 (Summary)
      let summaryOutput = await checkCache(25);
      if (!summaryOutput) {
        summaryOutput = await runStep25Summary(chartJSON, step1Output, step2Output);
        await saveCache(25, summaryOutput);
      }
      return NextResponse.json({
        tier: 'free',
        step1: step1Output,
        step2: step2Output,
        summary: summaryOutput
      });
    }

    // For PAID tier (Full Reading)
    if (tier === 'full') {
      // Return a streaming response using Vercel AI SDK
      // Note: In a real implementation, you'd check `entitlements` here to ensure they paid.
      
      const stream = await streamStep3(chartJSON, step1Output, step2Output);
      return stream.toDataStreamResponse();
    }

    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  } catch (err: any) {
    console.error("Interpret Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
