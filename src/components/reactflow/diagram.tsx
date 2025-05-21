"use client";

import { useEffect, useState, useRef } from 'react'
import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react'
import "@xyflow/react/dist/style.css";
import CustomNode from "./custom-node";
import CustomEdge from './custom-edge' // Importar el CustomEdge
import { parseJsonToObject } from "@/lib/parse-utils";
import { useChatStore } from "@/stores/chat";
import Dagre from "@dagrejs/dagre";

interface NodeData {
  label: string
  columns: Array<{ name: string; type: string }>
  [key: string]: unknown
}

type AppNode = Node<NodeData, string>;
type AppEdge = Edge;

const nodeTypes = {
  test: CustomNode,
};

const edgeTypes = {
  // Definir los tipos de arista
  custom: CustomEdge,
}

const getLayoutedElements = (
  nodesToLayout: AppNode[],
  edgesToLayout: AppEdge[],
  options: { direction: string },
) => {
  const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

  dagreGraph.setGraph({
    rankdir: options.direction,
    nodesep: 120,
    ranksep: 180,
    marginx: 20,
    marginy: 20,
  })

  for (const edge of edgesToLayout) {
    dagreGraph.setEdge(edge.source, edge.target)
  }

  for (const node of nodesToLayout) {
    const nodeWidth = node.measured?.width || 260
    const baseHeight = 100
    const estimatedHeight = baseHeight + node.data.columns.length * 24
    const nodeHeight = node.measured?.height || estimatedHeight

    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    })
  }

  Dagre.layout(dagreGraph)

  const layoutedNodes = nodesToLayout.map((node) => {
    const dagreNodeInfo = dagreGraph.node(node.id) // Contiene x, y, width, height
    return {
      ...node,
      // Centrar el nodo usando sus dimensiones específicas de Dagre
      position: {
        x: dagreNodeInfo.x - dagreNodeInfo.width / 2,
        y: dagreNodeInfo.y - dagreNodeInfo.height / 2,
      },
      positionAbsolute: undefined,
      dragging: false,
    }
  })

  return {
    nodes: layoutedNodes,
    edges: edgesToLayout,
  }
}


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

  useEffect(() => {
    if (!isMounted || rawChatDiagram === null) {
      setNodes([])
      setEdges([])
      initialLayoutPerformedRef.current = false
      return
    }

    const tablesFromParser: import('@/lib/parse-utils').Table[] =
      parseJsonToObject(rawChatDiagram)
    const newInitialNodes: AppNode[] = tablesFromParser.map((table, i) => ({
      id: table.name || `node-${i}`,
      data: {
        label: table.name,
        columns: table.columns,
      },
      type: 'test',
      position: { x: 0, y: 0 },
    }))

    const newInitialEdges: AppEdge[] = []
    for (let i = 0; i < tablesFromParser.length; i++) {
      const table = tablesFromParser[i]
      for (let j = 0; j < table.columns.length; j++) {
        const column = table.columns[j]
        if (column.foreign_key) {
          const fkParts = column.foreign_key.split(/[()]/) // Dividir por ( o )
          const targetTable = fkParts[0]
          const targetColumn = fkParts[1] // La columna referenciada

          const edgeLabel = `${column.name} → ${targetColumn}`

          newInitialEdges.push({
            id: `fk-${table.name}-${column.name}-${targetTable}-${targetColumn}`,
            source: table.name,
            target: targetTable,
            label: edgeLabel,
            type: 'custom', // Especificar que se use el tipo de arista custom
          })
        }
      }
    }

    setNodes(newInitialNodes)
    setEdges(newInitialEdges) // Usar los nuevos edges generados
    initialLayoutPerformedRef.current = false
  }, [isMounted, rawChatDiagram, setNodes, setEdges])

  useEffect(() => {
    if (!isMounted || nodes.length === 0 || initialLayoutPerformedRef.current) {
      return
    }

    const allNodesMeasured = nodes.every(
      (node) =>
        node.measured?.width &&
        node.measured?.height &&
        node.measured.width > 0 &&
        node.measured.height > 0,
    )

    if (allNodesMeasured) {
      const layouted = getLayoutedElements(nodes, edges, { direction: 'LR' })
      setNodes(layouted.nodes)
      initialLayoutPerformedRef.current = true

      requestAnimationFrame(() => {
        fitView({ padding: 0.3 })
      })
    }
  }, [nodes, edges, isMounted, fitView, setNodes])

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
      edgeTypes={edgeTypes} // Pasar los tipos de arista a ReactFlow
      style={{ width: '100%', height: '100%' }}
      fitView
      minZoom={0.2}
      maxZoom={1.5}
    >
      <Background />
      <div className="text-black">
        <Controls />
      </div>
    </ReactFlow>
  )
}
