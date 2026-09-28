import { after } from 'next/server';
import { ToolLoopAgent, tool, isStepCount } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import { langfuseSpanProcessor } from '@/src/otel/langfuse';

export const maxDuration = 60; // Hobby: максимум 300 с

// Шлюз OpenRouter замість Gemini: безкоштовний рівень Gemini вичерпувався (20 запитів/добу) і віддавав 503.
// Id :free-моделі — зі змінної, бо список безкоштовних моделей змінюється.
// Без ?? '' строгий tsconfig не пропустить undefined (exactOptionalPropertyTypes).
const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY ?? '' });

const agent = new ToolLoopAgent({
  model: openrouter.chat(process.env.OPENROUTER_MODEL ?? 'qwen/qwen3.8-27b:free'),
  maxRetries: 0, // на безкоштовному рівні кожен повтор — ще один запит із денного ліміту
  instructions: 'Для поточного часу використовуй інструмент getTime.',
  tools: {
    getTime: tool({
      description: 'Поточний час сервера (ISO 8601)',
      inputSchema: z.object({}),
      execute: async () => ({ now: new Date().toISOString() }),
    }),
  },
  stopWhen: isStepCount(3), // мінімальний запобіжник: не більше трьох кроків на запит
  telemetry: { functionId: 'lab01-agent' },
});

export async function POST(req: Request) {
  // Реєструємо ДО виклику моделі: after() спрацює і тоді, коли обробник кинув помилку.
  after(async () => {
    await langfuseSpanProcessor.forceFlush();
  });

  const body = (await req.json().catch(() => ({}))) as { prompt?: unknown };
  const prompt = typeof body.prompt === 'string' ? body.prompt : 'Котра зараз година?';

  try {
    const result = await agent.generate({ prompt });
    return Response.json({ text: result.text, usage: result.usage });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
