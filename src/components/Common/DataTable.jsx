import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

export const DataTable = ({ columns, data }) => {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-orange-100 text-left text-sm">
          <thead className="bg-orange-50 text-xs uppercase text-orange-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-black">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-orange-50">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-orange-50/60">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
