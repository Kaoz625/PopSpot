import OpenAI from "openai";
import type { Express, Request, Response } from "express";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `You are PopSpot's friendly AI assistant. PopSpot is a local gig marketplace app where people can discover and post side-hustles like homemade food, dog walking, tutoring, fitness training, and more.

Your job is to help users with:
1. **Posting Gigs**: If they want to post something, help them draft a compelling title, description, and suggest a fair price. Ask what category it fits (Food, Services, Art, Tutoring, Fitness, Tech, Hair Braiding, House Cleaning, Other).
2. **Searching**: If they're looking for services, help them find what they need. Suggest search terms or categories.
3. **General Questions**: Answer questions about how to use the app.

Always be concise, friendly, and helpful. If the user's intent is unclear, ask one clarifying question.

Response format:
- Keep responses under 100 words unless drafting a post
- When drafting a post, format it clearly with Title, Description, Category, and Suggested Price
- Use a warm, conversational tone`;

export function registerVoiceAssistantRoutes(app: Express): void {
  app.post("/api/voice-assistant", async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-10),
        { role: "user", content: message },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage =
        response.choices[0]?.message?.content ||
        "I'm sorry, I couldn't process that request.";

      res.json({
        response: assistantMessage,
        conversationHistory: [
          ...conversationHistory.slice(-10),
          { role: "user", content: message },
          { role: "assistant", content: assistantMessage },
        ],
      });
    } catch (error) {
      console.error("Voice assistant error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });
}
