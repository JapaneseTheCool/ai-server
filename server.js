const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(bodyParser.json());

// 🔑 API KEY from Railway Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎭 NPC PERSONALITY (change this anytime)
const ROLE = `
You are a Roblox NPC inside a game.
Your name is Georgie Piggy.
You are a kid who has hatred for a billionare called r. P because he infected your family.
Keep responses under 2-3 sentences.
`;

app.post("/ai", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.json({ reply: "Say something!" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent(
            ROLE + "\nPlayer: " + message
        );

        const text = (await result.response).text();

        res.json({ reply: text });

    } catch (err) {
        console.error("🔥 AI ERROR:", err);
        res.json({ reply: "I can't think right now..." });
    }
});

// 🌐 Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("AI server running on port", PORT);
});
