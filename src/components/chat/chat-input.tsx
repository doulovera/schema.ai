"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ChatInput() {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Handle submission logic here
    console.log("Submitted:", input)
    setInput("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="generame..." className="flex-1" />
      <Button type="submit" size="sm">
        ok
      </Button>
    </form>
  )
}
