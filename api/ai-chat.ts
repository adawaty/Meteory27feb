import type { VercelRequest, VercelResponse } from "@vercel/node";

// Vercel Node Function: /api/ai-chat
// Uses OpenRouter via process.env.OPENROUTER_API_KEY (do NOT hardcode keys).

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basic CORS support (for local/dev + embeds)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const apiKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTER_KEY ||
    process.env.OPENROUTER_API_TOKEN ||
    process.env.OPENROUTER_TOKEN;

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      error:
        "OpenRouter key missing. Set OPENROUTER_API_KEY (recommended) in Vercel Environment Variables (Production + Preview).",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const model = String(body?.model || "openai/gpt-4o-mini");
    const temperature =
      typeof body?.temperature === "number" ? body.temperature : body?.temperature ? Number(body.temperature) : 0.4;

    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
    const prompt = typeof body?.prompt === "string" ? body.prompt : null;

    // Allow a simple prompt payload for convenience
    const finalMessages: ChatMessage[] = messages.length
      ? messages
      : prompt
        ? [{ role: "user", content: prompt }]
        : [];

    if (!finalMessages.length) {
      return res.status(400).json({ success: false, error: "messages or prompt required" });
    }

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // Optional but recommended by OpenRouter for attribution/analytics
        "HTTP-Referer": req.headers.origin || req.headers.referer || "https://meteory27feb.vercel.app",
        "X-Title": "Meteory",
      },
      body: JSON.stringify({
        model,
        temperature,
        messages: finalMessages,
      }),
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      const msg =
        (data && (data?.error?.message || data?.error || data?.message)) ||
        `OpenRouter error (${upstream.status})`;
      return res.status(upstream.status).json({ success: false, error: msg, details: data });
    }

    const content = data?.choices?.[0]?.message?.content ?? "";

    return res.status(200).json({
      success: true,
      model: data?.model || model,
      content,
    });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ success: false, error: e?.message || "Server error" });
  }
}
