import { generateObject, generateText, streamText } from 'ai';
import { anthropic } from './client';
import { z } from 'zod';
import { BaziChartJSON } from '../bazi/types';
import { STEP1_PROMPT, STEP2_PROMPT, STEP25_SUMMARY_PROMPT, STEP3_PROMPT, STEP4_PROMPT, STEP5_PROMPT } from './prompts/step1-5';

const MODEL_NAME = 'claude-3-5-sonnet-20241022'; // or read from settings

export async function runStep1(chart: BaziChartJSON) {
  const result = await generateObject({
    model: anthropic(MODEL_NAME),
    system: STEP1_PROMPT,
    prompt: JSON.stringify(chart),
    schema: z.object({
      strength_conclusion: z.string(),
      geju: z.string(),
      reasoning: z.string(),
      evidence: z.array(z.string())
    }),
    temperature: 0.2,
  });
  return result.object;
}

export async function runStep2(chart: BaziChartJSON, step1Output: any) {
  const result = await generateObject({
    model: anthropic(MODEL_NAME),
    system: STEP2_PROMPT,
    prompt: `CHART: ${JSON.stringify(chart)}\n\nSTEP 1 OUTPUT: ${JSON.stringify(step1Output)}`,
    schema: z.object({
      yong_shen: z.string(),
      xi_shen: z.string(),
      ji_shen: z.string(),
      method: z.string(),
      reasoning: z.string(),
      evidence: z.array(z.string())
    }),
    temperature: 0.2,
  });
  return result.object;
}

export async function runStep25Summary(chart: BaziChartJSON, step1Output: any, step2Output: any) {
  const result = await generateObject({
    model: anthropic(MODEL_NAME),
    system: STEP25_SUMMARY_PROMPT,
    prompt: `CHART: ${JSON.stringify(chart)}\n\nSTEP 1: ${JSON.stringify(step1Output)}\n\nSTEP 2: ${JSON.stringify(step2Output)}`,
    schema: z.object({
      summary_md: z.string(),
      teaser_points: z.array(z.string())
    }),
    temperature: 0.7,
  });
  return result.object;
}

// Step 3 and 4 are often streamed, so we export functions that return streams or just generate objects
// The blueprint says "Output structured của bước (bước 3-4 chứa cả markdown bài viết) - STREAM về client"
// In Vercel AI SDK, streamObject can stream structured data.
export async function streamStep3(chart: BaziChartJSON, step1Output: any, step2Output: any) {
  // Using generateText for simpler markdown streaming, or streamObject if strict JSON is needed
  return streamText({
    model: anthropic(MODEL_NAME),
    system: STEP3_PROMPT,
    prompt: `CHART: ${JSON.stringify(chart)}\nSTEP 2: ${JSON.stringify(step2Output)}\n\nYêu cầu trả về bài luận chi tiết 5 lĩnh vực (tính cách, sự nghiệp, tài lộc, hôn nhân, sức khỏe) bằng Markdown.`,
    temperature: 0.7,
  });
}

export async function runStep5Verification(chart: BaziChartJSON, allOutputs: any) {
  const result = await generateObject({
    model: anthropic(MODEL_NAME),
    system: STEP5_PROMPT,
    prompt: `CHART: ${JSON.stringify(chart)}\n\nALL PREVIOUS OUTPUTS: ${JSON.stringify(allOutputs)}`,
    schema: z.object({
      passed: z.boolean(),
      issues: z.array(z.object({
        location: z.string(),
        problem: z.string(),
        severity: z.string()
      }))
    }),
    temperature: 0.0,
  });
  return result.object;
}
