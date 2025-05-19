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

const filePath = path.join(
  process.cwd(),
  'src/prompts',
  'description-to-json-database.txt',
)
const prompt = fs.readFileSync(filePath, 'utf8')

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

  const updatedHistory = chat.getHistory() as GeminiMessage[]

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

/* export async function generateJsonFromDescription(
  description: string,
  previousSchema?: string | null
): Promise<object> {
  let fullPromptText = prompt;
  if (previousSchema) {
    fullPromptText = fullPromptText.replace(
      "${previousSchemaIfExists}",
      previousSchema
    );
  } else {
    fullPromptText = fullPromptText.replace(
      "${previousSchemaIfExists}",
      "null"
    ); // Indicate no previous schema
  }

  const finalContents = fullPromptText + description;

  const response = await ai.models.generateContent({
    model: MAIN_MODEL,
    contents: finalContents,
    config: {
      responseMimeType: "application/json",
    },
  }); 

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
}*/

export async function compareJsonSchemas(
  oldJson: string,
  newJson: string,
): Promise<{ summary: string; newSchema?: object }> {
  //   const responseNewSchema = await ai.models.generateContent({
  //     model: MAIN_MODEL,
  //     contents: `Given the following old JSON schema and a new JSON schema (which might be a partial update or a new part for the old schema), integrate the new JSON schema into the old JSON schema to produce a single, complete, and updated JSON schema.
  // Ensure all elements from the old schema are preserved unless directly modified or replaced by the new JSON schema.
  // The output must be only the resulting JSON schema.

  // Old JSON Schema:
  // ${oldJson}

  // New JSON Schema (the update/addition):
  // ${newJson}

  // Resulting complete and updated JSON Schema:`,
  //     config: {
  //       responseMimeType: 'application/json',
  //     },
  //   })

  //   let newSchema: object
  //   const newSchemaText = responseNewSchema?.text

  //   if (newSchemaText) {
  //     try {
  //       newSchema = JSON.parse(newSchemaText)
  //     } catch (error) {
  //       console.error(
  //         'Error parsing new schema JSON from Gemini response:',
  //         error,
  //       )
  //       newSchema = { error: 'Failed to parse new schema JSON response' }
  //     }
  //   } else {
  //     newSchema = { error: 'No new schema text from Gemini' }
  //   }

  const responseSummary = await ai.models.generateContent({
    model: MISC_MODEL,
    contents: `Compare the following two JSON schemas and provide a summary of the differences:\n\nOld JSON:\n${oldJson}\n\nNew JSON:\n${JSON.stringify(
      newJson,
    )}. The summary should be concise and highlight the key differences, including any additions, deletions, or modifications. The output should be a plain text summary of the differences. The output should be in the same language as the input JSON schemas.`,
    config: {
      responseMimeType: 'text/plain',
    },
  })

  const summary = responseSummary?.text || 'No summary text from Gemini'

  return { summary, newSchema: {} }
}

export async function generateSqlSchemaFromDiagram(
  diagram: string,
): Promise<string> {
  const response = await ai.models.generateContent({
    model: SCHEMA_MODEL, // Ensure SCHEMA_MODEL is defined, e.g., 'gemini-2.0-flash' or similar
    contents: `Given the following diagram, generate SQL code to create the database schema. The diagram is in JSON format. The output should be only the SQL code.
Diagram:
${diagram}`,
    config: {
      responseMimeType: 'text/plain',
    },
  })
  const text = response?.text
  if (text) {
    // It seems there was a try-catch block intended here.
    // Assuming you want to return the text directly or handle potential errors.
    // For now, returning text directly if it exists.
    return text
  }
  return 'No response text from Gemini'
}
