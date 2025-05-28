'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '../code-block'

export function SchemaView({
  schemas,
}: { schemas: { sql: string; mongo: string } }) {
  const [activeTab, setActiveTab] = useState('sql')

  return (
    <div className="space-y-4 h-full pr-2">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sql">SQL</TabsTrigger>
          <TabsTrigger value="mongo">MongoDB</TabsTrigger>
        </TabsList>

        <Card className="py-4 h-full border-none shadow-none relative">
          {/* Renderizar ambos CodeBlocks, pero mostrar solo el activo */}
          <div className={activeTab === 'sql' ? 'block' : 'hidden'}>
            <CodeBlock language="sql" script={schemas.sql || ''} />
          </div>
          <div className={activeTab === 'mongo' ? 'block' : 'hidden'}>
            <CodeBlock language="mongo" script={schemas.mongo || ''} />
          </div>
        </Card>
      </Tabs>
    </div>
  )
}
