"use client";
import { useState, useCallback } from "react";
import React from "react";
import convert from "xml-js"; // xml to json
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./custom-node";

const nodeTypes = {
  test: CustomNode,
};

const nodesPerRow = 3;
const horizontalSpacing = 500;
const verticalSpacing = 400;

const Diagrama = ({ xmlString }: { xmlString: string }) => {
  const initialNodes = React.useMemo(() => {
    if (!xmlString) return [];

    try {
      // Convertir XML string a objeto
      const obj = convert.xml2js(xmlString, { compact: false });

      // Validación básica
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

      const nodes = tables.map((table: any, index: number) => {
        const tableName = table.attributes?.name || `table_${index}`;

        // Manejo de columnas y claves primarias anidadas
        const columnElements = (table.elements || []).filter(
          (e: any) => e.name === "column"
        );

        const primaryKeyGroup = (table.elements || []).find(
          (e: any) => e.name === "primary_key"
        );

        const primaryKeyColumns = (primaryKeyGroup?.elements || []).map(
          (col: any) => col.attributes?.name
        );

        const columns = columnElements.map((col: any) => ({
          name: col.attributes?.name || "unnamed_column",
          type: col.attributes?.type || "unknown",
          not_null: col.attributes?.not_null === "true",
          unique: col.attributes?.unique === "true",
          primary_key:
            col.attributes?.primary_key === "true" ||
            primaryKeyColumns.includes(col.attributes?.name),
          foreign_key: col.attributes?.foreign_key || null,
        }));

        const rowIndex = Math.floor(index / nodesPerRow);
        const colIndex = index % nodesPerRow;

        return {
          id: tableName,
          type: "test",
          position: {
            x: colIndex * horizontalSpacing,
            y: rowIndex * verticalSpacing,
          },
          data: {
            label: tableName,
            columns,
          },
        };
      });

      return nodes;
    } catch (error) {
      console.error("Error al procesar el XML:", error);
      return [];
    }
  }, [xmlString]);

  const [nodes, setNodes] = useState(initialNodes);
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      onNodesChange={onNodesChange}
      fitView
      style={{ width: "100%", height: "100%" }}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default Diagrama;
