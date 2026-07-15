import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { toolDefinitions, executeTool } from "@/lib/tools";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant for CashingTech, an electronics trade-in marketplace. You help users with:

1. **Selling process**: Users can sell phones, tablets, laptops, etc. for cash. Process: Get quote → Ship free → Get paid.
2. **Categories**: Phones, Tablets, Laptops, Smartwatches, Headphones, Game Consoles, iPods, and more.
3. **Condition tiers**: Brand New, Flawless, Very Good, Good, Fair, Broken — each with a different price.
4. **Payment methods**: Check, PayPal, Zelle, ACH (for bulk), Wire (for bulk).
5. **Shipping**: Free shipping label via FedEx or UPS. Devices must be shipped within 21 days of quote.
6. **Timeline**: Device received → inspected (24-48h) → payment sent (24-48h after approval).
7. **Bulk/ITAD**: For 20+ devices, bulk pricing available. Dedicated account manager.
8. **Affiliate program**: 10% commission via ShareASale.
9. **Support**: Contact form on the website.

Use the available tools to look up real data from the database when answering questions about categories, brands, devices, prices, conditions, and order status. When displaying prices, always show them in dollars. Keep responses concise and helpful.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      tools: toolDefinitions,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const choice = completion.choices[0];
    const message = choice?.message;

    if (!message) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 },
      );
    }

    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolResults = await Promise.all(
        message.tool_calls.map(async (tc) => {
          const args = JSON.parse(tc.function.arguments);
          const result = await executeTool(tc.function.name, args);
          return {
            tool_call_id: tc.id,
            role: "tool" as const,
            name: tc.function.name,
            content: JSON.stringify(result),
          };
        }),
      );

      const followUp = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          message,
          ...toolResults,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const reply =
        followUp.choices[0]?.message?.content ||
        "I found the information. What else can I help with?";

      return NextResponse.json({ reply });
    }

    const reply = message.content;
    if (!reply) {
      return NextResponse.json({
        reply: "Hi! How can I help you today? Ask me about device prices, categories, or your order status.",
      });
    }

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      {
        reply:
          "Sorry, I'm having trouble connecting. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
