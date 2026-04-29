interface AdminTableProps {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
  onEdit?: (rowIndex: number) => void;
  onDelete?: (rowIndex: number) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ columns, rows, onEdit, onDelete }) => {
  return (
    <div className="mt-8 overflow-x-auto rounded-md border bg-white">
      <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-3 font-medium sm:px-4">
                {column}
              </th>
            ))}
            <th className="w-32 px-3 py-3 sm:px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-4 sm:px-4">
                  {cell}
                </td>
              ))}
              <td className="space-x-2 whitespace-nowrap px-3 py-4 text-right sm:px-4">
                {onEdit && (
                  <button
                    onClick={() => onEdit(rowIndex)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(rowIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-gray-500" colSpan={columns.length + 1}>
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
