// hooks/useDataTable.js
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

export const useDataTable = (columns, data) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {},
  });

  return table;
};

export const renderTable = (table) => (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border border-gray-300">
      <thead className="bg-green-100 text-green-800">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border p-3 text-left cursor-pointer select-none"
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted()] ?? ""}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-green-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={table.getAllColumns().length} className="text-center p-4 text-gray-500">
              No data found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
