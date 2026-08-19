import { useMemo, useRef, useState } from 'react'
import { Building2, ChevronDown, MoreVertical, Plus, RefreshCcw, X } from 'lucide-react'
import { allocationEquipmentOptions, equipmentAllocationRooms } from '../../datas/equipmentAllocationData.js'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'

const conditionTone = {
  Tốt: 'green',
  'Cần kiểm tra': 'amber',
  'Đang bảo trì': 'amber',
  Hỏng: 'rose',
}

const allocationTone = {
  'Đang sử dụng': 'green',
  'Tạm giữ': 'amber',
  'Đang điều chuyển': 'slate',
  'Chưa phân bổ': 'slate',
}

const conditionDot = {
  Tốt: 'bg-emerald-500',
  'Cần kiểm tra': 'bg-amber-500',
  'Đang bảo trì': 'bg-orange-500',
  Hỏng: 'bg-rose-500',
}

const allocationDot = {
  'Đang sử dụng': 'bg-emerald-500',
  'Tạm giữ': 'bg-amber-500',
  'Đang điều chuyển': 'bg-sky-500',
  'Chưa phân bổ': 'bg-slate-300',
}

const matchesKeyword = (values, keyword) => {
  if (!keyword) return true
  return values.some((value) => String(value || '').toLowerCase().includes(keyword))
}

const getRoomEquipmentCount = (room) => room.equipment.reduce((total, item) => total + item.quantity, 0)

export const EquipmentAllocationTable = ({ headerRight = null, rooms: controlledRooms, setRooms: setControlledRooms } = {}) => {
  const [localRooms, setLocalRooms] = useState(equipmentAllocationRooms)
  const rooms = controlledRooms || localRooms
  const setRooms = setControlledRooms || setLocalRooms
  const [keyword, setKeyword] = useState('')
  const [campusFilter, setCampusFilter] = useState('')
  const [roomFilter, setRoomFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')
  const [allocationStatusFilter, setAllocationStatusFilter] = useState('')
  const [openRoomIds, setOpenRoomIds] = useState(() => new Set(['ROOM-A101']))
  const [allocationModalOpen, setAllocationModalOpen] = useState(false)
  const [detailRoom, setDetailRoom] = useState(null)
  const [brokenDevice, setBrokenDevice] = useState(null)
  const [recallDevice, setRecallDevice] = useState(null)
  const [statusDevice, setStatusDevice] = useState(null)
  const [transferDevice, setTransferDevice] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState(null)

  const normalizedKeyword = keyword.trim().toLowerCase()
  const campuses = useMemo(() => [...new Set(rooms.map((room) => room.campus))], [rooms])
  const roomNames = useMemo(() => rooms.map((room) => room.roomName), [rooms])
  const categories = useMemo(() => [...new Set(rooms.flatMap((room) => room.equipment.map((item) => item.category)))], [rooms])
  const conditions = ['Tốt', 'Cần kiểm tra', 'Đang bảo trì', 'Hỏng']
  const allocationStatuses = ['Đang sử dụng', 'Tạm giữ', 'Đang điều chuyển', 'Chưa phân bổ']

  const filteredRooms = useMemo(() => rooms
    .map((room) => {
      const roomMatches = (!campusFilter || room.campus === campusFilter)
        && (!roomFilter || room.roomName === roomFilter)
        && (!allocationStatusFilter || room.allocationStatus === allocationStatusFilter)
        && matchesKeyword([room.roomName, room.campus], normalizedKeyword)

      const equipment = room.equipment.filter((item) => {
        const matchesCategory = !categoryFilter || item.category === categoryFilter
        const matchesCondition = !conditionFilter || item.condition === conditionFilter
        const matchesAllocation = !allocationStatusFilter || item.allocationStatus === allocationStatusFilter || room.allocationStatus === allocationStatusFilter
        const matchesSearch = matchesKeyword([room.roomName, item.equipmentName, item.equipmentCode, item.category], normalizedKeyword)
        return matchesCategory && matchesCondition && matchesAllocation && matchesSearch
      })

      if (roomMatches && !categoryFilter && !conditionFilter) return room
      if (equipment.length) return { ...room, equipment }
      return null
    })
    .filter(Boolean), [allocationStatusFilter, campusFilter, categoryFilter, conditionFilter, normalizedKeyword, roomFilter, rooms])

  const stats = useMemo(() => {
    const assignedEquipment = rooms.flatMap((room) => room.equipment)
    return [
      { label: 'Tổng phòng học', value: `${rooms.length} phòng học`, tone: 'from-orange-50 via-white to-amber-50' },
      { label: 'Tổng thiết bị đang phân bổ', value: `${assignedEquipment.reduce((total, item) => total + item.quantity, 0)} thiết bị`, tone: 'from-sky-50 via-white to-cyan-50' },
      { label: 'Thiết bị còn khả dụng', value: '14 thiết bị khả dụng', tone: 'from-emerald-50 via-white to-teal-50' },
      { label: 'Thiết bị cần xử lý', value: `${assignedEquipment.filter((item) => ['Cần kiểm tra', 'Đang bảo trì', 'Hỏng'].includes(item.condition)).length} thiết bị cần xử lý`, tone: 'from-rose-50 via-white to-orange-50' },
    ]
  }, [rooms])

  const resetFilters = () => {
    setKeyword('')
    setCampusFilter('')
    setRoomFilter('')
    setCategoryFilter('')
    setConditionFilter('')
    setAllocationStatusFilter('')
  }

  const toggleRoom = (roomId) => {
    setOpenRoomIds((current) => {
      const next = new Set(current)
      if (next.has(roomId)) next.delete(roomId)
      else next.add(roomId)
      return next
    })
  }

  const handleTransfer = ({ device, reason, targetRoomName, transferDate }) => {
    if (!targetRoomName) return
    setRooms((current) => {
      const movingDevice = { ...device }
      const nextRooms = current.map((room) => ({
        ...room,
        equipment: room.equipment.filter((item) => item.equipmentId !== device.equipmentId),
      }))
      return nextRooms.map((room) => {
        if (room.roomName !== targetRoomName) return room
        return {
          ...room,
          equipment: [
            ...room.equipment,
            {
              ...movingDevice,
              roomId: room.roomId,
              roomName: room.roomName,
              capacity: room.capacity,
              allocationStatus: 'Đang điều chuyển',
              allocationHistory: [
                { date: transferDate, fromRoom: device.roomName, toRoom: targetRoomName, reason, assignedBy: 'Nguyễn Văn A' },
                ...device.allocationHistory,
              ],
            },
          ],
        }
      })
    })
    setTransferDevice(null)
  }

  const updateDevice = (equipmentId, updater) => {
    setRooms((current) => current.map((room) => ({
      ...room,
      equipment: room.equipment.map((item) => item.equipmentId === equipmentId ? updater(item, room) : item),
    })))
  }

  const handleUpdateStatus = ({ allocationStatus, condition, device, note }) => {
    updateDevice(device.equipmentId, (item) => ({
      ...item,
      allocationStatus,
      condition,
      note: note || item.note,
    }))
    setStatusDevice(null)
  }

  const handleReportBroken = ({ device, reason }) => {
    updateDevice(device.equipmentId, (item) => ({
      ...item,
      allocationStatus: 'Tạm giữ',
      condition: 'Hỏng',
      note: reason,
    }))
    setBrokenDevice(null)
  }

  const handleRecallDevice = ({ device, reason, recallDate }) => {
    setRooms((current) => {
      const nextRooms = current.map((room) => ({
        ...room,
        equipment: room.equipment.filter((item) => item.equipmentId !== device.equipmentId),
      }))
      const warehouseRoom = nextRooms.find((room) => room.roomName.includes('Kho')) || nextRooms[0]
      return nextRooms.map((room) => {
        if (room.roomId !== warehouseRoom.roomId) return room
        return {
          ...room,
          equipment: [
            ...room.equipment,
            {
              ...device,
              roomId: room.roomId,
              roomName: room.roomName,
              capacity: room.capacity,
              allocationStatus: 'Chưa phân bổ',
              allocationHistory: [
                { date: recallDate, fromRoom: device.roomName, toRoom: room.roomName, reason, assignedBy: 'Nguyễn Văn A' },
                ...device.allocationHistory,
              ],
            },
          ],
        }
      })
    })
    setRecallDevice(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">Thiết bị lớp học</p>
          <h2 className="mt-1 text-2xl font-black uppercase text-slate-950 md:text-3xl">Phân bổ thiết bị</h2>
          <p className="mt-2 text-sm text-slate-500">Quản lý thiết bị được phân bổ cho từng phòng học.</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          {headerRight}
          <Button type="button" onClick={() => setAllocationModalOpen(true)}>
            <Plus size={17} />
            Phân bổ thiết bị
          </Button>
        </div>
      </div>

      <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="space-y-4">
          <input
            className="h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            placeholder="Tìm phòng, tên thiết bị, mã thiết bị..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            <FilterSelect label="Cơ sở" value={campusFilter} onChange={setCampusFilter} options={campuses} />
            <FilterSelect label="Phòng học" value={roomFilter} onChange={setRoomFilter} options={roomNames} />
            <FilterSelect label="Loại thiết bị" value={categoryFilter} onChange={setCategoryFilter} options={categories} />
            <FilterSelect label="Tình trạng" value={conditionFilter} onChange={setConditionFilter} options={conditions} />
            <FilterSelect label="Trạng thái phân bổ" value={allocationStatusFilter} onChange={setAllocationStatusFilter} options={allocationStatuses} />
            <Button className="self-end" type="button" variant="secondary" onClick={resetFilters}>
              <RefreshCcw size={16} />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className={`rounded-lg bg-gradient-to-br ${item.tone}`}>
            <p className="text-sm font-bold text-slate-600">{item.label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRooms.map((room) => {
          const isOpen = openRoomIds.has(room.roomId)
          return (
            <Card key={room.roomId} className="overflow-hidden rounded-lg p-0">
              <button className="flex w-full items-center justify-between gap-4 p-5 text-left" type="button" onClick={() => toggleRoom(room.roomId)}>
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                    <Building2 size={22} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black uppercase text-slate-950">Phòng {room.roomName}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Sức chứa: {room.capacity} người</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <span className={`h-2.5 w-2.5 rounded-full ${allocationDot[room.allocationStatus]}`} />
                      {room.allocationStatus}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone="orange">{getRoomEquipmentCount(room)} thiết bị</Badge>
                  <ChevronDown className={`text-orange-600 transition ${isOpen ? 'rotate-180' : ''}`} size={22} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-orange-100 p-5">
                  <div className="overflow-x-auto rounded-lg border border-orange-100 bg-white">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-orange-50 text-xs uppercase text-orange-700">
                        <tr>
                          <th className="px-4 py-3 font-black">Thiết bị</th>
                          <th className="px-4 py-3 font-black">Mã</th>
                          <th className="px-4 py-3 font-black">SL</th>
                          <th className="px-4 py-3 font-black">Tình trạng</th>
                          <th className="px-4 py-3 font-black">Trạng thái phân bổ</th>
                          <th className="px-4 py-3 font-black">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-50">
                        {room.equipment.map((item, index) => (
                          <tr key={item.equipmentId} className="hover:bg-orange-50/50">
                            <td className="px-4 py-3 font-bold text-slate-800">{item.equipmentName}</td>
                            <td className="px-4 py-3 text-slate-600">{item.equipmentCode}</td>
                            <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                            <td className="px-4 py-3">
                              <StatusLabel dot={conditionDot[item.condition]} tone={conditionTone[item.condition]}>{item.condition}</StatusLabel>
                            </td>
                            <td className="px-4 py-3">
                              <StatusLabel dot={allocationDot[item.allocationStatus]} tone={allocationTone[item.allocationStatus]}>{item.allocationStatus}</StatusLabel>
                            </td>
                            <td className="px-4 py-3">
                              <DeviceActionMenu
                                device={item}
                                openUp={index >= room.equipment.length - 2}
                                onBroken={setBrokenDevice}
                                onDetail={setSelectedDevice}
                                onRecall={setRecallDevice}
                                onStatus={setStatusDevice}
                                onTransfer={setTransferDevice}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={() => setDetailRoom(room)}>Xem chi tiết</Button>
                    <Button type="button" onClick={() => setDetailRoom(room)}>Quản lý thiết bị</Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {allocationModalOpen && <AllocationModal rooms={rooms} onClose={() => setAllocationModalOpen(false)} />}
      {brokenDevice && <BrokenReportModal device={brokenDevice} onClose={() => setBrokenDevice(null)} onSubmit={handleReportBroken} />}
      {detailRoom && <RoomDetailModal room={detailRoom} onAdd={() => { setDetailRoom(null); setAllocationModalOpen(true) }} onClose={() => setDetailRoom(null)} />}
      {recallDevice && <RecallModal device={recallDevice} onClose={() => setRecallDevice(null)} onSubmit={handleRecallDevice} />}
      {statusDevice && <StatusUpdateModal device={statusDevice} onClose={() => setStatusDevice(null)} onSubmit={handleUpdateStatus} />}
      {transferDevice && (
        <TransferModal
          device={transferDevice}
          rooms={rooms}
          onClose={() => setTransferDevice(null)}
          onSubmit={handleTransfer}
        />
      )}
      {selectedDevice && <AllocationDeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}
    </div>
  )
}

const FilterSelect = ({ label, onChange, options, value }) => (
  <label className="block">
    <span className="text-xs font-black uppercase text-slate-500">{label}</span>
    <select className="mt-2 h-10 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Tất cả</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
)

const StatusLabel = ({ children, dot, tone }) => (
  <span className="inline-flex items-center gap-2">
    <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
    <Badge tone={tone}>{children}</Badge>
  </span>
)

const DeviceActionMenu = ({ device, onBroken, onDetail, onRecall, onStatus, onTransfer, openUp }) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)
  const buttonRect = buttonRef.current?.getBoundingClientRect()
  const shouldOpenUp = openUp || (buttonRect && window.innerHeight - buttonRect.bottom < 240)
  const actions = [
    { label: 'Xem chi tiết', onClick: () => onDetail(device) },
    { label: 'Cập nhật tình trạng', onClick: () => onStatus(device) },
    { label: 'Chuyển phòng', onClick: () => onTransfer(device) },
    { label: 'Thu hồi thiết bị', onClick: () => onRecall(device) },
    { label: 'Báo hỏng', onClick: () => onBroken(device) },
  ]

  return (
    <div className="relative">
      <button ref={buttonRef} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => setIsOpen((current) => !current)} aria-label="Mở menu thao tác">
        <MoreVertical size={18} />
      </button>
      {isOpen && (
        <div
          className="fixed z-[90] w-44 overflow-hidden rounded-lg border border-orange-100 bg-white py-1 shadow-xl shadow-slate-950/10"
          style={{
            left: buttonRect ? Math.max(12, buttonRect.right - 176) : undefined,
            top: buttonRect ? Math.max(12, shouldOpenUp ? buttonRect.top - 204 : buttonRect.bottom + 8) : undefined,
          }}
        >
          {actions.map((action) => (
            <button key={action.label} className="block w-full px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700" type="button" onClick={() => { setIsOpen(false); action.onClick() }}>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const AllocationModal = ({ onClose, rooms }) => {
  const [roomName, setRoomName] = useState(rooms[0]?.roomName || '')
  const [equipmentId, setEquipmentId] = useState(allocationEquipmentOptions[0]?.equipmentId || '')
  const [quantity, setQuantity] = useState('1')
  const [allocatedDate, setAllocatedDate] = useState('2026-08-19')
  const selectedEquipment = allocationEquipmentOptions.find((item) => item.equipmentId === equipmentId)
  const available = selectedEquipment ? selectedEquipment.total - selectedEquipment.allocated : 0
  const isOverLimit = Number(quantity) > available

  return (
    <ModalShell title="Phân bổ thiết bị" onClose={onClose} maxWidth="max-w-2xl">
      <form className="space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <SelectField label="Phòng học *" value={roomName} onChange={setRoomName} options={rooms.map((room) => ({ label: `Phòng ${room.roomName}`, value: room.roomName }))} />
        <SelectField label="Loại thiết bị" value={selectedEquipment?.category || ''} onChange={() => {}} options={[{ label: 'Tất cả thiết bị', value: selectedEquipment?.category || '' }]} />
        <SelectField label="Thiết bị *" value={equipmentId} onChange={setEquipmentId} options={allocationEquipmentOptions.map((item) => ({ label: item.equipmentName, value: item.equipmentId }))} />
        <InputField label="Mã thiết bị" value={selectedEquipment?.equipmentCode || ''} readOnly />
        <InputField label="Số lượng *" value={quantity} type="number" min="1" onChange={setQuantity} />
        <InputField label="Ngày phân bổ *" type="date" value={allocatedDate} onChange={setAllocatedDate} />
        <InputField label="Người phụ trách" placeholder="Nguyễn Văn A" />
        <label className="block">
          <span className="text-sm font-black text-slate-700">Ghi chú</span>
          <textarea className="mt-2 h-20 w-full rounded-lg border border-orange-100 px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="Ghi chú" />
        </label>
        {selectedEquipment && (
          <div className="grid gap-3 rounded-lg border border-orange-100 bg-orange-50/60 p-4 text-sm md:grid-cols-3">
            <InfoText label="Tổng số" value={selectedEquipment.total} />
            <InfoText label="Đang phân bổ" value={selectedEquipment.allocated} />
            <InfoText label="Còn khả dụng" value={available} />
          </div>
        )}
        {isOverLimit && <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">Số lượng phân bổ không được lớn hơn số lượng còn khả dụng.</p>}
        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="submit" disabled={isOverLimit} onClick={onClose}>Phân bổ</Button>
        </div>
      </form>
    </ModalShell>
  )
}

const RoomDetailModal = ({ onAdd, onClose, room }) => (
  <ModalShell title={`Phòng ${room.roomName}`} onClose={onClose} maxWidth="max-w-3xl">
    <div className="space-y-4 p-5">
      <div className="grid gap-3 md:grid-cols-3">
        <InfoBox label="Sức chứa" value={`${room.capacity} người`} />
        <InfoBox label="Thiết bị" value={getRoomEquipmentCount(room)} />
        <InfoBox label="Trạng thái" value={<StatusLabel dot={allocationDot[room.allocationStatus]} tone={allocationTone[room.allocationStatus]}>{room.allocationStatus}</StatusLabel>} />
      </div>
      <div>
        <h3 className="text-sm font-black uppercase text-orange-600">Thiết bị trong phòng</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {room.equipment.map((item) => (
            <div key={item.equipmentId} className="rounded-lg border border-orange-100 bg-orange-50/40 p-4">
              <p className="font-black text-slate-950">{item.equipmentName}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">Mã: {item.equipmentCode}</p>
              <p className="text-sm font-semibold text-slate-500">SL: {item.quantity}</p>
              <div className="mt-3"><StatusLabel dot={conditionDot[item.condition]} tone={conditionTone[item.condition]}>{item.condition}</StatusLabel></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end border-t border-orange-100 pt-4">
        <Button type="button" onClick={onAdd}><Plus size={17} /> Thêm thiết bị vào phòng</Button>
      </div>
    </div>
  </ModalShell>
)

const StatusUpdateModal = ({ device, onClose, onSubmit }) => {
  const [condition, setCondition] = useState(device.condition)
  const [allocationStatus, setAllocationStatus] = useState(device.allocationStatus)
  const [note, setNote] = useState(device.note || '')

  return (
    <ModalShell title="Cập nhật tình trạng" onClose={onClose} maxWidth="max-w-xl">
      <form className="space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <DeviceSummary device={device} />
        <SelectField label="Tình trạng thiết bị" value={condition} onChange={setCondition} options={['Tốt', 'Cần kiểm tra', 'Đang bảo trì', 'Hỏng'].map((item) => ({ label: item, value: item }))} />
        <SelectField label="Trạng thái phân bổ" value={allocationStatus} onChange={setAllocationStatus} options={['Đang sử dụng', 'Tạm giữ', 'Đang điều chuyển', 'Chưa phân bổ'].map((item) => ({ label: item, value: item }))} />
        <label className="block">
          <span className="text-sm font-black text-slate-700">Ghi chú</span>
          <textarea className="mt-2 h-24 w-full rounded-lg border border-orange-100 px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Nhập ghi chú cập nhật" />
        </label>
        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="button" onClick={() => onSubmit({ allocationStatus, condition, device, note })}>Lưu cập nhật</Button>
        </div>
      </form>
    </ModalShell>
  )
}

const BrokenReportModal = ({ device, onClose, onSubmit }) => {
  const [reason, setReason] = useState(device.condition === 'Hỏng' ? device.note || '' : '')

  return (
    <ModalShell title="Báo hỏng thiết bị" onClose={onClose} maxWidth="max-w-xl">
      <form className="space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <DeviceSummary device={device} />
        <label className="block">
          <span className="text-sm font-black text-slate-700">Lý do hỏng *</span>
          <textarea className="mt-2 h-28 w-full rounded-lg border border-orange-100 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Ví dụ: Loa rè, không kết nối Bluetooth" />
        </label>
        {!reason.trim() && <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">Vui lòng nhập lý do hỏng trước khi lưu.</p>}
        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="button" disabled={!reason.trim()} onClick={() => onSubmit({ device, reason })}>Lưu báo hỏng</Button>
        </div>
      </form>
    </ModalShell>
  )
}

const RecallModal = ({ device, onClose, onSubmit }) => {
  const [reason, setReason] = useState('Thu hồi về kho để kiểm kê')
  const [recallDate, setRecallDate] = useState('2026-08-19')

  return (
    <ModalShell title="Thu hồi thiết bị" onClose={onClose} maxWidth="max-w-xl">
      <form className="space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <DeviceSummary device={device} />
        <InputField label="Lý do thu hồi" value={reason} onChange={setReason} />
        <InputField label="Ngày thu hồi" type="date" value={recallDate} onChange={setRecallDate} />
        <p className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-sm font-semibold text-slate-700">Thiết bị sẽ được chuyển về phòng kho và đổi trạng thái phân bổ thành Chưa phân bổ.</p>
        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="button" onClick={() => onSubmit({ device, reason, recallDate })}>Xác nhận thu hồi</Button>
        </div>
      </form>
    </ModalShell>
  )
}

const TransferModal = ({ device, onClose, onSubmit, rooms }) => {
  const targetRooms = rooms.filter((room) => room.roomName !== device.roomName)
  const [targetRoomName, setTargetRoomName] = useState(targetRooms[0]?.roomName || '')
  const [reason, setReason] = useState('Phòng A203 cần bổ sung máy chiếu')
  const [transferDate, setTransferDate] = useState('2026-08-19')

  return (
    <ModalShell title="Chuyển thiết bị" onClose={onClose} maxWidth="max-w-xl">
      <form className="space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4 text-sm">
          <p className="font-black text-slate-950">Thiết bị: {device.equipmentName}</p>
          <p className="mt-1 font-semibold text-slate-600">Mã: {device.equipmentCode}</p>
          <p className="font-semibold text-slate-600">Phòng hiện tại: {device.roomName}</p>
        </div>
        <SelectField label="Chuyển đến" value={targetRoomName} onChange={setTargetRoomName} options={targetRooms.map((room) => ({ label: `Phòng ${room.roomName}`, value: room.roomName }))} />
        <InputField label="Lý do" value={reason} onChange={setReason} />
        <InputField label="Ngày chuyển" type="date" value={transferDate} onChange={setTransferDate} />
        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="button" onClick={() => onSubmit({ device, reason, targetRoomName, transferDate })}>Xác nhận chuyển</Button>
        </div>
      </form>
    </ModalShell>
  )
}

const AllocationDeviceDetailModal = ({ device, onClose }) => (
  <ModalShell title={device.equipmentName} onClose={onClose} maxWidth="max-w-2xl">
    <div className="space-y-4 p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <InfoBox label="Mã thiết bị" value={device.equipmentCode} />
        <InfoBox label="Phòng hiện tại" value={device.roomName} />
        <InfoBox label="Số lượng" value={device.quantity} />
        <InfoBox label="Tình trạng" value={<StatusLabel dot={conditionDot[device.condition]} tone={conditionTone[device.condition]}>{device.condition}</StatusLabel>} />
      </div>
      <div>
        <h3 className="text-sm font-black uppercase text-orange-600">Lịch sử phân bổ</h3>
        <div className="mt-3 space-y-3">
          {device.allocationHistory.map((item) => (
            <div key={`${item.date}-${item.fromRoom}-${item.toRoom}`} className="rounded-lg border border-orange-100 bg-orange-50/50 p-4">
              <p className="font-black text-slate-950">{item.date}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{item.fromRoom} → {item.toRoom}</p>
              <p className="mt-1 text-sm text-slate-600">Lý do: {item.reason}</p>
              <p className="text-sm text-slate-600">Người thực hiện: {item.assignedBy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </ModalShell>
)

const ModalShell = ({ children, maxWidth, onClose, title }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup" />
    <section className={`relative z-10 max-h-[92vh] w-full overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20 ${maxWidth}`}>
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Thiết bị lớp học</p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">{title}</h2>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </Button>
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
    <input className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-50" value={value} onChange={(event) => onChange?.(event.target.value)} {...props} />
  </label>
)

const DeviceSummary = ({ device }) => (
  <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4 text-sm">
    <p className="font-black text-slate-950">Thiết bị: {device.equipmentName}</p>
    <p className="mt-1 font-semibold text-slate-600">Mã: {device.equipmentCode}</p>
    <p className="font-semibold text-slate-600">Phòng hiện tại: {device.roomName}</p>
  </div>
)

const InfoText = ({ label, value }) => (
  <div>
    <p className="text-xs font-black uppercase text-slate-500">{label}</p>
    <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
  </div>
)

const InfoBox = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <div className="mt-1 font-semibold text-slate-800">{value}</div>
  </div>
)
