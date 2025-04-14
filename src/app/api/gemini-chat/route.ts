import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, history } = await req.json();

  const prompt = `
You are a helpful real-estate assistant. Answer based on flat listings and user concerns.

Chat History:
${history.map((m: any) => `${m.role}: ${m.content}`).join("\n")}

User: ${message}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't understand that.";

  return NextResponse.json({ reply: text });
}
