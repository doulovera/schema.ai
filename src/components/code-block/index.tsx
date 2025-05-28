'use client'

import { useState, useMemo, memo, useCallback, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Download } from 'lucide-react'
import { useConfigStore } from '@/stores/config'

interface CodeBlockProps {
  language: string
  script: string
}

export const CodeBlock = memo(function CodeBlock({
  language,
  script,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { isDarkMode } = useConfigStore()

  // ✅ Eliminar el delay - cargar syntax highlighter inmediatamente para evitar parpadeo
  // const [isHighlighterReady, setIsHighlighterReady] = useState(false)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsHighlighterReady(true)
  //   }, 50)
  //   return () => clearTimeout(timer)
  // }, [])

  // Memoizar la función de copia para evitar re-creaciones
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(script)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }, [script])

  // Función para descargar el script como archivo
  const handleDownload = useCallback(() => {
    try {
      setIsDownloading(true)

      // Determinar la extensión del archivo según el lenguaje
      const fileExtension =
        language === 'sql' ? '.sql' : language === 'mongo' ? '.js' : '.txt'
      const fileName = `schema-${language}${fileExtension}`

      // Crear el blob con el contenido
      const blob = new Blob([script], { type: 'text/plain;charset=utf-8' })

      // Crear la URL y descargar
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setTimeout(() => setIsDownloading(false), 1000)
    } catch (err) {
      console.error('Failed to download file: ', err)
      setIsDownloading(false)
    }
  }, [script, language])

  // Memoizar el tema para evitar re-evaluaciones costosas
  const syntaxTheme = useMemo(
    () => (isDarkMode ? oneDark : oneLight),
    [isDarkMode],
  )

  // Memoizar el estilo para evitar re-cálculos
  const customStyle = useMemo(
    () => ({
      margin: 0,
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      maxHeight: '24rem',
      paddingRight: '0.5rem',
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fafafa',
    }),
    [isDarkMode],
  )

  // Memoizar las props del código para evitar re-cálculos
  const codeTagProps = useMemo(
    () => ({
      style: {
        fontSize: '0.75rem',
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      },
    }),
    [],
  )

  // Memoizar el lenguaje procesado
  const processedLanguage = useMemo(
    () => (language === 'mongo' ? 'javascript' : language),
    [language],
  )

  // Memoizar las props del SyntaxHighlighter para evitar re-renderizados innecesarios
  const syntaxHighlighterProps = useMemo(
    () => ({
      className:
        'scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent scrollbar-thumb-rounded',
      language: processedLanguage,
      style: syntaxTheme,
      customStyle,
      codeTagProps,
    }),
    [processedLanguage, syntaxTheme, customStyle, codeTagProps],
  )

  return (
    <div className="relative">
      {/* Contenedor de botones - ahora con dos botones */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {/* Botón de descarga */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading || !script.trim()}
          className={`
            flex items-center gap-2 px-3 py-1.5
            rounded-md text-xs font-medium
            transition-all duration-200 ease-in-out
            backdrop-blur-sm
            ${
              isDownloading
                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                : 'bg-muted/80 text-muted-foreground border border-border/50 hover:bg-accent/80 hover:text-accent-foreground hover:border-border disabled:opacity-50 disabled:cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-1
          `}
          aria-label={isDownloading ? 'Descargando...' : 'Descargar archivo'}
        >
          <Download
            size={14}
            className={
              isDownloading
                ? 'text-blue-600 dark:text-blue-400 animate-pulse'
                : ''
            }
          />
          <span className="hidden sm:inline">
            {isDownloading ? 'Descargando...' : 'Descargar'}
          </span>
        </button>

        {/* Botón de copia */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={!script.trim()}
          className={`
            flex items-center gap-2 px-3 py-1.5
            rounded-md text-xs font-medium
            transition-all duration-200 ease-in-out
            backdrop-blur-sm
            ${
              isCopied
                ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                : 'bg-muted/80 text-muted-foreground border border-border/50 hover:bg-accent/80 hover:text-accent-foreground hover:border-border disabled:opacity-50 disabled:cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-1
          `}
          aria-label={isCopied ? 'Copiado' : 'Copiar código'}
        >
          {isCopied ? (
            <>
              <Check size={14} className="text-green-600 dark:text-green-400" />
              <span className="hidden sm:inline">Copiado</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="hidden sm:inline">Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* ✅ Syntax highlighter sin delay para evitar parpadeo */}
      <SyntaxHighlighter {...syntaxHighlighterProps}>
        {script}
      </SyntaxHighlighter>
    </div>
  )
})
