"use client";

import { useEffect, useState, useRef } from "react"; // Added useRef
import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node, // Import Node type
  type Edge, // Import Edge type
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./custom-node";
import { parseJsonToObject } from "@/lib/parse-utils";
import { useChatStore } from "@/stores/chat";
import Dagre from "@dagrejs/dagre";

interface NodeData {
  label: string;
  columns: Array<{ name: string; type: string }>;
  [key: string]: unknown; // Add index signature
}

type AppNode = Node<NodeData, string>;
type AppEdge = Edge;

const nodeTypes = {
  test: CustomNode,
};

const getLayoutedElements = (
  nodesToLayout: AppNode[],
  edgesToLayout: AppEdge[],
  options: { direction: string },
) => {
  const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: options.direction,
    nodesep: 50,
    ranksep: 50, 
    align: 'DL',
  });

  for (const edge of edgesToLayout) {
    dagreGraph.setEdge(edge.source, edge.target);
  }

  for (const node of nodesToLayout) {
    const nodeWidth = node.measured?.width && node.measured.width > 0 ? node.measured.width : 256;
    const nodeHeight = node.measured?.height && node.measured.height > 0 ? node.measured.height : 180; // Default height if not measured

    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  }

  Dagre.layout(dagreGraph);

  return {
    nodes: nodesToLayout.map((node) => {
      const dagreNode = dagreGraph.node(node.id);
      const x = dagreNode.x - (dagreNode.width / 2);
      const y = dagreNode.y - (dagreNode.height / 2);
      return { ...node, position: { x, y } };
    }),
    edges: edgesToLayout, 
  };
};

export function Diagram() {
  const [isMounted, setIsMounted] = useState(false);
  const rawChatDiagram = useChatStore(isMounted ? (state) => state.chatDiagram : () => null);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const { fitView } = useReactFlow();
  const initialLayoutPerformedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect 1: Process chatDiagram and set initial (unlayouted) nodes
  useEffect(() => {
    if (!isMounted || rawChatDiagram === null) {
      setNodes([]);
      setEdges([]);
      initialLayoutPerformedRef.current = false;
      return;
    }

    const tablesFromParser: import("@/lib/parse-utils").Table[] = parseJsonToObject(rawChatDiagram);
    const newInitialNodes: AppNode[] = tablesFromParser.map((table, i) => ({
      id: table.name || `node-${i}`,
      data: {
        label: table.name,
        columns: table.columns,
      },
      type: "test",
      position: { x: 0, y: 0 }, // Initial position, Dagre will calculate
    }));

    setNodes(newInitialNodes);
    setEdges([]); 
    initialLayoutPerformedRef.current = false; 
  }, [isMounted, rawChatDiagram, setNodes, setEdges]); 

  useEffect(() => {
    if (!isMounted || nodes.length === 0 || initialLayoutPerformedRef.current) {
      return;
    }

    const allNodesMeasured = nodes.every(
      (node) =>
        node.measured?.width && // Use optional chaining
        node.measured?.height && // Use optional chaining
        node.measured.width > 0 &&
        node.measured.height > 0,
    );

    if (allNodesMeasured) {
      const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });
      setNodes(layouted.nodes);
      // If edges are modified by layout, uncomment setEdges and add it to dependencies
      // setEdges(layouted.edges); 

      initialLayoutPerformedRef.current = true;

      requestAnimationFrame(() => {
        fitView();
      });
    }
  }, [nodes, edges, isMounted, fitView, setNodes]); // Adjusted dependencies

  if (!isMounted) {
    return null;
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      style={{ width: "100%", height: "100%" }}
      fitView // Added fitView prop for initial fit
    >
      <Background />
      <div className="text-black">
        <Controls />
      </div>
    </ReactFlow>
  );
}
