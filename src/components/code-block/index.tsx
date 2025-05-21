'use client'

import { useState } from 'react'

export function CodeBlock({
  language,
  script,
}: { language: string; script: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-6 p-2 bg-accent text-foreground rounded text-xs hover:bg-card"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
      <pre
        className={`language-${language} whitespace-pre-wrap overflow-auto w-full max-h-96 text-xs !opacity-100 pt-8`}
      >
        <code className={`language-${language}`}>{script}</code>
      </pre>
    </div>
  )
}
