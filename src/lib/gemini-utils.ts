import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const prompt = `
Quiero que actúes como diseñador de bases de datos. Según la descripción funcional de la aplicación que te indique, genera una estructura completa de base de datos relacional en formato XML. El documento XML debe tener una estructura clara y anidada: el elemento raíz debe ser <database name="nombre_de_la_base">; dentro de <database>, define una o más etiquetas <table name="nombre_tabla">; dentro de cada <table>, define las columnas con etiquetas <column> usando los atributos correspondientes: name, type, not_null, unique, default, primary_key, foreign_key. Si una tabla tiene clave primaria compuesta, utiliza una etiqueta <primary_key> anidada con columnas <column name="nombre_columna" />. El atributo foreign_key debe seguir el formato: referenced_table(column_name). Usa nombres en inglés y en snake_case tanto para tablas como para columnas. No uses texto fuera del bloque XML ni comillas triples ni etiquetas de bloque como xml o code. Estructura el XML para que sea legible, ordenado y útil para documentación o generación de esquemas. Cuando estés listo, genera una base de datos relacional sencilla sobre una temática al azar, como por ejemplo un blog de recetas, una tienda en línea o una red social. Asegúrate de cumplir estrictamente con la estructura XML indicada.
`;

async function generateXML(): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt,
  });
  return response.text || "";
}

export { generateXML };