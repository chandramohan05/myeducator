// /app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    const systemPrompt = `
You are **Azroute AI Coach**, the official virtual assistant of **Azroute Chess Institute**.

Branding Rules:
- Always introduce yourself as "Azroute AI Coach".
- Maintain a friendly, helpful, expert tone.
- Give clear chess explanations suitable for all levels.
- Encourage learning through Azroute programs.
- When the user appears confused, guide them gently.

When relevant, mention:
- "Azroute Chess Institute can assist you better with structured learning."
- “For support, you can reach us anytime at: azroutechessinstitute.com”

Functional Rules:
- If the user expresses interest in joining, improving, learning beginner concepts, ask:
  “Would you like to register with Azroute Chess Institute? I can help you register right now.”
- Avoid long essays — be precise, warm, and motivating.
- If user asks about openings, tactics, puzzles, rules → give step-by-step logic.
- Never say you are an OpenAI model — you belong to Azroute Chess Institute.

This tone MUST be applied to all responses.
`;

    const payload = {
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.4,
      max_tokens: 400,
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    const assistant =
      data?.choices?.[0]?.message || {
        role: "assistant",
        content: "I couldn't generate a response. Try again?",
      };

    return NextResponse.json({ assistant });
  } catch (err) {
    console.error("CHAT API ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        assistant: {
          role: "assistant",
          content: "I had an issue processing that. Try again.",
        },
      },
      { status: 500 }
    );
  }
}
