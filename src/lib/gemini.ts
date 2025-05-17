"use server";

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MODEL = "gemini-2.5-flash-preview-04-17";

const filePath = path.join(process.cwd(), "src/prompts", "description-to-json-database.txt");
const prompt = fs.readFileSync(filePath, "utf8");

export async function generateJsonFromDescription(description: string): Promise<object> { // Changed return type
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${prompt} "${description}"`,
    config: {
      responseMimeType: "application/json",
    }
  });

  // TODO: handle "503 Service Unavailable" error - use retry logic with other model

  const text = response?.text;

  if (text) {
    try {
      const json = JSON.parse(text);
      return json;
    } catch (error) {
      console.error("Error parsing JSON from Gemini response:", error);
      return { error: "Failed to parse JSON response" }; 
    }
  }
  return { error: "No response text from Gemini" };
}
