// api/claude.js — Vercel serverless function
// This keeps your Anthropic API key hidden from the browser.
//
// SETUP:
//   1. In your Vercel dashboard → your project → Settings → Environment Variables
//   2. Add:  ANTHROPIC_API_KEY  =  your key from console.anthropic.com
//   3. Deploy — done. The key never appears in your frontend code.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic CORS — only allow your own domain
  res.setHeader("Access-Control-Allow-Origin", "https://heartfully.app");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
