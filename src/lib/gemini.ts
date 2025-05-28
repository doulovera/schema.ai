'use server'

import type { Message, GeminiMessage } from '@/types/chat' // Ensure this path is correct
import { GoogleGenAI } from '@google/genai'
import { Type } from '@google/genai'
import {
  descriptionToJsonDatabasePrompt,
  fromJsonToMongoPrompt,
  fromJsonToSqlPrompt,
  summarizeChangesPrompt,
  validateUserIntentPrompt,
  welcomePrompt,
} from '@/lib/prompts'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

const MAIN_MODEL = 'gemini-2.5-flash-preview-04-17'
const SCHEMA_MODEL = 'gemini-2.0-flash'
const MISC_MODEL = 'gemini-2.0-flash'

// Todos los prompts se usan directamente desde prompts.ts

interface ValidationResult {
  isValid: boolean
  message: string
}

export async function validateUserIntent(
  userMessage: string,
): Promise<ValidationResult> {
  const response = await ai.models.generateContent({
    model: MISC_MODEL, // Using a smaller model for validation
    contents: userMessage,
    config: {
      systemInstruction: {
        role: 'user',
        parts: [{ text: validateUserIntentPrompt }],
      },
      responseMimeType: 'application/json',
    },
  })

  const text = response?.text
  if (text) {
    try {
      const validationResult = JSON.parse(text) as ValidationResult
      return validationResult
    } catch (error) {
      console.error('Error parsing validation response:', error)
      return {
        isValid: false,
        message: 'Error al procesar la validación de la solicitud.',
      } // Default to not valid if parsing fails
    }
  }
  return {
    isValid: false,
    message: 'No se recibió respuesta del servicio de validación.',
  } // Default to not valid if no text response
}

export async function sendUserMessage(
  currentHistory: GeminiMessage[],
  userMessage: string,
): Promise<{ responseText: string; updatedHistory: GeminiMessage[] }> {
  let history = currentHistory || []
  if (history.length === 0 || history[0].role !== 'user') {
    history = [{ role: 'user', parts: [{ text: userMessage }] }, ...history]
  }
  const chat = ai.chats.create({
    model: MAIN_MODEL,
    history,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: {
        role: 'user',
        parts: [{ text: descriptionToJsonDatabasePrompt }],
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

export async function compareJsonSchemas(
  oldJson: string,
  newJson: string,
): Promise<{ summary: string; newSchema?: object }> {
  const contents = `Esquema anterior:\n${oldJson}\n\nEsquema nuevo:\n${JSON.stringify(
    newJson,
  )}`

  const response = await ai.models.generateContent({
    model: MISC_MODEL,
    contents,
    config: {
      systemInstruction: {
        role: 'user',
        parts: [{ text: summarizeChangesPrompt }],
      },
      responseMimeType: 'text/plain',
    },
  })

  const summary = response?.text?.trim() || 'No se recibió resumen del modelo.'

  return { summary, newSchema: {} }
}

export async function generateDatabaseScriptFromDiagram(
  diagram: string,
  databaseType: 'sql' | 'mongo',
): Promise<string> {
  let systemContext: string

  switch (databaseType) {
    case 'sql': {
      systemContext = fromJsonToSqlPrompt
      break
    }
    case 'mongo': {
      systemContext = fromJsonToMongoPrompt
      break
    }
    default:
      return 'Invalid database type specified.'
  }

  const response_schema = {
    type: Type.OBJECT,
    properties: {
      schema: {
        description: 'The full schema in a string',
        type: Type.STRING,
      },
    },
    required: ['schema'],
  }

  try {
    const response = await ai.models.generateContent({
      model: SCHEMA_MODEL,
      contents: `${diagram}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: response_schema,
        systemInstruction: {
          role: 'user',
          parts: [{ text: systemContext }],
        },
      },
    })

    const text = response?.text
    if (text) {
      return JSON.parse(text).schema
    }
    return 'No response text from Gemini'
  } catch (error) {
    console.error('Error generating database script:', error)
    return 'Error generating database script'
  }
}

export async function getRandomWelcomeMessage(): Promise<string> {
  const response = await ai.models.generateContent({
    model: MISC_MODEL,
    contents: welcomePrompt,
    config: {
      systemInstruction: {
        role: 'user',
        parts: [{ text: welcomePrompt }],
      },
      responseMimeType: 'application/json',
    },
  })
  let messages: string[] = []
  try {
    messages = JSON.parse(response?.text || '[]')
  } catch {
    // fallback: intentar extraer el array de texto plano
    const match = response?.text?.match(/\[(.*)\]/s)
    if (match) {
      try {
        messages = JSON.parse(`[${match[1]}]`)
      } catch {}
    }
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    messages = [
      '¿Qué vamos a diseñar hoy?',
      'Describe los datos que quieres guardar y te ayudo.',
      '¡Hola! Cuéntame qué información quieres almacenar.',
      'Estoy listo para ayudarte a crear tu base de datos.',
      '¿Qué tipo de datos necesitas organizar?',
    ]
  }
  return messages[Math.floor(Math.random() * messages.length)]
}