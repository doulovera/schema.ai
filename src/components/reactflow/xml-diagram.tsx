"use client";
import { useReducer, useContext, useEffect } from "react";
import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./custom-node";
import { ChatContext } from "@/context/chat/ChatContext";
import { nodesReducer } from "@/reducers/reactflow-node-reducer";
import { parseXmlToObject } from "@/lib/parse-utils";

const nodeTypes = {
  test: CustomNode,
};

const Diagrama = () => {
  const { xml } = useContext(ChatContext);
  const [nodes, dispatch] = useReducer(nodesReducer, []);

  useEffect(() => {
    if (!xml) {
      dispatch({ type: "INIT_NODES", payload: [] });
      return;
    }

    const tables: any = parseXmlToObject(xml);

    dispatch({ type: "INIT_NODES", payload: tables });
  }, [xml]);

  // Función para manejar cambios en nodos (drag, selección, etc)
  const onNodesChange = React.useCallback((changes) => {
    dispatch({ type: "UPDATE_NODES", payload: { changes } });
  }, []);

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
