import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { registerVoiceAssistantRoutes } from "./voice-assistant";

export async function registerRoutes(app: Express): Promise<Server> {
  registerVoiceAssistantRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
