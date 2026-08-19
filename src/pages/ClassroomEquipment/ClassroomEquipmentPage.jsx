import { useMemo, useState } from 'react'
import { ClipboardList, Download, Plus, Projector, Search, Upload, Wrench } from 'lucide-react'
import { EquipmentAllocationTable } from '../../components/ClassroomEquipment/EquipmentAllocationTable.jsx'
import { EquipmentDetailModal } from '../../components/ClassroomEquipment/EquipmentDetailModal.jsx'
import { EquipmentDeviceModal } from '../../components/ClassroomEquipment/EquipmentDeviceModal.jsx'
import { EquipmentInventoryTable } from '../../components/ClassroomEquipment/EquipmentInventoryTable.jsx'
import { MaintenanceTable } from '../../components/ClassroomEquipment/MaintenanceTable.jsx'
import { Button } from '../../components/Common/Button.jsx'
import { Card } from '../../components/Common/Card.jsx'
import { PageTabs } from '../../components/Common/PageTabs.jsx'
import { classroomDeviceKpis, classroomDevices } from '../../datas/academicOperationsData.js'
import { equipmentAllocationRooms } from '../../datas/equipmentAllocationData.js'
import { maintenanceData } from '../../datas/maintenanceData.js'

const tabs = [
  { id: 'devices', label: 'Danh sách thiết bị', icon: Projector },
  { id: 'allocation', label: 'Phân bổ thiết bị', icon: ClipboardList },
  { id: 'maintenance', label: 'Bảo trì / Hỏng hóc', icon: Wrench },
]

const kpiTone = {
  orange: {
    card: 'bg-gradient-to-br from-orange-50 via-white to-amber-50',
    pill: 'bg-orange-100 text-orange-700 ring-orange-200',
  },
  green: {
    card: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    pill: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  },
  rose: {
    card: 'bg-gradient-to-br from-rose-50 via-white to-orange-50',
    pill: 'bg-rose-100 text-rose-700 ring-rose-200',
  },
  amber: {
    card: 'bg-gradient-to-br from-amber-50 via-white to-yellow-50',
    pill: 'bg-amber-100 text-amber-700 ring-amber-200',
  },
}

const matchesKeyword = (values, normalizedKeyword) => {
  if (!normalizedKeyword) return true
  return values.some((value) => String(value || '').toLowerCase().includes(normalizedKeyword))
}

const escapeCell = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

const downloadExcelFile = ({ fileName, rows, sheetName }) => {
  const headers = rows[0] ? Object.keys(rows[0]) : []
  const bodyRows = rows.map((row) => `<tr>${headers.map((header) => `<td>${escapeCell(row[header])}</td>`).join('')}</tr>`).join('')
  const headerRow = `<tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join('')}</tr>`
  const workbook = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"></head>
      <body><table><caption>${escapeCell(sheetName)}</caption>${headerRow}${bodyRows}</table></body>
    </html>
  `
  const blob = new Blob([workbook], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const ClassroomEquipmentPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  const [equipmentRows, setEquipmentRows] = useState(classroomDevices)
  const [allocationRooms, setAllocationRooms] = useState(equipmentAllocationRooms)
  const [maintenanceRows, setMaintenanceRows] = useState(maintenanceData)
  const [viewingDevice, setViewingDevice] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [roomFilter, setRoomFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const roomOptions = useMemo(() => [...new Set(equipmentRows.map((item) => item.room).filter(Boolean))], [equipmentRows])
  const typeOptions = useMemo(() => [...new Set(equipmentRows.map((item) => item.type).filter(Boolean))], [equipmentRows])
  const statusOptions = useMemo(() => [...new Set([
    ...equipmentRows.map((item) => item.status),
  ].filter(Boolean))], [equipmentRows])
  const normalizedKeyword = keyword.trim().toLowerCase()
  const filteredDevices = useMemo(() => equipmentRows.filter((device) => {
    const matchesRoom = !roomFilter || device.room === roomFilter
    const matchesType = !typeFilter || device.type === typeFilter
    const matchesStatus = !statusFilter || device.status === statusFilter
    const matchesSearch = matchesKeyword([device.id, device.name, device.type, device.room, device.serial], normalizedKeyword)
    return matchesRoom && matchesType && matchesStatus && matchesSearch
  }), [equipmentRows, normalizedKeyword, roomFilter, statusFilter, typeFilter])
  const syncEquipmentStatus = (equipmentCode, nextStatus) => {
    setEquipmentRows((current) => current.map((device) => device.id === equipmentCode ? { ...device, status: nextStatus } : device))
  }

  const syncAllocationStatus = (equipmentId, { allocationStatus, condition }) => {
    setAllocationRooms((current) => current.map((room) => ({
      ...room,
      equipment: room.equipment.map((item) => item.equipmentId === equipmentId ? { ...item, allocationStatus, condition } : item),
    })))
  }
  const handleExportExcel = () => {
    const rows = filteredDevices.map((device, index) => ({
      'STT': index + 1,
      'Mã thiết bị': device.id,
      'Tên thiết bị': device.name,
      'Loại': device.type,
      'Phòng': device.room,
      'Số lượng': device.quantity,
      'Tình trạng': device.status,
      'Lý do': device.status === 'Hỏng' ? device.condition || 'Chưa cập nhật' : '',
      'Ngày kiểm tra': device.checkedAt,
      'Số serial': device.serial,
      'Ghi chú kỹ thuật': device.condition,
    }))
    downloadExcelFile({ fileName: 'danh-sach-thiet-bi.xls', rows, sheetName: 'Danh sách thiết bị' })
  }

  return (
    <div className="space-y-5">
      {activeTab === 'devices' && (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-bold text-orange-600">Thiết bị lớp học</p>
          <h1 className="mt-1 text-2xl font-black uppercase text-slate-950 md:text-3xl">Thiết bị lớp học</h1>
          <p className="mt-2 text-sm text-slate-500">Quản lý thiết bị, tài sản và tình trạng sử dụng tại các phòng học.</p>
        </div>
        <PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
      )}

      {activeTab === 'devices' && (
        <>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" onClick={() => setIsDeviceModalOpen(true)}>
              <Plus size={17} />
              Thêm thiết bị
            </Button>
            <Button type="button" variant="secondary">
              <Upload size={17} />
              Nhập Excel
            </Button>
            <Button type="button" variant="secondary" onClick={handleExportExcel}>
              <Download size={17} />
              Xuất Excel
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {classroomDeviceKpis.map((item) => (
              <Card key={item.id} className={`rounded-lg p-4 shadow-sm ${kpiTone[item.tone].card}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-600">{item.label}</p>
                    <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-black ring-1 ${kpiTone[item.tone].pill}`}>
                    {item.change}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'devices' && <div className="space-y-3 rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-11 w-full rounded-lg border border-orange-100 bg-orange-50/40 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            placeholder="Tìm tên thiết bị, mã thiết bị..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="h-10 rounded-lg border border-orange-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" value={roomFilter} onChange={(event) => setRoomFilter(event.target.value)}>
            <option value="">Phòng học</option>
            {roomOptions.map((room) => <option key={room} value={room}>{room}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-orange-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">Loại thiết bị</option>
            {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-orange-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">Tình trạng</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>}

      {activeTab === 'devices' && (
        <EquipmentInventoryTable
          devices={filteredDevices}
          onEdit={(device) => {
            setViewingDevice(null)
            setEditingDevice(device)
          }}
          onView={setViewingDevice}
        />
      )}
      {activeTab === 'allocation' && (
        <EquipmentAllocationTable
          headerRight={<PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />}
          rooms={allocationRooms}
          setRooms={setAllocationRooms}
        />
      )}
      {activeTab === 'maintenance' && (
        <MaintenanceTable
          allocationRooms={allocationRooms}
          equipmentRows={equipmentRows}
          headerRight={<PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />}
          maintenanceRows={maintenanceRows}
          setMaintenanceRows={setMaintenanceRows}
          syncAllocationStatus={syncAllocationStatus}
          syncEquipmentStatus={syncEquipmentStatus}
        />
      )}
      {isDeviceModalOpen && <EquipmentDeviceModal onClose={() => setIsDeviceModalOpen(false)} />}
      {editingDevice && <EquipmentDeviceModal device={editingDevice} mode="edit" onClose={() => setEditingDevice(null)} />}
      {viewingDevice && (
        <EquipmentDetailModal
          device={viewingDevice}
          onClose={() => setViewingDevice(null)}
          onEdit={(device) => {
            setViewingDevice(null)
            setEditingDevice(device)
          }}
        />
      )}
    </div>
  )
}
