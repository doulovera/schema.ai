import type { Node, NodeChange } from "@xyflow/react"; // Si usas React Flow
import { applyNodeChanges } from "@xyflow/react"
import type { Column, Table } from "@/lib/parse-utils";

export type TableNode = Node<{
  label: string;
  columns: Column[];
}>;

export type NodeAction =
  | { type: "INIT_NODES"; payload: Table[] }
  | { type: "ADD_NODE"; payload: Table }
  | { type: "REMOVE_NODE"; payload: string }
  | { type: "UPDATE_NODES"; payload: { changes: NodeChange[] } };


const nodesPerRow = 3;
const horizontalSpacing = 300;
const verticalSpacing = 250;

export function nodesReducer(
  state: TableNode[],
  action: NodeAction
): TableNode[] {
  switch (action.type) {
    case "INIT_NODES": {
      return action.payload.map((table, index) => {
        const rowIndex = Math.floor(index / nodesPerRow);
        const colIndex = index % nodesPerRow;

        return {
          id: table.name,
          type: "test",
          position: {
            x: colIndex * horizontalSpacing,
            y: rowIndex * verticalSpacing,
          },
          data: {
            label: table.name,
            columns: table.columns,
          },
        };
      });
    }

    case "ADD_NODE": {
      const newIndex = state.length;
      const rowIndex = Math.floor(newIndex / nodesPerRow);
      const colIndex = newIndex % nodesPerRow;

      return [
        ...state,
        {
          id: action.payload.name,
          type: "test",
          position: {
            x: colIndex * horizontalSpacing,
            y: rowIndex * verticalSpacing,
          },
          data: {
            label: action.payload.name,
            columns: action.payload.columns,
          },
        },
      ];
    }

    case "UPDATE_NODES": {
        return applyNodeChanges(action.payload.changes, state);
    }

    case "REMOVE_NODE":
      return state.filter((node) => node.id !== action.payload);

    default:
      return state;
  }
}
