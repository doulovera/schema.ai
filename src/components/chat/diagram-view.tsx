"use client"

import { useRef, useEffect } from "react"

export function DiagramView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw sample database diagram
    drawSampleDiagram(ctx, canvas.width, canvas.height)

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !ctx) return
      canvasRef.current.width = canvasRef.current.offsetWidth
      canvasRef.current.height = canvasRef.current.offsetHeight
      drawSampleDiagram(ctx, canvasRef.current.width, canvasRef.current.height)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const drawSampleDiagram = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw Users table
    drawTable(ctx, width * 0.2, height * 0.3, "Users", [
      { name: "id", type: "INT", pk: true },
      { name: "username", type: "VARCHAR(50)" },
      { name: "email", type: "VARCHAR(100)" },
    ])

    // Draw Posts table
    drawTable(ctx, width * 0.5, height * 0.3, "Posts", [
      { name: "id", type: "INT", pk: true },
      { name: "title", type: "VARCHAR(100)" },
      { name: "content", type: "TEXT" },
      { name: "user_id", type: "INT", fk: true },
    ])

    // Draw Comments table
    drawTable(ctx, width * 0.8, height * 0.3, "Comments", [
      { name: "id", type: "INT", pk: true },
      { name: "content", type: "TEXT" },
      { name: "post_id", type: "INT", fk: true },
      { name: "user_id", type: "INT", fk: true },
    ])

    // Draw Categories table
    drawTable(ctx, width * 0.5, height * 0.6, "Categories", [
      { name: "id", type: "INT", pk: true },
      { name: "name", type: "VARCHAR(50)" },
    ])

    // Draw PostCategories table
    drawTable(ctx, width * 0.65, height * 0.6, "PostCategories", [
      { name: "post_id", type: "INT", pk: true, fk: true },
      { name: "category_id", type: "INT", pk: true, fk: true },
    ])

    // Draw relationships
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1

    // Users -> Posts
    drawRelationship(ctx, width * 0.25, height * 0.3, width * 0.45, height * 0.3)

    // Posts -> Comments
    drawRelationship(ctx, width * 0.55, height * 0.3, width * 0.75, height * 0.3)

    // Users -> Comments
    drawRelationship(ctx, width * 0.2, height * 0.35, width * 0.8, height * 0.25)

    // Posts -> PostCategories
    drawRelationship(ctx, width * 0.5, height * 0.4, width * 0.65, height * 0.55)

    // Categories -> PostCategories
    drawRelationship(ctx, width * 0.55, height * 0.6, width * 0.6, height * 0.6)
  }

  const drawTable = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    name: string,
    columns: Array<{ name: string; type: string; pk?: boolean; fk?: boolean }>,
  ) => {
    const width = 150
    const headerHeight = 30
    const rowHeight = 25
    const height = headerHeight + rowHeight * columns.length

    // Draw table background
    ctx.fillStyle = "#e6f2ff"
    ctx.fillRect(x - width / 2, y - height / 2, width, height)

    // Draw table border
    ctx.strokeStyle = "#0066cc"
    ctx.lineWidth = 2
    ctx.strokeRect(x - width / 2, y - height / 2, width, height)

    // Draw header
    ctx.fillStyle = "#0066cc"
    ctx.fillRect(x - width / 2, y - height / 2, width, headerHeight)

    // Draw header text
    ctx.fillStyle = "white"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(name, x, y - height / 2 + headerHeight / 2)

    // Draw column separator lines
    ctx.strokeStyle = "#0066cc"
    ctx.lineWidth = 1
    for (let i = 1; i <= columns.length; i++) {
      const lineY = y - height / 2 + headerHeight + i * rowHeight
      ctx.beginPath()
      ctx.moveTo(x - width / 2, lineY)
      ctx.lineTo(x + width / 2, lineY)
      ctx.stroke()
    }

    // Draw columns
    ctx.fillStyle = "black"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"

    columns.forEach((column, index) => {
      const columnY = y - height / 2 + headerHeight + index * rowHeight + rowHeight / 2

      let prefix = ""
      if (column.pk) prefix += "🔑 "
      if (column.fk) prefix += "🔗 "

      ctx.fillText(`${prefix}${column.name}: ${column.type}`, x - width / 2 + 10, columnY)
    })
  }

  const drawRelationship = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    // Draw arrow at end
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const arrowSize = 10

    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6), y2 - arrowSize * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6), y2 - arrowSize * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fillStyle = "#888"
    ctx.fill()
  }

  return (
    <div className="w-full h-full bg-white rounded-md border">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
    </div>
  )
}
