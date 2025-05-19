"use server";

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MAIN_MODEL = "gemini-2.5-flash-preview-04-17";
const SCHEMA_MODEL = "";
const MISC_MODEL = "gemini-2.0-flash"

const filePath = path.join(process.cwd(), "src/prompts", "description-to-json-database.txt");
const prompt = fs.readFileSync(filePath, "utf8");

export async function generateJsonFromDescription(description: string, previousSchema?: string | null): Promise<object> {
  let fullPromptText = prompt;
  if (previousSchema) {
    fullPromptText = fullPromptText.replace('${previousSchemaIfExists}', previousSchema);
  } else {
    fullPromptText = fullPromptText.replace('${previousSchemaIfExists}', 'null'); // Indicate no previous schema
  }

  // The prompt template is expected to end with something like "Descripción (o Descripción de Cambios si hay un Esquema Anterior):\n"
  // So we append the user's description here.
  const finalContents = fullPromptText + description;

  const response = await ai.models.generateContent({
    model: MAIN_MODEL,
    contents: finalContents,
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

export async function compareJsonSchemas(oldJson: string, newJson: string): Promise<{ summary: string, newSchema?: object }> {
  // 1. Compare the two schemas to get a summary of the differences
  const responseSummary = await ai.models.generateContent({
    model: MISC_MODEL,
    contents: `Compare the following two JSON schemas and provide a summary of the differences:\n\nOld JSON:\n${oldJson}\n\nNew JSON:\n${newJson}. The summary should be concise and highlight the key differences, including any additions, deletions, or modifications. The output should be a plain text summary of the differences. The output should be in the same language as the input JSON schemas.`,
    config: {
      responseMimeType: "text/plain",
    }
  });

  const summary = responseSummary?.text || "No summary text from Gemini";

  // 2. Generate a new complete schema by integrating newJson into oldJson
  const responseNewSchema = await ai.models.generateContent({
    model: MAIN_MODEL, // Using MAIN_MODEL as it's typically used for JSON generation
    contents: `Given the following old JSON schema and a new JSON schema (which might be a partial update or a new part for the old schema), integrate the new JSON schema into the old JSON schema to produce a single, complete, and updated JSON schema.
Ensure all elements from the old schema are preserved unless directly modified or replaced by the new JSON schema.
The output must be only the resulting JSON schema.

Old JSON Schema:
${oldJson}

New JSON Schema (the update/addition):
${newJson}

Resulting complete and updated JSON Schema:`,
    config: {
      responseMimeType: "application/json",
    }
  });

  let newSchema: object;
  const newSchemaText = responseNewSchema?.text;

  if (newSchemaText) {
    try {
      newSchema = JSON.parse(newSchemaText);
    } catch (error) {
      console.error("Error parsing new schema JSON from Gemini response:", error);
      newSchema = { error: "Failed to parse new schema JSON response" };
    }
  } else {
    newSchema = { error: "No new schema text from Gemini" };
  }

  return { summary, newSchema };
}

export async function generateSqlSchemaFromDiagram(diagram: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: SCHEMA_MODEL,
    contents: `Given the following diagram, generate SQL code to create the database schema. The diagram is in JSON format. The output should be only the SQL code.
Diagram:
${diagram}`,
    config: {
      responseMimeType: "text/plain",
    }
  });
  const text = response?.text;
  if (text) {
    try {
      const sql = text; // Assuming the response is SQL code
      return sql;
    } catch (error) {
      console.error("Error parsing SQL from Gemini response:", error);
      return "Failed to parse SQL response"
    }
  }
  return "No response text from Gemini"
}
