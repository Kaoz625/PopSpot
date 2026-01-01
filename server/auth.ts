import type { Request, Response, Express } from "express";
import * as crypto from "crypto";

interface ReplitUser {
  id: string;
  name: string;
  profileImage: string;
  url: string;
}

const sessions = new Map<string, { user: ReplitUser; expiresAt: number }>();

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getSessionToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}

function verifyReplitSignature(req: Request): boolean {
  const signature = req.headers["x-replit-user-id-signature"] as string;
  const userId = req.headers["x-replit-user-id"] as string;
  const replId = process.env.REPL_ID;

  if (!signature || !userId || !replId) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", replId)
      .update(userId)
      .digest("hex");
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.log("Signature verification error:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

  app.get("/api/auth/user", (req: Request, res: Response) => {
    const token = getSessionToken(req);
    
    if (token && sessions.has(token)) {
      const session = sessions.get(token)!;
      if (session.expiresAt > Date.now()) {
        return res.json({ user: session.user, authenticated: true });
      } else {
        sessions.delete(token);
      }
    }
    
    return res.json({ user: null, authenticated: false });
  });

  app.get("/api/auth/login", (req: Request, res: Response) => {
    const userId = req.headers["x-replit-user-id"] as string;
    const userName = req.headers["x-replit-user-name"] as string;
    const userProfileImage = req.headers["x-replit-user-profile-image"] as string;
    const userUrl = req.headers["x-replit-user-url"] as string;

    if (!userId || !userName) {
      const redirectParam = req.query.redirect as string || "/";
      return res.json({ 
        authenticated: false, 
        requiresLogin: true,
        message: "Replit authentication headers not present. Please login through Replit."
      });
    }

    const isSignatureValid = verifyReplitSignature(req);
    
    if (!isSignatureValid && process.env.NODE_ENV === "production") {
      return res.status(401).json({ 
        error: "Invalid authentication signature",
        authenticated: false 
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const user: ReplitUser = {
      id: userId,
      name: userName,
      profileImage: userProfileImage || `https://replit.com/public/images/evalbot/evalbot_24.png`,
      url: userUrl || `https://replit.com/@${userName}`,
    };

    sessions.set(token, {
      user,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });

    const redirectUrl = req.query.redirect as string || "/";
    const separator = redirectUrl.includes("?") ? "&" : "?";
    return res.redirect(`${redirectUrl}${separator}authToken=${token}`);
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const token = getSessionToken(req);
    
    if (token) {
      sessions.delete(token);
    }
    
    return res.json({ success: true });
  });
}
