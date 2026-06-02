import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string.

Each question should be separated by '||'.

These questions are for an anonymous social messaging platform.

Avoid personal or sensitive topics.

Example:
What's a hobby you've recently started?||
If you could travel anywhere tomorrow, where would you go?||
What's a simple thing that makes you happy?
`;

export async function POST() {
  try {

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.8,
        max_tokens: 200,
      });

    const responseText =
      completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      data: responseText,
    });

  } catch (error) {

    console.error("Groq Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate messages",
      },
      { status: 500 }
    );
  }
}