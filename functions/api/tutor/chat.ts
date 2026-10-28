// functions/api/tutor/chat.ts — Cloudflare Pages Function for Live Gemini Agentic Tutor
import { MioritaTutorProxy } from '../../../src/ai/mioritaTutorProxy';

export const onRequestPost = async (context: { request: Request; env: Record<string, string> }) => {
  try {
    const payload = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY || context.env.GOOGLE_API_KEY || '';
    const result = await MioritaTutorProxy.handleChatTurn(payload as any, apiKey);
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Tutor chat failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

