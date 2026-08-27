import { Badge } from '../Common/Badge.jsx'
import { DataTable } from '../Common/DataTable.jsx'

export const ClassListTable = ({ classes, onView }) => {
  const columns = [
    { header: 'Lớp học', accessorKey: 'name' },
    { header: 'Khóa học', accessorKey: 'course' },
    { header: 'Cơ sở', accessorKey: 'campus' },
    { header: 'Giáo viên', cell: ({ row }) => row.original.teacher || '' },
    { header: 'Lịch học', accessorKey: 'schedule' },
    { header: 'Sĩ số', cell: ({ row }) => <Badge>{row.original.students}</Badge> },
    { header: 'Phòng', accessorKey: 'room' },
    { header: 'Trạng thái', cell: ({ row }) => <Badge tone={row.original.status === 'Đang học' ? 'green' : 'amber'}>{row.original.status}</Badge> },
    {
      header: 'Thao tác',
      cell: ({ row }) => (
        <button className="rounded-lg px-3 py-2 text-sm font-black text-orange-600 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onView(row.original)}>
          Xem chi tiết
        </button>
      ),
    },
  ]

  return <DataTable columns={columns} data={classes} />
}
