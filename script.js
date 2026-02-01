const btn = document.getElementById("generateBtn");
const output = document.getElementById("output");

btn.addEventListener("click", generateAd);

async function generateAd() {

  const product = document.getElementById("product").value.trim();
  const goal = document.getElementById("goal").value.trim();
  const platform = document.getElementById("platform").value.trim();

  if(!product || !goal || !platform){
    alert("Please fill all fields");
    return;
  }

  output.textContent = "Generating...";

  const prompt = `
You are a senior performance marketing expert.

Generate:

SECTION 1:
3 high-converting ad copies for ${platform}.
Keep them short, scroll-stopping and platform friendly.

SECTION 2:
Create a detailed target audience profile including:
- Age range
- Gender (if relevant)
- Location type
- Interests
- Pain points
- Buying intent
- Best ad angle
- Suggested creative idea

Product / Service: ${product}
Goal: ${goal}
Platform: ${platform}

Return in clean, clearly labeled sections.
`;

  try{

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY_HERE",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if(!data.candidates){
      output.textContent = "Something went wrong. Check your API key.";
      return;
    }

    output.textContent =
      data.candidates[0].content.parts[0].text;

  }catch(err){
    output.textContent = "Error: " + err.message;
  }

}
