import { createAnthropic } from '@ai-sdk/anthropic';

const apiKey = process.env.ANTHROPIC_API_KEY || '';

export const anthropic = createAnthropic({
  apiKey,
});
