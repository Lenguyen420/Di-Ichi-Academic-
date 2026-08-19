import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { maintenanceEmployees, maintenanceHistoryData } from '../../datas/maintenanceData.js'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'
import { DataTable } from '../Common/DataTable.jsx'

const severityLabel = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  urgent: 'Khẩn cấp',
}

const severityTone = {
  low: 'green',
  medium: 'amber',
  high: 'rose',
  urgent: 'rose',
}

const statusLabel = {
  reported: 'Chờ xử lý',
  accepted: 'Đã tiếp nhận',
  checking: 'Đang kiểm tra',
  repairing: 'Đang sửa chữa',
  waiting_parts: 'Chờ linh kiện',
  completed: 'Đã hoàn tất',
  cancelled: 'Đã hủy',
}

const statusTone = {
  reported: 'amber',
  accepted: 'slate',
  checking: 'orange',
  repairing: 'rose',
  waiting_parts: 'amber',
  completed: 'green',
  cancelled: 'slate',
}

const nextStatus = {
  reported: 'accepted',
  accepted: 'checking',
  checking: 'repairing',
  repairing: 'waiting_parts',
  waiting_parts: 'completed',
}

const formatCurrency = (value) => value == null ? '—' : `${Number(value).toLocaleString('vi-VN')}đ`
const formatDate = (value) => value ? value.split('-').reverse().join('/') : '—'
const formatTimelineDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const matchesKeyword = (values, keyword) => {
  if (!keyword) return true
  return values.some((value) => String(value || '').toLowerCase().includes(keyword))
}

const flattenEquipment = (rooms) => rooms.flatMap((room) => room.equipment.map((item) => ({
  ...item,
  campus: room.campus,
  capacity: room.capacity,
  roomId: room.roomId,
  roomName: room.roomName,
})))

const pageSize = 8

export const MaintenanceTable = ({
  allocationRooms,
  equipmentRows,
  headerRight = null,
  maintenanceRows,
  setMaintenanceRows,
  syncAllocationStatus,
  syncEquipmentStatus,
}) => {
  const [historyRows, setHistoryRows] = useState(maintenanceHistoryData)
  const [keyword, setKeyword] = useState('')
  const [roomFilter, setRoomFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateRangeFilter, setDateRangeFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [completionTicket, setCompletionTicket] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const equipmentItems = useMemo(() => flattenEquipment(allocationRooms), [allocationRooms])
  const equipmentById = useMemo(() => new Map(equipmentItems.map((item) => [item.equipmentId, item])), [equipmentItems])
  const roomById = useMemo(() => new Map(allocationRooms.map((room) => [room.roomId, room])), [allocationRooms])
  const employeeById = useMemo(() => new Map(maintenanceEmployees.map((employee) => [employee.id, employee])), [])
  const technicalEmployees = maintenanceEmployees.filter((employee) => employee.role === 'Kỹ thuật viên')
  const normalizedKeyword = keyword.trim().toLowerCase()

  const joinedTickets = useMemo(() => maintenanceRows.map((ticket) => {
    const equipment = equipmentById.get(ticket.equipmentId)
    const room = roomById.get(ticket.roomId)
    return {
      ...ticket,
      equipment,
      room,
      assignee: employeeById.get(ticket.assignedTo),
      reporter: employeeById.get(ticket.reportedBy),
    }
  }), [employeeById, equipmentById, maintenanceRows, roomById])

  const filteredTickets = useMemo(() => joinedTickets.filter((ticket) => {
    const matchesRoom = !roomFilter || ticket.roomId === roomFilter
    const matchesCategory = !categoryFilter || ticket.equipment?.category === categoryFilter
    const matchesSeverity = !severityFilter || ticket.severity === severityFilter
    const matchesStatus = !statusFilter || ticket.status === statusFilter
    const matchesDate = !dateRangeFilter || ticket.reportedAt?.startsWith(dateRangeFilter)
    const matchesSearch = matchesKeyword([
      ticket.id,
      ticket.issue,
      ticket.equipment?.equipmentName,
      ticket.equipment?.equipmentCode,
      ticket.room?.roomName,
    ], normalizedKeyword)
    return matchesRoom && matchesCategory && matchesSeverity && matchesStatus && matchesDate && matchesSearch
  }), [categoryFilter, dateRangeFilter, joinedTickets, normalizedKeyword, roomFilter, severityFilter, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedTickets = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredTickets.slice(start, start + pageSize)
  }, [filteredTickets, safePage])

  useEffect(() => {
    setCurrentPage(1)
  }, [categoryFilter, dateRangeFilter, keyword, roomFilter, severityFilter, statusFilter])

  const stats = useMemo(() => {
    const completed = maintenanceRows.filter((ticket) => ticket.status === 'completed')
    return [
      { label: 'Tổng phiếu', value: maintenanceRows.length, tone: 'from-orange-50 via-white to-amber-50' },
      { label: 'Chờ xử lý', value: maintenanceRows.filter((ticket) => ticket.status === 'reported').length, tone: 'from-amber-50 via-white to-yellow-50' },
      { label: 'Đang sửa', value: maintenanceRows.filter((ticket) => ['checking', 'repairing', 'waiting_parts'].includes(ticket.status)).length, tone: 'from-rose-50 via-white to-orange-50' },
      { label: 'Đã hoàn tất', value: completed.length, tone: 'from-emerald-50 via-white to-teal-50' },
      { label: 'Chi phí', value: formatCurrency(maintenanceRows.reduce((total, ticket) => total + (ticket.actualCost ?? ticket.estimatedCost ?? 0), 0)), tone: 'from-sky-50 via-white to-cyan-50' },
    ]
  }, [maintenanceRows])

  const roomOptions = [...new Set(joinedTickets.map((ticket) => ticket.room).filter(Boolean).map((room) => room.roomId))]
  const categoryOptions = [...new Set(equipmentItems.map((item) => item.category))]

  const resetFilters = () => {
    setKeyword('')
    setRoomFilter('')
    setCategoryFilter('')
    setSeverityFilter('')
    setStatusFilter('')
    setDateRangeFilter('')
  }

  const addHistory = (maintenanceId, employeeId, content) => {
    setHistoryRows((current) => [
      ...current,
      { id: `MH${current.length + 1}`.padStart(5, '0'), maintenanceId, dateTime: new Date().toISOString(), employeeId, content },
    ])
  }

  const updateTicket = (ticketId, patch) => {
    setMaintenanceRows((current) => current.map((ticket) => ticket.id === ticketId ? { ...ticket, ...patch } : ticket))
    setSelectedTicket((current) => current?.id === ticketId ? { ...current, ...patch } : current)
  }

  const handleAssign = (ticketId, assignedTo) => {
    updateTicket(ticketId, { assignedTo })
    addHistory(ticketId, assignedTo, `được phân công xử lý`)
  }

  const handleMoveNextStatus = (ticket) => {
    const next = nextStatus[ticket.status]
    if (!next) return
    if (next === 'completed') {
      setCompletionTicket(ticket)
      return
    }
    updateTicket(ticket.id, { status: next })
    addHistory(ticket.id, ticket.assignedTo || 'EMP004', `chuyển trạng thái sang ${statusLabel[next]}`)
  }

  const handleComplete = ({ actualCost, completedAt, result, resolution, ticket }) => {
    const completedStatus = result === 'success' ? 'completed' : 'completed'
    updateTicket(ticket.id, {
      actualCost: Number(actualCost) || 0,
      completedAt,
      resolution,
      result,
      status: completedStatus,
    })

    const equipment = equipmentById.get(ticket.equipmentId)
    if (result === 'success') {
      syncEquipmentStatus(equipment?.equipmentCode, 'Tốt')
      syncAllocationStatus(ticket.equipmentId, { allocationStatus: 'Đang sử dụng', condition: 'Tốt' })
    } else if (result === 'failed') {
      syncEquipmentStatus(equipment?.equipmentCode, 'Hỏng')
      syncAllocationStatus(ticket.equipmentId, { allocationStatus: 'Tạm giữ', condition: 'Hỏng' })
    }
    addHistory(ticket.id, ticket.assignedTo || 'EMP004', `hoàn tất bảo trì: ${result === 'success' ? 'đã sửa thành công' : 'không thể sửa'}`)
    setCompletionTicket(null)
  }

  const handleCreateTicket = ({ equipmentId, issue, note, reportedAt, reportedBy, severity }) => {
    const equipment = equipmentById.get(equipmentId)
    if (!equipment) return
    const nextId = `BT${String(maintenanceRows.length + 1).padStart(3, '0')}`
    const nextTicket = {
      id: nextId,
      equipmentId,
      roomId: equipment.roomId,
      reportedBy,
      assignedTo: '',
      issue,
      severity,
      status: 'reported',
      reportedAt,
      acceptedAt: null,
      startedAt: null,
      expectedDoneAt: '',
      estimatedCost: 0,
      actualCost: null,
      note,
    }
    setMaintenanceRows((current) => [nextTicket, ...current])
    syncEquipmentStatus(equipment.equipmentCode, 'Bảo trì')
    syncAllocationStatus(equipmentId, { allocationStatus: 'Tạm giữ', condition: 'Đang bảo trì' })
    addHistory(nextId, reportedBy, 'báo hỏng')
    setIsCreateOpen(false)
  }

  const columns = [
    { header: 'Mã phiếu', accessorKey: 'id' },
    { header: 'Thiết bị', cell: ({ row }) => row.original.equipment?.equipmentName || '—' },
    { header: 'Mã thiết bị', cell: ({ row }) => row.original.equipment?.equipmentCode || '—' },
    { header: 'Phòng', cell: ({ row }) => row.original.room?.roomName || '—' },
    { header: 'Nội dung sự cố', accessorKey: 'issue' },
    { header: 'Mức độ', cell: ({ row }) => <Badge tone={severityTone[row.original.severity]}>{severityLabel[row.original.severity]}</Badge> },
    { header: 'Ngày báo', cell: ({ row }) => formatDate(row.original.reportedAt) },
    { header: 'Người báo', cell: ({ row }) => row.original.reporter?.name || '—' },
    { header: 'Trạng thái', cell: ({ row }) => <Badge tone={statusTone[row.original.status]}>{statusLabel[row.original.status]}</Badge> },
    { header: 'Chi phí', cell: ({ row }) => formatCurrency(row.original.actualCost ?? row.original.estimatedCost) },
    { header: 'Thao tác', cell: ({ row }) => <Button type="button" variant="secondary" onClick={() => setSelectedTicket(row.original)}>Xem chi tiết</Button> },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-950 md:text-3xl">Bảo trì / Hỏng hóc</h2>
          <p className="mt-2 text-sm text-slate-500">Quản lý các thiết bị hỏng, yêu cầu bảo trì và lịch sử sửa chữa.</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          {headerRight}
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            <Plus size={17} />
            Báo hỏng / Tạo phiếu
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <Card key={item.label} className={`rounded-lg bg-gradient-to-br ${item.tone}`}>
            <p className="text-sm font-bold text-slate-600">{item.label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="h-11 w-full rounded-lg border border-orange-100 bg-white pl-10 pr-3 text-sm font-semibold outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="Tìm thiết bị, mã thiết bị, phòng học..." value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </div>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            <FilterSelect label="Phòng học" value={roomFilter} onChange={setRoomFilter} options={roomOptions.map((roomId) => ({ label: roomById.get(roomId)?.roomName || roomId, value: roomId }))} />
            <FilterSelect label="Loại thiết bị" value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions.map((item) => ({ label: item, value: item }))} />
            <FilterSelect label="Mức độ" value={severityFilter} onChange={setSeverityFilter} options={Object.entries(severityLabel).map(([value, label]) => ({ label, value }))} />
            <FilterSelect label="Trạng thái xử lý" value={statusFilter} onChange={setStatusFilter} options={Object.entries(statusLabel).map(([value, label]) => ({ label, value }))} />
            <FilterSelect label="Khoảng thời gian" value={dateRangeFilter} onChange={setDateRangeFilter} options={[{ label: 'Tháng 08/2026', value: '2026-08' }, { label: 'Tháng 07/2026', value: '2026-07' }, { label: 'Tháng 06/2026', value: '2026-06' }, { label: 'Tháng 05/2026', value: '2026-05' }]} />
            <Button className="self-end" type="button" variant="secondary" onClick={resetFilters}>Reset</Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <DataTable columns={columns} data={pagedTickets} />
        <PaginationControls
          currentPage={safePage}
          pageSize={pageSize}
          totalItems={filteredTickets.length}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedTicket && (
        <TicketDrawer
          employeeById={employeeById}
          equipmentRows={equipmentRows}
          historyRows={historyRows.filter((item) => item.maintenanceId === selectedTicket.id)}
          maintenanceRows={maintenanceRows}
          onAssign={handleAssign}
          onClose={() => setSelectedTicket(null)}
          onMoveNext={handleMoveNextStatus}
          roomById={roomById}
          technicalEmployees={technicalEmployees}
          ticket={joinedTickets.find((item) => item.id === selectedTicket.id) || selectedTicket}
        />
      )}
      {isCreateOpen && (
        <CreateTicketModal
          employeeOptions={maintenanceEmployees.filter((employee) => employee.role === 'Giáo vụ' || employee.role === 'Quản lý thiết bị')}
          equipmentItems={equipmentItems}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateTicket}
        />
      )}
      {completionTicket && (
        <CompletionModal
          onClose={() => setCompletionTicket(null)}
          onSubmit={handleComplete}
          ticket={completionTicket}
        />
      )}
    </div>
  )
}

const FilterSelect = ({ label, onChange, options, value }) => (
  <label className="block">
    <span className="text-xs font-black uppercase text-slate-500">{label}</span>
    <select className="mt-2 h-10 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Tất cả</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
)

const InfoBox = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <div className="mt-1 font-semibold text-slate-800">{value}</div>
  </div>
)

const TicketDrawer = ({ employeeById, equipmentRows, historyRows, maintenanceRows, onAssign, onClose, onMoveNext, roomById, technicalEmployees, ticket }) => {
  const equipment = ticket.equipment
  const room = roomById.get(ticket.roomId)
  const equipmentMaintenanceHistory = maintenanceRows.filter((item) => item.equipmentId === ticket.equipmentId)
  const inventoryDevice = equipmentRows.find((item) => item.id === equipment?.equipmentCode)
  const canMoveNext = Boolean(nextStatus[ticket.status])

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/20">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng chi tiết phiếu" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-orange-100 bg-white px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Phiếu bảo trì #{ticket.id}</p>
            <h2 className="mt-1 text-xl font-black uppercase text-slate-950">Phiếu bảo trì #{ticket.id}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone={severityTone[ticket.severity]}>Mức độ: {severityLabel[ticket.severity]}</Badge>
              <Badge tone={statusTone[ticket.status]}>Trạng thái: {statusLabel[ticket.status]}</Badge>
            </div>
          </div>
          <Button className="shrink-0" type="button" variant="ghost" onClick={onClose} aria-label="Đóng"><X size={18} /></Button>
        </div>

        <div className="space-y-5 p-5">
          <section>
            <h3 className="text-sm font-black uppercase text-orange-600">Thông tin thiết bị</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InfoBox label="Tên thiết bị" value={equipment?.equipmentName || '—'} />
              <InfoBox label="Mã thiết bị" value={equipment?.equipmentCode || '—'} />
              <InfoBox label="Serial" value={inventoryDevice?.serial || '—'} />
              <InfoBox label="Loại" value={equipment?.category || '—'} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase text-orange-600">Vị trí</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InfoBox label="Phòng" value={`Phòng ${room?.roomName || '—'}`} />
              <InfoBox label="Sức chứa" value={`${room?.capacity ?? 0} người`} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase text-orange-600">Sự cố</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InfoBox label="Nội dung" value={ticket.issue} />
              <InfoBox label="Mức độ" value={severityLabel[ticket.severity]} />
              <InfoBox label="Ngày báo" value={formatDate(ticket.reportedAt)} />
              <InfoBox label="Người báo" value={ticket.reporter?.name || '—'} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase text-orange-600">Xử lý</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
                <span className="text-xs font-black uppercase text-slate-400">Người xử lý</span>
                <select className="mt-2 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={ticket.assignedTo || ''} onChange={(event) => onAssign(ticket.id, event.target.value)}>
                  <option value="">Chọn nhân viên kỹ thuật</option>
                  {technicalEmployees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
                </select>
              </label>
              <InfoBox label="Ngày tiếp nhận" value={formatDate(ticket.acceptedAt)} />
              <InfoBox label="Ngày bắt đầu sửa" value={formatDate(ticket.startedAt)} />
              <InfoBox label="Dự kiến hoàn thành" value={formatDate(ticket.expectedDoneAt)} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase text-orange-600">Chi phí</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InfoBox label="Dự kiến" value={formatCurrency(ticket.estimatedCost)} />
              <InfoBox label="Thực tế" value={formatCurrency(ticket.actualCost)} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase text-orange-600">Timeline xử lý</h3>
            <div className="mt-3 space-y-3">
              {historyRows.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-orange-600" />
                  <div>
                    <p className="text-sm font-black text-slate-900">{formatTimelineDate(item.dateTime)}</p>
                    <p className="text-sm font-semibold text-slate-600">{employeeById.get(item.employeeId)?.name || 'Hệ thống'} {item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase text-orange-600">Lịch sử bảo trì của thiết bị</h3>
            <div className="mt-3 space-y-2">
              {equipmentMaintenanceHistory.map((item) => (
                <div key={item.id} className="grid gap-2 rounded-lg border border-orange-100 bg-orange-50/50 p-3 text-sm md:grid-cols-[5rem_6rem_1fr_7rem_7rem]">
                  <span className="font-black text-slate-950">{item.id}</span>
                  <span>{formatDate(item.reportedAt)}</span>
                  <span>{item.issue}</span>
                  <span>{formatCurrency(item.actualCost ?? item.estimatedCost)}</span>
                  <span className="font-bold">{statusLabel[item.status]}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Đóng</Button>
            <Button type="button" disabled={!canMoveNext} onClick={() => onMoveNext(ticket)}>
              Cập nhật trạng thái
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}

const CreateTicketModal = ({ employeeOptions, equipmentItems, onClose, onSubmit }) => {
  const [equipmentId, setEquipmentId] = useState(equipmentItems[0]?.equipmentId || '')
  const [issue, setIssue] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [reportedAt, setReportedAt] = useState('2026-08-18')
  const [reportedBy, setReportedBy] = useState(employeeOptions[0]?.id || '')
  const [note, setNote] = useState('')
  const equipment = equipmentItems.find((item) => item.equipmentId === equipmentId)

  return (
    <ModalShell title="Báo hỏng thiết bị" onClose={onClose} maxWidth="max-w-2xl">
      <form className="space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <SelectField label="Thiết bị *" value={equipmentId} onChange={setEquipmentId} options={equipmentItems.map((item) => ({ label: `${item.equipmentName} - ${item.equipmentCode}`, value: item.equipmentId }))} />
        {equipment && (
          <div className="grid gap-3 rounded-lg border border-orange-100 bg-orange-50/60 p-4 md:grid-cols-2">
            <InfoBox label="Thiết bị" value={equipment.equipmentName} />
            <InfoBox label="Mã" value={equipment.equipmentCode} />
            <InfoBox label="Phòng hiện tại" value={equipment.roomName} />
            <InfoBox label="Tình trạng hiện tại" value={equipment.condition} />
          </div>
        )}
        <label className="block">
          <span className="text-sm font-black text-slate-700">Nội dung sự cố *</span>
          <textarea className="mt-2 h-24 w-full rounded-lg border border-orange-100 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="Mô tả vấn đề..." value={issue} onChange={(event) => setIssue(event.target.value)} />
        </label>
        <SelectField label="Mức độ *" value={severity} onChange={setSeverity} options={Object.entries(severityLabel).map(([value, label]) => ({ label, value }))} />
        <InputField label="Ngày báo *" type="date" value={reportedAt} onChange={setReportedAt} />
        <SelectField label="Người báo *" value={reportedBy} onChange={setReportedBy} options={employeeOptions.map((item) => ({ label: item.name, value: item.id }))} />
        <div>
          <span className="text-sm font-black text-slate-700">Hình ảnh / file</span>
          <Button className="mt-2" type="button" variant="secondary">+ Đính kèm</Button>
        </div>
        <label className="block">
          <span className="text-sm font-black text-slate-700">Ghi chú</span>
          <textarea className="mt-2 h-20 w-full rounded-lg border border-orange-100 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ghi chú" />
        </label>
        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="button" disabled={!issue.trim()} onClick={() => onSubmit({ equipmentId, issue, note, reportedAt, reportedBy, severity })}>Tạo phiếu</Button>
        </div>
      </form>
    </ModalShell>
  )
}

const CompletionModal = ({ onClose, onSubmit, ticket }) => {
  const [result, setResult] = useState('success')
  const [resolution, setResolution] = useState('Thay cổng HDMI và kiểm tra tín hiệu.')
  const [actualCost, setActualCost] = useState('450000')
  const [completedAt, setCompletedAt] = useState('2026-08-20')

  return (
    <ModalShell title="Hoàn tất bảo trì" onClose={onClose} maxWidth="max-w-xl">
      <form className="space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <SelectField label="Kết quả xử lý *" value={result} onChange={setResult} options={[
          { label: 'Đã sửa thành công', value: 'success' },
          { label: 'Không thể sửa', value: 'failed' },
          { label: 'Thanh lý', value: 'liquidated' },
        ]} />
        <label className="block">
          <span className="text-sm font-black text-slate-700">Mô tả xử lý</span>
          <textarea className="mt-2 h-24 w-full rounded-lg border border-orange-100 px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={resolution} onChange={(event) => setResolution(event.target.value)} />
        </label>
        <InputField label="Chi phí thực tế" value={actualCost} onChange={setActualCost} />
        <InputField label="Ngày hoàn thành" type="date" value={completedAt} onChange={setCompletedAt} />
        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="button" onClick={() => onSubmit({ actualCost, completedAt, result, resolution, ticket })}>Xác nhận hoàn tất</Button>
        </div>
      </form>
    </ModalShell>
  )
}

const ModalShell = ({ children, maxWidth, onClose, title }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup" />
    <section className={`relative z-10 max-h-[92vh] w-full overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20 ${maxWidth}`}>
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Thiết bị lớp học</p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">{title}</h2>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></Button>
      </div>
      <div className="max-h-[calc(92vh-5rem)] overflow-y-auto">{children}</div>
    </section>
  </div>
)

const SelectField = ({ label, onChange, options, value }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <select className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
)

const InputField = ({ label, onChange, value = '', ...props }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <input className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={value} onChange={(event) => onChange?.(event.target.value)} {...props} />
  </label>
)

const PaginationControls = ({ currentPage, onPageChange, pageSize, totalItems, totalPages }) => {
  const firstItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0
  const lastItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border border-orange-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center">
      <span className="font-semibold">
        Hiển thị {firstItem}-{lastItem} / {totalItems} phiếu
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange((page) => Math.max(1, page - 1))}
        >
          Trang trước
        </Button>
        <span className="min-w-20 text-center font-black text-slate-900">
          {currentPage}/{totalPages}
        </span>
        <Button
          variant="secondary"
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange((page) => Math.min(totalPages, page + 1))}
        >
          Trang sau
        </Button>
      </div>
    </div>
  )
}
