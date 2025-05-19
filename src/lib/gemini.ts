"use server";

import * as fs from "node:fs";
import * as path from "node:path";
import type { Message, GeminiMessage } from "@/types/chat"; // Ensure this path is correct
import { GoogleGenAI } from "@google/genai";
import { Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MAIN_MODEL = "gemini-2.5-flash-preview-04-17";
const SCHEMA_MODEL = "gemini-2.0-flash";
const MISC_MODEL = "gemini-2.0-flash";

const filePath = path.join(
  process.cwd(),
  "src/prompts",
  "description-to-json-database.txt"
);
const prompt = fs.readFileSync(filePath, "utf8");

const filePathMongoPromptFile = path.join(
  process.cwd(),
  "src/prompts",
  "from-json-to-mongo.txt"
);
const mongoDbPromptFromFile = fs.readFileSync(filePathMongoPromptFile, "utf8");

const filePathSqlPromptFile = path.join(
  process.cwd(),
  "src/prompts",
  "from-json-to-sql.txt"
);
const sqlPromptFromFile = fs.readFileSync(filePathSqlPromptFile, "utf8");

// initializeChat is removed as passing Chat object to client is problematic.

export async function sendUserMessage(
  currentHistory: GeminiMessage[],
  userMessage: string,
): Promise<{ responseText: string; updatedHistory: GeminiMessage[] }> {
  const chat = ai.chats.create({
    model: MAIN_MODEL,
    history: currentHistory,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: {
        role: 'user',
        parts: [{ text: prompt }],
      },
    },
  })

  const response = await chat.sendMessage({ message: userMessage })
  const responseText = response.text || ''

  console.log(response);

  const updatedHistory = chat.getHistory() as GeminiMessage[];

  return { responseText, updatedHistory }
}

export async function normalizeChat(
  threadHistory: Message[],
): Promise<GeminiMessage[]> {
  return threadHistory.map((thread) => ({
    role: thread.role,
    parts: [{ text: thread.diagram }],
  }))
}

export async function compareJsonSchemas(
  oldJson: string,
  newJson: string,
): Promise<{ summary: string; newSchema?: object }> {
  const responseSummary = await ai.models.generateContent({
    model: MISC_MODEL,
    contents: `Compare the following two JSON schemas and provide a summary of the differences:\\n\\nOld JSON:\\n${oldJson}\\n\\nNew JSON:\\n${JSON.stringify(
      newJson,
    )}. The summary should be concise and highlight the key differences, including any additions, deletions, or modifications. The output should be a plain text summary of the differences. The output should be in the same language as the input JSON schemas.`,
    config: {
      responseMimeType: 'text/plain',
    },
  })

  const summary = responseSummary?.text || 'No summary text from Gemini'

  return { summary, newSchema: {} }
}

export async function generateDatabaseScriptFromDiagram(
  diagram: string,
  databaseType: 'sql' | 'mongo',
): Promise<string> {
  let systemContext: string;

  switch (databaseType) {
    case "sql": {
      systemContext = sqlPromptFromFile;
      break;
    }
    case "mongo": {
      systemContext = mongoDbPromptFromFile;
      break;
    }
    default:
      return 'Invalid database type specified.'
  }

  const response_schema = {
    type: Type.OBJECT,
    properties: {
      schema: {
        description: "The full schema in a string",
        type: Type.STRING,
      },
    },
    required: ["schema"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${diagram}`,
    config: {
      responseSchema: response_schema,
      systemInstruction: {
        role: "user",
        parts: [{ text: systemContext }],
      },
      responseMimeType: "application/json",
    },
  })

  console.log(response);
  const text = response?.text;
  if (text) {
    return JSON.parse(text).schema;
  }
  return 'No response text from Gemini'
}
