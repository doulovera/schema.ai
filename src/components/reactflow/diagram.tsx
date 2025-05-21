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
import CustomEdge from './custom-edge'
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
    const dagreNodeInfo = dagreGraph.node(node.id)
    return {
      ...node,
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
  const { setViewport } = useReactFlow()
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
    for (const table of tablesFromParser) {
      for (const column of table.columns) {
        if (column.foreign_key) {
          const fkParts = column.foreign_key.split(/[()]/)
          const targetTable = fkParts[0]
          const targetColumn = fkParts[1]
          const edgeLabel = `${column.name} → ${targetColumn}`

          newInitialEdges.push({
            id: `fk-${table.name}-${column.name}-${targetTable}-${targetColumn}`,
            source: table.name,
            target: targetTable,
            label: edgeLabel,
            type: 'custom',
          })
        }
      }
    }

    setNodes(newInitialNodes)
    setEdges(newInitialEdges)
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
        // 1. Calcular bounding box de los nodos
        const positions = layouted.nodes.map((node) => ({
          x: node.position.x,
          y: node.position.y,
          width: node.measured?.width || 260,
          height: node.measured?.height || 100 + node.data.columns.length * 24,
        }))

        const minX = Math.min(...positions.map((p) => p.x))
        const minY = Math.min(...positions.map((p) => p.y))
        const maxX = Math.max(...positions.map((p) => p.x + p.width))
        const maxY = Math.max(...positions.map((p) => p.y + p.height))

        const boxWidth = maxX - minX
        const boxHeight = maxY - minY

        // 2. Calcular el centro del bounding box
        const centerX = minX + boxWidth / 2
        const centerY = minY + boxHeight / 2

        // 3. Centrar el viewport usando ese centro y aplicar zoom personalizado
        const zoom = 1 // Ajusta si deseas más alejado o cercano
        setViewport({
          x: window.innerWidth / 2 - centerX * zoom,
          y: window.innerHeight / 2 - centerY * zoom,
          zoom,
        })
      })
    }
  }, [nodes, edges, isMounted, setNodes, setViewport])


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
      edgeTypes={edgeTypes}
      style={{ width: '100%', height: '100%' }}
      minZoom={0.1}
      maxZoom={1.5}
    >
      <Background />
      <div className="text-black">
        <Controls />
      </div>
    </ReactFlow>
  )
}
