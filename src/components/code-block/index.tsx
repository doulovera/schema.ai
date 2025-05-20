'use client'

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/toolbar/prism-toolbar.js";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js";

export function CodeBlock ({ language, script }: { language: string; script: string }) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: no need
  useEffect(() => {
    Prism.highlightAll();
  }, [script]);

  if (!script || !language) return null;

  return (
    <pre className="whitespace-pre-wrap toolbar w-full !opacity-100">
      <code
        className={`language-${language}`}
      >
        {script}
      </code>
    </pre>
  )
}