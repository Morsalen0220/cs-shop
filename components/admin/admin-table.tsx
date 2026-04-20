interface AdminTableProps {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
}

const AdminTable: React.FC<AdminTableProps> = ({ columns, rows }) => {
  return (
    <div className="mt-8 overflow-hidden rounded-md border bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-4">
                  {cell}
                </td>
              ))}
              <td className="px-4 py-4 text-right">
                <button className="rounded-md border px-3 py-1 text-lg leading-none">
                  »
                </button>
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
