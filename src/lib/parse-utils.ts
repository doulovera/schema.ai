import convert from "xml-js";

export type Column = {
  name: string;
  type: string;
  not_null: boolean;
  unique: boolean;
  primary_key: boolean;
  foreign_key: string | null;
};

export type Table = {
  name: string;
  columns: Column[];
};

export function parseXmlToObject(xmlString: string): Table[] {
  if (!xmlString) return [];

  try {
    const obj = convert.xml2js(xmlString, { compact: false });

    if (
      !obj ||
      !obj.elements ||
      obj.elements.length === 0 ||
      obj.elements[0].name !== "database"
    ) {
      console.error("Estructura XML inválida.");
      return [];
    }

    const tables = obj.elements[0].elements.filter(
      (el: any) => el.name === "table"
    );

    return tables.map((table: any, index: number) => {
      const tableName = table.attributes?.name || `table_${index}`;

      const columnElements = (table.elements || []).filter(
        (e: any) => e.name === "column"
      );

      const primaryKeyGroup = (table.elements || []).find(
        (e: any) => e.name === "primary_key"
      );

      const primaryKeyColumns = (primaryKeyGroup?.elements || []).map(
        (col: any) => col.attributes?.name
      );

      const columns: Column[] = columnElements.map((col: any) => ({
        name: col.attributes?.name || "unnamed_column",
        type: col.attributes?.type || "unknown",
        not_null: col.attributes?.not_null === "true",
        unique: col.attributes?.unique === "true",
        primary_key:
          col.attributes?.primary_key === "true" ||
          primaryKeyColumns.includes(col.attributes?.name),
        foreign_key: col.attributes?.foreign_key || null,
      }));

      return {
        name: tableName,
        columns,
      };
    });
  } catch (error) {
    console.error("Error al procesar el XML:", error);
    return [];
  }
}
