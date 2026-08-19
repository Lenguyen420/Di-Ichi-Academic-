import { useEffect, useMemo, useState } from 'react'
import { Edit3, Eye } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { DataTable } from '../Common/DataTable.jsx'

const getTone = (status) => {
  if (status === 'Hỏng') return 'rose'
  if (status === 'Bảo trì' || status === 'Cần kiểm tra') return 'amber'
  if (status === 'Dự phòng') return 'amber'
  return 'green'
}

const pageSize = 5

export const EquipmentInventoryTable = ({ devices, onEdit, onView }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(devices.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedDevices = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return devices.slice(start, start + pageSize)
  }, [devices, safePage])

  useEffect(() => {
    setCurrentPage(1)
  }, [devices])

  const columns = [
    { header: 'STT', cell: ({ row }) => (safePage - 1) * pageSize + row.index + 1 },
    { header: 'Mã thiết bị', accessorKey: 'id' },
    { header: 'Tên thiết bị', accessorKey: 'name' },
    { header: 'Loại', accessorKey: 'type' },
    { header: 'Phòng', accessorKey: 'room' },
    { header: 'Số lượng', accessorKey: 'quantity' },
    { header: 'Tình trạng', cell: ({ row }) => <Badge tone={getTone(row.original.status)}>{row.original.status}</Badge> },
    { header: 'Lý do', cell: ({ row }) => row.original.status === 'Hỏng' ? row.original.condition || 'Chưa cập nhật' : '—' },
    { header: 'Ngày kiểm tra', accessorKey: 'checkedAt' },
    {
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button className="h-9 min-h-9 w-9 rounded-lg border border-orange-100 bg-orange-50 p-0 text-orange-700 hover:bg-orange-100" title="Xem chi tiết" type="button" variant="ghost" onClick={() => onView(row.original)}>
            <Eye className="!h-5 !w-5 shrink-0" strokeWidth={2.4} />
          </Button>
          <Button className="h-9 min-h-9 w-9 rounded-lg border border-orange-100 bg-orange-50 p-0 text-orange-700 hover:bg-orange-100" title="Chỉnh sửa" type="button" variant="ghost" onClick={() => onEdit(row.original)}>
            <Edit3 className="!h-5 !w-5 shrink-0" strokeWidth={2.4} />
          </Button>
        </div>
      ),
    },
  ]

  const firstItem = devices.length ? (safePage - 1) * pageSize + 1 : 0
  const lastItem = Math.min(safePage * pageSize, devices.length)

  return (
    <div className="space-y-3">
      <DataTable columns={columns} data={pagedDevices} />
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-orange-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center">
        <span className="font-semibold">
          Hiển thị {firstItem}-{lastItem} / {devices.length} thiết bị
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            Trang trước
          </Button>
          <span className="min-w-20 text-center font-black text-slate-900">
            {safePage}/{totalPages}
          </span>
          <Button
            variant="secondary"
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  )
}
