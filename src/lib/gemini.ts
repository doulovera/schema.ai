'use server'

import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Message, GeminiMessage } from '@/types/chat' // Ensure this path is correct
import { GoogleGenAI } from '@google/genai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

const MAIN_MODEL = 'gemini-2.5-flash-preview-04-17'
const SCHEMA_MODEL = 'gemini-2.0-flash'
const MISC_MODEL = 'gemini-2.0-flash'

const filePathMongoPromptFile = path.join(
  process.cwd(),
  "src/prompts",
  "from-json-to-sql.txt" // Corrected: This is the MongoDB prompt
);
const mongoDbPromptFromFile = fs.readFileSync(filePathMongoPromptFile, "utf8");

const filePathSqlPromptFile = path.join(
  process.cwd(),
  "src/prompts",
  "from-json-to-mongo.txt" // Corrected: This is the SQL prompt
);
const sqlPromptFromFile = fs.readFileSync(filePathSqlPromptFile, "utf8");

// initializeChat is removed as passing Chat object to client is problematic.

export async function sendUserMessage(
  currentHistory: GeminiMessage[],
  userMessage: string
): Promise<{ responseText: string; updatedHistory: GeminiMessage[] }> {
  const chat = ai.chats.create({
    model: MAIN_MODEL,
    history: currentHistory,
    config: {
      responseMimeType: "application/json",
      systemInstruction: {
        role: "user",
        parts: [{ text: prompt }],
      },
    },
  });

  const response = await chat.sendMessage({ message: userMessage });
  const responseText = response.text || "";

  const updatedHistory = chat.getHistory() as GeminiMessage[];

  return { responseText, updatedHistory };
}

export async function normalizeChat(
  threadHistory: Message[]
): Promise<GeminiMessage[]> {
  return threadHistory.map((thread) => ({
    role: thread.role,
    parts: [{ text: thread.diagram }],
  }));
}

export async function compareJsonSchemas(
  oldJson: string,
  newJson: string
): Promise<{ summary: string; newSchema?: object }> {
  const responseSummary = await ai.models.generateContent({
    model: MISC_MODEL,
    contents: `Compare the following two JSON schemas and provide a summary of the differences:\\n\\nOld JSON:\\n${oldJson}\\n\\nNew JSON:\\n${JSON.stringify(
      newJson
    )}. The summary should be concise and highlight the key differences, including any additions, deletions, or modifications. The output should be a plain text summary of the differences. The output should be in the same language as the input JSON schemas.`,
    config: {
      responseMimeType: "text/plain",
    },
  });

  const summary = responseSummary?.text || "No summary text from Gemini";

  return { summary, newSchema: {} };
}

export async function generateDatabaseScriptFromDiagram(
  diagram: string,
  databaseType: "sql" | "mongo"
): Promise<string> {
  let systemInstructionText = "";
  let userPromptText = "";

  switch (databaseType) {
    case "sql": {
      // Extract the system instruction part from sqlPromptFromFile (for SQL)
      const sqlPromptLines = sqlPromptFromFile.split("\\n");
      // Assuming the relevant instruction for SQL generation is from the beginning of the file up to a certain marker
      systemInstructionText = sqlPromptLines
        .slice(2, sqlPromptLines.indexOf("    El script generado debe:"))
        .join("\\n");
      userPromptText = `Given the following diagram, generate SQL code to create the database schema. The diagram is in JSON format. The output should be only the SQL code.
Diagram:
${diagram}`;
      break;
    }
    case "mongo": {
      // Extract the system instruction part from mongoDbPromptFromFile (for MongoDB)
      const mongoPromptLines = mongoDbPromptFromFile.split("\\n");
      // Assuming the relevant instruction for MongoDB generation is from the beginning of the file up to a certain marker
      systemInstructionText = mongoPromptLines
        .slice(1, mongoPromptLines.indexOf("    El script generado debe:"))
        .join("\\n");
      userPromptText = `Given the following diagram, generate a MongoDB initialization script. The diagram is in JSON format. The output should be only the JavaScript code for MongoDB Shell.
Diagram:
${diagram}`;
      break;
    }
    default:
      return "Invalid database type specified.";
  }

  const response = await ai.models.generateContent({
    model: SCHEMA_MODEL,
    contents: [
      { role: "user", parts: [{ text: systemInstructionText }] }, // System-like instruction
      { role: "user", parts: [{ text: userPromptText }] }, // Actual user prompt with diagram
    ],
    config: {
      responseMimeType: "text/plain",
    },
  });

  const text = response?.text;
  if (text) {
    return text;
  }
  return "No response text from Gemini";
}
