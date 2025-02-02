require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})

app.post("/suggestions", async (req, res) => {
  const { content } = req.body;

  try {
    const prompt = `"Please review the following text and provide exactly three improvement suggestions. Each suggestion should be in a separate sentence and separated by \n.
Text: ${content}
Suggestions (3 sentences, one per line):"`;

    const result = await model.generateContent(prompt);

    const suggestions = result.response.text().split('\n').map(suggestion => suggestion.trim());
    suggestions.pop();
    res.json(suggestions);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Error processing request" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${listener.address().port}`);
});
