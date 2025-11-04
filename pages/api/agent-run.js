export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const { prompt } = body;
    if (typeof prompt !== "string" || !prompt.trim()) {
      return res
        .status(400)
        .json({
          error: "Invalid request: `prompt` (non-empty string) required",
        });
    }

    // Simulate or delegate to a real agent runner later.
    const safePrompt = String(prompt).replace(/\r/g, "").slice(0, 2000);
    const channel = body.channel || "unknown";

    // Create a safe, multiline text output for now.
    const output = [
      `Agent run (mock)`,
      `Prompt: ${safePrompt}`,
      `Channel: ${channel}`,
      `Result: simulated-success`,
      `Notes: This response is a mock. Replace with real runner integration.`,
    ].join("\n");

    return res.status(200).json({ output });
  } catch (err) {
    console.error("agent-run error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
