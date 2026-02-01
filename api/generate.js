export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { product, goal, platform } = req.body;

  if (!product || !goal || !platform) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const prompt = `
You are a senior performance marketing expert.

SECTION 1:
Generate 3 high-converting ad copies for ${platform}.

SECTION 2:
Create a target audience profile including:
- Age range
- Location type
- Interests
- Pain points
- Buying intent
- Best ad angle
- Creative suggestion

Product: ${product}
Goal: ${goal}
Platform: ${platform}
`;

  try {

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
