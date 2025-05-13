export default function CustomNode({ data }) {
  return (
    <div className="bg-white shadow-xl rounded-lg w-64 border border-gray-200">
      <div className="bg-sky-500 text-white p-3 rounded-t-lg">
        <h1 className="text-lg font-semibold truncate">{data.label}</h1>
      </div>
      <div className="p-3">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">COLUMNS</h2>
        <ul className="space-y-1 text-xs">
          {data.columns.map((column, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-1.5 bg-gray-50 hover:bg-gray-100 rounded"
            >
              <span className="font-medium text-gray-700">{column.name}</span>
              <span className="text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full text-xxs">
                {column.type}
              </span>
            </li>
          ))}
          {data.columns.length === 0 && (
            <li className="text-gray-400 italic">No columns defined.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
