"use server";

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MODEL = "gemini-2.5-flash-preview-04-17";

const filePath = path.join(process.cwd(), "src/prompts", "description-to-xml-database.txt");
const prompt = fs.readFileSync(filePath, "utf8");

export async function generateXmlFromDescription(description: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${prompt} "${description}"`,
  });

  return response.text || "";
}
