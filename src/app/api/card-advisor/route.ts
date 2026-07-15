import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkBotId } from "botid/server";
import { checkLimit, getClientIp } from "@/lib/rateLimit";
import {
  ADVISOR_MODEL,
  MAX_MESSAGE_LENGTH,
  MAX_TURNS,
  buildSystemPrompt,
  extractRecommendation,
} from "@/lib/creditCardAdvisor";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const verification = await checkBotId();
  console.log("[botid] /api/card-advisor", JSON.stringify(verification));
  if (verification.isBot) {
    return NextResponse.json({ error: "Request blocked" }, { status: 403 });
  }

  const ip = getClientIp(request.headers);
  // A full wizard session is ~4-5 round trips; 20/10min per IP comfortably
  // allows a few real sessions while bounding worst-case API spend.
  if (!checkLimit(`card-advisor:${ip}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests, try again shortly" }, { status: 429 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Advisor is not configured yet" },
      { status: 503 }
    );
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const messages = body.messages as ChatMessage[];

  if (messages.length === 0 || messages.length > MAX_TURNS) {
    return NextResponse.json({ error: "Invalid conversation length" }, { status: 400 });
  }

  for (const m of messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json({ error: "Invalid message payload" }, { status: 400 });
    }
  }

  if (messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
  }

  const forceRecommendationNow = messages.length >= MAX_TURNS - 1;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: ADVISOR_MODEL,
      max_tokens: 350,
      messages: [
        { role: "system", content: buildSystemPrompt(forceRecommendationNow) },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const rawText = response.choices[0]?.message?.content ?? "";

    if (!rawText) {
      return NextResponse.json({ error: "Advisor gave an empty response" }, { status: 502 });
    }

    const { displayText, slug } = extractRecommendation(rawText);

    return NextResponse.json({ reply: displayText, recommendedSlug: slug });
  } catch (err) {
    console.error("[card-advisor] OpenAI API error", err);
    return NextResponse.json({ error: "Advisor is temporarily unavailable" }, { status: 502 });
  }
}
