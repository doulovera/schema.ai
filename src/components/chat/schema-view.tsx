'use client'

import { useState, memo, useMemo, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '../code-block'

interface SchemaViewProps {
  schemas: { sql: string; mongo: string }
}

export const SchemaView = memo(function SchemaView({
  schemas,
}: SchemaViewProps) {
  const [activeTab, setActiveTab] = useState('sql')
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set()) // ✅ Iniciar vacío
  const [isInitialized, setIsInitialized] = useState(false)

  // ✅ Inicializar después del primer render para evitar parpadeo
  useEffect(() => {
    // Usar requestAnimationFrame para asegurar que el DOM esté listo
    requestAnimationFrame(() => {
      setLoadedTabs(new Set(['sql'])) // Pre-cargar SQL después del montaje
      setIsInitialized(true)
    })
  }, [])

  // Memoizar el cambio de tab para incluir la lógica de carga lazy
  const handleTabChange = useMemo(() => {
    return (value: string) => {
      setActiveTab(value)
      setLoadedTabs((prev) => new Set([...prev, value]))
    }
  }, [])

  // ✅ Mostrar placeholder ligero hasta que esté inicializado
  if (!isInitialized) {
    return (
      <div className="space-y-4 h-full pr-2">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sql">SQL</TabsTrigger>
            <TabsTrigger value="mongo">MongoDB</TabsTrigger>
          </TabsList>
          <div className="h-full relative flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              Cargando schemas...
            </div>
          </div>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-4 h-full pr-2">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sql">SQL</TabsTrigger>
          <TabsTrigger value="mongo">MongoDB</TabsTrigger>
        </TabsList>

        {/* ✅ Contenedor simple para evitar parpadeo de estilos */}
        <div className="h-full relative">
          {/* ✅ Renderizado condicional real - solo renderizar tabs que han sido visitados */}
          {loadedTabs.has('sql') && (
            <div
              className={activeTab === 'sql' ? 'block' : 'hidden'}
              style={{ height: '100%' }} // ✅ Asegurar altura completa
            >
              <CodeBlock language="sql" script={schemas.sql || ''} />
            </div>
          )}
          {loadedTabs.has('mongo') && (
            <div
              className={activeTab === 'mongo' ? 'block' : 'hidden'}
              style={{ height: '100%' }} // ✅ Asegurar altura completa
            >
              <CodeBlock language="mongo" script={schemas.mongo || ''} />
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
})
