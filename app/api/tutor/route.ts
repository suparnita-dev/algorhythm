import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

import { createSupabaseServerClient } from "@/lib/server/supabase";

const tutorSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  topic: z.string().trim().min(1).max(80).optional(),
  step: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const input = tutorSchema.parse(await request.json());
    let response = "Break the problem into input, state, transition, and stopping condition. I can guide each part without giving away the whole answer.";
    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: "You are AlgoRhythm's concise DSA tutor. Give hints and reasoning, not complete homework answers. Use the learner's current topic and step.",
        prompt: `Topic: ${input.topic ?? "DSA"}\nCurrent step: ${input.step ?? "unknown"}\nLearner question: ${input.message}`,
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
            : response;
    }

    return NextResponse.json({ response, provider: process.env.OPENAI_API_KEY ? "openai" : "local-tutor" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Tutor messages must be between 1 and 1000 characters." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to reach the tutor." }, { status: 500 });
  }
}
