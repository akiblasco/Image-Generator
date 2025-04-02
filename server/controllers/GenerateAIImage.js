import * as dotenv from "dotenv";
import { createError } from "../error.js";
import OpenAI from "openai";

dotenv.config();

// Instantiate the new OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate image function
// In server/controllers/GenerateAIImage.js
export const generateImage = async (req, res, next) => {
  try {
    console.log("Generate image endpoint hit");
    console.log("Request body:", req.body);
    const { prompt } = req.body;
    console.log("Prompt received:", prompt);
    
    // Use the new images.generate() method
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    console.log("OpenAI API response received");
    // response.data is an array of results
    const generatedImage = response.data[0].b64_json;
    return res.status(200).json({ photo: generatedImage });
  } catch (error) {
    console.error("Error generating image:", error);
    next(
      createError(
        error?.status || 500,
        error?.response?.data?.error?.message || error?.message || "Internal Server Error"
      )
    );
  }
};
