const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store raw body for Stripe webhooks or similar
app.use((req, res, next) => {
  if (req.path === "/webhooks/stripe") {
    let rawBody = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      rawBody += chunk;
    });
    req.on("end", () => {
      req.rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Basic API routes
app.get("/api", (req, res) => {
  res.json({
    message: "PopSpot API",
    version: "1.0.0",
    endpoints: ["/health", "/api"],
  });
});

// Import your server routes here
// You'll need to convert your server/routes.ts to work with Cloud Functions
// For now, placeholder
app.get("/api/gigs", (req, res) => {
  res.json({ message: "Gigs endpoint - implement me" });
});

app.post("/api/gigs", (req, res) => {
  res.json({ message: "Create gig - implement me" });
});

// Export as Cloud Function
exports.api = functions.https.onRequest(app);

// Optional: Create additional functions for specific tasks
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase Cloud Functions!");
});
