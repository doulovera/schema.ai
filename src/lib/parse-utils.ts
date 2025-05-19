"use client";

export type Column = {
  name: string;
  type: string;
  not_null?: boolean; // Changed to optional
  unique?: boolean;   // Changed to optional
  primary_key?: boolean; // Changed to optional
  foreign_key?: string | null; // Changed to optional
  default?: string | number | boolean; // Added default property
};

export type Table = {
  name: string;
  columns: Column[];
  primary_key_composite?: string[]; // Added for composite primary keys
};

export type DatabaseSchema = {
  database: {
    name: string;
    tables: Table[];
  };
};

export function parseJsonToObject(jsonString: string): Table[] {
  if (!jsonString) return [];

  try {
    const schema: DatabaseSchema = JSON.parse(jsonString);

    if (!schema || !schema.database || !schema.database.tables) {
      console.error("Estructura JSON inválida.");
      return [];
    }

    return schema.database.tables.map(table => ({
      ...table,
      columns: table.columns.map(column => ({
        ...column,
        not_null: column.not_null === undefined ? false : column.not_null, // default to false if undefined
        unique: column.unique === undefined ? false : column.unique,       // default to false if undefined
        primary_key: column.primary_key === undefined ? false : column.primary_key, // default to false if undefined
        foreign_key: column.foreign_key === undefined ? null : column.foreign_key, // default to null if undefined
      })),
    }));
  } catch (error) {
    console.error("Error al procesar el JSON:", error);
    return [];
  }
}
