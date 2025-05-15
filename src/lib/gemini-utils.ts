"use server";

import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const prompt = `
Quiero que actúes como diseñador de bases de datos. Según la descripción funcional de la aplicación que te indique, genera una estructura completa de base de datos relacional en formato XML.

Requisitos de salida:

    El documento XML debe tener una estructura clara y anidada:

        El elemento raíz debe ser <database name="nombre_de_la_base">.

        Dentro de <database>, define una o más etiquetas <table name="nombre_tabla">.

        Dentro de cada <table>, define las columnas con etiquetas <column> y los atributos correspondientes.

        Si una tabla tiene clave primaria compuesta, utiliza una etiqueta <primary_key> anidada con columnas <column name="nombre_columna" />.

    No utilices texto fuera del bloque XML.

    No uses comillas triples ni etiquetas de bloque como xml o code.

    Usa nombres en inglés y en snake_case tanto para tablas como para columnas.

    Para cada <column>, utiliza atributos según aplique:

        name, type, not_null, unique, default, primary_key, foreign_key.

        El atributo foreign_key debe seguir el formato: referenced_table(column_name).

    Estructura el XML para que sea legible, ordenado y útil en herramientas de documentación o generación de esquemas.

Ejemplo de estructura deseada:
<database name="example_db"> <table name="example_table"> <column name="id" type="INT" not_null="true" primary_key="true"/> <column name="name" type="VARCHAR" not_null="true"/> </table> </database>

Cuando estés listo, genera una base de datos relacional sobre
`;

async function generateXML(description: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt + description,
  });
  return response.text || "";
}

const sqlpFromXmlPrompt = `
saluda en español
`;

async function generateSqlFromXml(): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: sqlpFromXmlPrompt,
  });
  return response.text || "";
}

export { generateXML, generateSqlFromXml };
