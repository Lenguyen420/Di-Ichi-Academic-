import { Badge } from '../Common/Badge.jsx'
import { DataTable } from '../Common/DataTable.jsx'

const getTone = (utilization) => {
  const value = Number.parseInt(utilization, 10)
  if (value >= 100) return 'rose'
  if (value >= 85) return 'amber'
  return 'green'
}

export const TeacherAllocationReport = ({ rows }) => {
  const columns = [
    { header: 'Giáo viên', accessorKey: 'teacher' },
    { header: 'Số lớp', accessorKey: 'assignedClasses' },
    { header: 'Giờ/tuần', accessorKey: 'weeklyHours' },
    { header: 'Mức sử dụng', cell: ({ row }) => <Badge tone={getTone(row.original.utilization)}>{row.original.utilization}</Badge> },
    { header: 'Khuyến nghị', accessorKey: 'recommendation' },
  ]

  return <DataTable columns={columns} data={rows} />
}
