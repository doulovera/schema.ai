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
} from '@/lib/prompts'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

const MAIN_MODEL = 'gemini-2.5-flash-preview-04-17'
const SCHEMA_MODEL = 'gemini-2.0-flash'
const MISC_MODEL = 'gemini-2.0-flash'

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

const filePathValidateIntentPromptFile = path.join(
  process.cwd(),
  'src/prompts',
  'validate-user-intent.txt',
)
const validateIntentPromptFromFile = fs.readFileSync(
  filePathValidateIntentPromptFile,
  'utf8',
)

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
        parts: [{ text: validateIntentPromptFromFile }],
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
  const chat = ai.chats.create({
    model: MAIN_MODEL,
    history: currentHistory,
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

const compareSchemasPromptPath = path.join(
  process.cwd(),
  'src/prompts',
  'summarize-changes.txt',
)
const compareSchemasPrompt = fs.readFileSync(compareSchemasPromptPath, 'utf8')

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
<<<<<<< HEAD
        parts: [{ text: summarizeChangesPrompt }],
=======
        parts: [{ text: compareSchemasPrompt }],
>>>>>>> 17eaad8e0c053e45647e83ea73b23fd576fbb506
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
