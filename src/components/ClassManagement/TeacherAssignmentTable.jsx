import { Badge } from '../Common/Badge.jsx'
import { DataTable } from '../Common/DataTable.jsx'

const getTone = (status) => {
  if (status === 'Chưa phân lớp') return 'amber'
  return 'green'
}

export const TeacherAssignmentTable = ({ assignments, onAssign, onViewSchedule }) => {
  const columns = [
    { header: 'Giáo viên', accessorKey: 'teacher' },
    { header: 'Chuyên môn', accessorKey: 'specialty' },
    { header: 'Lớp đang dạy', cell: ({ row }) => row.original.classNames.length ? row.original.classNames.join(', ') : '—' },
    { header: 'Số lớp', accessorKey: 'classCount' },
    {
      header: 'Lịch dạy',
      cell: ({ row }) => row.original.teachingSchedule || row.original.teachingDays || '—',
    },
    { header: 'Trạng thái', cell: ({ row }) => <Badge tone={getTone(row.original.status)}>{row.original.status}</Badge> },
    {
      header: 'Thao tác',
      cell: ({ row }) => (
        row.original.status === 'Chưa phân lớp' ? (
          <button className="rounded-lg px-3 py-2 text-sm font-black text-orange-600 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onAssign(row.original)}>
            Phân công
          </button>
        ) : (
          <button className="rounded-lg px-3 py-2 text-sm font-black text-orange-600 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onViewSchedule(row.original)}>
            Xem lịch
          </button>
        )
      ),
    },
  ]

  return <DataTable columns={columns} data={assignments} />
}
