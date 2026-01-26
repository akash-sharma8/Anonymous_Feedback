import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const prompt =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

export async function POST() {
  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    let fullText = "";

    for await (const chunk of stream) {
      fullText += chunk?.text ?? "";
    }

    if (!fullText.trim()) {
      return NextResponse.json(
        { success: false, message: "Empty response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Messages generated successfully",
      data: fullText,
    });

  } catch (error: any) {
    console.error("Gemini error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate messages",
      },
      { status: 500 }
    );
  }
}
