import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(bodyParser.json());

// 🔑 API KEY from Railway
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎭 NPC ROLE
const ROLE = `
You are a Roblox NPC.
You speak short, friendly, natural sentences.
You stay in character at all times.
`;

app.post("/ai", async (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.json({ reply: "Say something!" });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent(
            ROLE + "\nPlayer: " + message
        );

        const text = (await result.response).text();

        res.json({ reply: text });

    } catch (err) {
        console.error("AI ERROR:", err);
        res.json({ reply: "I can't think right now..." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("AI server running on port " + PORT);
});
