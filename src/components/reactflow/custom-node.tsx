import { useEffect } from 'react'
import { useUpdateNodeInternals, Handle, Position } from '@xyflow/react'

type Props = {
  id: string
  data: {
    label: string
    columns: Array<{
      name: string
      type: string
    }>
  }
}

export default function CustomNode({ id, data }: Props) {
  const updateNodeInternals = useUpdateNodeInternals()

  // biome-ignore lint/correctness/useExhaustiveDependencies: .-.
  useEffect(() => {
    updateNodeInternals(id)
  }, [id, data.columns.length, updateNodeInternals])

  return (
    <div className="bg-white dark:bg-card shadow-xl rounded-lg w-64 border border-gray-200 dark:border-border">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
      />
      <div className="bg-sky-500 dark:bg-primary text-white dark:text-primary-foreground p-3 rounded-t-lg">
        <h1 className="text-lg font-semibold truncate">{data.label}</h1>
      </div>
      <div className="p-3">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-muted-foreground mb-2">
          COLUMNS
        </h2>
        <ul className="space-y-1 text-xs">
          {data.columns.map((column) => (
            <li
              key={`${id}-${column.name}`} // Usar una combinación del id del nodo y el nombre de la columna para una key única
              className="flex justify-between items-center p-1.5 bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-muted-foreground/10 rounded"
            >
              <span className="font-medium text-gray-700 dark:text-foreground">
                {column.name}
              </span>
              <span className="text-gray-500 dark:text-muted-foreground bg-gray-200 dark:bg-muted px-1.5 py-0.5 rounded-full text-xxs">
                {column.type}
              </span>
            </li>
          ))}
          {data.columns.length === 0 && (
            <li className="text-gray-400 dark:text-muted-foreground italic">
              No columns defined.
            </li>
          )}
        </ul>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
      />
    </div>
  )
}
