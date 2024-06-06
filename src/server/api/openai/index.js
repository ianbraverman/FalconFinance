const { OpenAI } = require("openai");
require("dotenv").config();
const router = require("express").Router();
module.exports = router;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function generatePrompt(userProfile) {
  return `Here is the financial profile of the user:
    - Name: ${userProfile.firstname} ${userProfile.lastname}
    - Age: ${userProfile.age}
    - Income: ${JSON.stringify(userProfile.Income, null, 2)}
    - Assets: ${JSON.stringify(userProfile.Assets, null, 2)}
    - Liabilities: ${JSON.stringify(userProfile.Liabilities, null, 2)}
    - Goals: ${JSON.stringify(userProfile.Goals, null, 2)}
    - Expenses: ${JSON.stringify(userProfile.Expenses, null, 2)}
  
    Please provide personalized financial recommendations based on the above data.`;
}

async function getFinancialRecommendations(userProfile) {
  try {
    const prompt = generatePrompt(userProfile);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor tasked with providing recommendations in an HTML format. What you return will be automatically displayed without additional changes on the page Please make it very simple html just in multiple paragraphs to make easier to read",
        },
        { role: "user", content: prompt },
      ],
    });
    return completion.choices[0];
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    throw new Error("Failed to get recomendations");
  }
}
module.exports = getFinancialRecommendations;
