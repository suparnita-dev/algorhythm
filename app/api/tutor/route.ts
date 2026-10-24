import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

import { sessionCookieName, userFromSession } from "@/lib/server/auth";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();
const configuredOpenAIKey = process.env.OPENAI_API_KEY?.trim();
const hasOpenAI = Boolean(
  configuredOpenAIKey &&
  configuredOpenAIKey !== "sk-your-key" &&
  configuredOpenAIKey !== "your-openai-key"
);

const tutorSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  topic: z.string().trim().min(1).max(80).optional(),
  step: z.string().trim().max(500).optional(),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(2000),
  })).max(12).optional(),
});

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const sessionToken = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`))?.[1];
  const authenticated = Boolean(userFromSession(sessionToken));
  if (!authenticated && hasOpenAI) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recentRequests = (requestLog.get(clientKey) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Tutor rate limit reached. Please wait a minute before trying again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  recentRequests.push(now);
  requestLog.set(clientKey, recentRequests);

  try {
    const input = tutorSchema.parse(await request.json());
    let response = authenticated
      ? "Break the problem into input, state, transition, and stopping condition. I can guide each part without giving away the whole answer."
      : "You are using the local tutor. Sign in and configure OPENAI_API_KEY to enable personalized AI responses.";
    if (hasOpenAI && configuredOpenAIKey) {
      const openai = createOpenAI({ apiKey: configuredOpenAIKey });
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: `You are AlgoRhythm, a helpful conversational AI learning companion.
Answer the learner's actual question directly, like a high-quality general-purpose assistant.
You can explain DSA, programming, algorithms, debugging, complexity, interview preparation, and related concepts.
Use the current workspace context when relevant, but do not force every answer to be about DSA.
Be accurate, clear, and conversational. Adapt detail to the question.
For code, provide readable examples and explain important lines.
For educational questions, guide the learner without refusing to explain unless they explicitly ask for a graded assessment answer.
Never claim to have run code or accessed files unless the request includes the result.

Current topic: ${input.topic ?? "none"}
Current execution step: ${input.step ?? "none"}`,
        messages: input.messages?.length
          ? input.messages.map((message) => ({
              role: message.role,
              content: message.content,
            }))
          : [{ role: "user" as const, content: input.message }],
        maxOutputTokens: 900,
      });
      response = result.text;
    } else {
      const lowerMessage = input.message.toLowerCase();
      response = lowerMessage.includes("complex")
        ? `${input.topic ?? "This topic"} becomes easier to analyze when you identify the dominant loop or recursion. Start from the current step and count how the work grows with input size.`
        : lowerMessage.includes("hint")
          ? "Trace one state or pointer at a time. Before changing it, say which invariant must remain true."
          : lowerMessage.includes("why")
            ? `Use the current step as evidence: ${input.step ?? "highlighted values show the active operation"}. Explain what the algorithm preserves before asking what changes next.`
          : `I can help with that. For ${input.topic ?? "this question"}, start by stating the goal, the input, and what should be true after each step. If you share your code or expected output, I can reason through it with you.`;
    }

    return NextResponse.json({ response, provider: hasOpenAI ? "openai" : "local-tutor" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Tutor messages must be between 1 and 1000 characters." }, { status: 400 });
    }
    return NextResponse.json({
      response: "The live AI provider is unavailable, so I switched to local guidance. Trace the highlighted step, identify the invariant it preserves, and ask what changes next.",
      provider: "local-tutor-fallback",
    });
  }
}
