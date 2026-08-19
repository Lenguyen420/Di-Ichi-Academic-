import { Badge } from '../Common/Badge.jsx'
import { DataTable } from '../Common/DataTable.jsx'

const getTone = (readiness) => {
  const value = Number.parseInt(readiness, 10)
  if (value < 85) return 'rose'
  if (value < 95) return 'amber'
  return 'green'
}

export const EquipmentStatusReport = ({ rows }) => {
  const columns = [
    { header: 'Loại thiết bị', accessorKey: 'type' },
    { header: 'Tổng số', accessorKey: 'total' },
    { header: 'Sẵn sàng', accessorKey: 'ready' },
    { header: 'Bảo trì', accessorKey: 'maintenance' },
    { header: 'Tỷ lệ sẵn sàng', cell: ({ row }) => <Badge tone={getTone(row.original.readiness)}>{row.original.readiness}</Badge> },
  ]

  return <DataTable columns={columns} data={rows} />
}
