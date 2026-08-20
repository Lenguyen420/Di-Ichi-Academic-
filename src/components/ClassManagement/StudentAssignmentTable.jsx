import { Badge } from '../Common/Badge.jsx'
import { DataTable } from '../Common/DataTable.jsx'

const getStatusTone = (status) => {
  if (status === 'Chờ phân lớp') return 'amber'
  if (status === 'Bảo lưu') return 'slate'
  return 'green'
}

const getPaymentTone = (status) => {
  if (status === 'Còn công nợ') return 'rose'
  if (status === 'Đã đặt cọc') return 'amber'
  return 'green'
}

export const StudentAssignmentTable = ({ onAssign, students }) => {
  const columns = [
    { header: 'Học viên', cell: ({ row }) => <StudentInfo student={row.original} /> },
    { header: 'Khóa học', accessorKey: 'targetCourse' },
    { header: 'Lớp hiện tại', cell: ({ row }) => row.original.className || 'Chưa phân lớp' },
    { header: 'Lịch học', cell: ({ row }) => row.original.scheduleLabel || '—' },
    { header: 'Học phí', cell: ({ row }) => <Badge tone={getPaymentTone(row.original.paymentStatus)}>{row.original.paymentStatus}</Badge> },
    { header: 'Trạng thái', cell: ({ row }) => <Badge tone={getStatusTone(row.original.status)}>{row.original.status}</Badge> },
    {
      header: 'Thao tác',
      cell: ({ row }) => (
        <button className="rounded-lg px-3 py-2 text-sm font-black text-orange-600 transition hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => onAssign(row.original)}>
          {row.original.classId ? 'Chuyển lớp' : 'Phân lớp'}
        </button>
      ),
    },
  ]

  return <DataTable columns={columns} data={students} />
}

const StudentInfo = ({ student }) => (
  <div>
    <p className="font-black text-slate-900">{student.name}</p>
    <p className="mt-1 text-xs font-semibold text-slate-500">{student.phone} · {student.email}</p>
  </div>
)
