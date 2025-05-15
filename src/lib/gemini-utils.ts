"use server";
// imports
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";
// gemini config
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
// obtaining prompt from txt
const filePath = path.join(process.cwd(), "src/prompts", "description-to-xml-database.txt");
const prompt = fs.readFileSync(filePath, "utf8");
// generar base de datos en archivo xml basado en una descripcion
async function generateXML(description: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt + description,
  });
  return response.text || "";
}

export { generateXML };
