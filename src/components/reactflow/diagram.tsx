"use client";
import { useReducer, useEffect } from "react";
import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./custom-node";
import { nodesReducer } from "@/reducers/reactflow-node-reducer";
import { parseJsonToObject } from "@/lib/parse-utils";
import { useChatStore } from "@/stores/chat";

const nodeTypes = {
  test: CustomNode,
};

export function Diagram () {
  const { chatDiagram } = useChatStore();
  const [nodes, dispatch] = useReducer(nodesReducer, []);

  useEffect(() => {
    if (!chatDiagram) {
      dispatch({ type: "INIT_NODES", payload: [] });
      return;
    }

    const tables: any = parseJsonToObject(chatDiagram);

    dispatch({ type: "INIT_NODES", payload: tables });
  }, [chatDiagram]);

  const onNodesChange = React.useCallback((changes: any) => {
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
