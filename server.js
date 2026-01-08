import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const REPLICATE_API_TOKEN = process.env.r8_JeyDqt6MVDZzH8rivQLEINnFpDthAnq09v8lw;

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "db21e45b6b4eaf4f2c58d88e5f7c9d6b1c47b7a5b4b1f33c7b8fbc5a2b7e1d4a",
        input: { prompt }
      })
    });

    const data = await response.json();

    let imageUrl = null;
    while (!imageUrl) {
      const poll = await fetch(data.urls.get, {
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`
        }
      });
      const result = await poll.json();
      if (result.status === "succeeded") {
        imageUrl = result.output[0];
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
    }

    res.json({ image: imageUrl });
  } catch {
    res.status(500).json({ error: \"Failed\" });
  }
});

app.listen(3000);
