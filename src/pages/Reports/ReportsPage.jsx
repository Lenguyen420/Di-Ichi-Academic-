import { useMemo, useState } from 'react'
import { ChartColumn, Download, UserRoundCheck } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Badge } from '../../components/Common/Badge.jsx'
import { Button } from '../../components/Common/Button.jsx'
import { Card } from '../../components/Common/Card.jsx'
import { DataTable } from '../../components/Common/DataTable.jsx'
import { PageTabs } from '../../components/Common/PageTabs.jsx'
import { equipmentAllocationRooms } from '../../datas/equipmentAllocationData.js'
import { maintenanceData, maintenanceEmployees } from '../../datas/maintenanceData.js'
import { reportFilterOptions, teacherReportData } from '../../datas/reportData.js'

const tabs = [
  { id: 'teachers', label: 'Phân bổ giáo viên', icon: UserRoundCheck },
  { id: 'equipment', label: 'Tình trạng thiết bị', icon: ChartColumn },
]

const formatPercent = (value) => `${Math.round(value)}%`
const formatDateFile = (startDate, endDate) => `${startDate || 'all'}_${endDate || 'all'}`
const dateRangeText = (startDate, endDate) => {
  const format = (value) => value ? value.split('-').reverse().join('/') : ''
  if (!startDate && !endDate) return 'Tất cả thời gian'
  if (startDate && endDate) return `${format(startDate)} - ${format(endDate)}`
  if (startDate) return `Từ ${format(startDate)}`
  return `Đến ${format(endDate)}`
}

const campusMatches = (value, filter) => filter === 'Tất cả cơ sở' || String(value || '').includes(filter)
const courseMatches = (value, filter) => filter === 'Tất cả khóa học' || String(value || '').includes(filter)
const dateInRange = (value, startDate, endDate) => {
  if (!value) return true
  if (startDate && value < startDate) return false
  if (endDate && value > endDate) return false
  return true
}
const monthInRange = (month, startDate, endDate) => dateInRange(`${month}-01`, startDate, endDate)
const viDateInRange = (value, startDate, endDate) => {
  const [day, month, year] = String(value || '').split('/')
  if (!day || !month || !year) return true
  return dateInRange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`, startDate, endDate)
}
const flattenEquipment = () => equipmentAllocationRooms.flatMap((room) => room.equipment.map((item) => ({
  ...item,
  campus: room.campus,
  capacity: room.capacity,
  roomId: room.roomId,
  roomName: room.roomName,
})))

const appendSheet = (workbook, sheetName, rows) => {
  const sheet = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName)
}

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [campusFilter, setCampusFilter] = useState('Tất cả cơ sở')
  const [courseFilter, setCourseFilter] = useState('Tất cả khóa học')
  const [startDate, setStartDate] = useState('2026-08-01')
  const [endDate, setEndDate] = useState('2026-08-31')

  const teacherById = useMemo(() => new Map(teacherReportData.teachers.map((item) => [item.teacherId, item])), [])
  const classById = useMemo(() => new Map(teacherReportData.classes.map((item) => [item.classId, item])), [])
  const equipmentItems = useMemo(() => flattenEquipment(), [])
  const equipmentById = useMemo(() => new Map(equipmentItems.map((item) => [item.equipmentId, item])), [equipmentItems])
  const roomById = useMemo(() => new Map(equipmentAllocationRooms.map((room) => [room.roomId, room])), [])
  const employeeById = useMemo(() => new Map(maintenanceEmployees.map((employee) => [employee.id, employee])), [])

  const teacherReport = useMemo(() => {
    const teachers = teacherReportData.teachers.filter((item) =>
      campusMatches(item.campus, campusFilter)
      && courseMatches(item.specialty, courseFilter)
      && monthInRange(item.month, startDate, endDate),
    )
    const teacherIds = new Set(teachers.map((item) => item.teacherId))
    const classes = teacherReportData.classes.filter((item) =>
      teacherIds.has(item.teacherId)
      && campusMatches(item.campus, campusFilter)
      && courseMatches(item.courseGroup, courseFilter)
      && monthInRange(item.month, startDate, endDate),
    )
    const classIds = new Set(classes.map((item) => item.classId))
    const assignments = teacherReportData.assignments.filter((item) => teacherIds.has(item.teacherId) && classIds.has(item.classId) && dateInRange(item.startDate, startDate, endDate))
    const overview = {
      totalTeachers: teachers.length,
      activeTeachers: teachers.filter((item) => item.classCount > 0).length,
      unassignedTeachers: teachers.filter((item) => item.classCount === 0).length,
      totalClasses: classes.length,
      totalWeeklyHours: teachers.reduce((total, item) => total + item.weeklyHours, 0),
      overloadedTeachers: teachers.filter((item) => item.status === 'Quá tải').length,
      underloadedTeachers: teachers.filter((item) => item.status === 'Thiếu tải').length,
    }
    const chartDataset = teachers.map((item) => ({ teacherId: item.teacherId, teacherName: item.teacherName, utilization: item.utilization }))
    return { assignments, chartDataset, classes, overview, teachers }
  }, [campusFilter, courseFilter, endDate, startDate])

  const equipmentReport = useMemo(() => {
    const equipment = equipmentItems.filter((item) => campusMatches(item.campus, campusFilter) && viDateInRange(item.allocatedDate, startDate, endDate))
    const equipmentIds = new Set(equipment.map((item) => item.equipmentId))
    const tickets = maintenanceData.filter((ticket) => equipmentIds.has(ticket.equipmentId) && dateInRange(ticket.reportedAt, startDate, endDate))
    const rooms = equipmentAllocationRooms.filter((room) => campusMatches(room.campus, campusFilter))
    const overview = {
      total: equipment.reduce((total, item) => total + item.quantity, 0),
      active: equipment.filter((item) => item.allocationStatus === 'Đang sử dụng').reduce((total, item) => total + item.quantity, 0),
      checking: equipment.filter((item) => item.condition === 'Cần kiểm tra').reduce((total, item) => total + item.quantity, 0),
      maintenance: equipment.filter((item) => item.condition === 'Đang bảo trì').reduce((total, item) => total + item.quantity, 0),
      broken: equipment.filter((item) => item.condition === 'Hỏng').reduce((total, item) => total + item.quantity, 0),
    }
    return { equipment, overview, rooms, tickets }
  }, [campusFilter, endDate, equipmentItems, startDate])

  const exportTeacherReport = () => {
    const workbook = XLSX.utils.book_new()
    appendSheet(workbook, 'Tong quan', [
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': '', '': '' },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Thời gian', '': dateRangeText(startDate, endDate) },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Cơ sở', '': campusFilter },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Khóa học', '': courseFilter },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Chỉ số', '': 'Giá trị' },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Tổng giáo viên', '': teacherReport.overview.totalTeachers },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Đang giảng dạy', '': teacherReport.overview.activeTeachers },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Chưa phân lớp', '': teacherReport.overview.unassignedTeachers },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Tổng lớp', '': teacherReport.overview.totalClasses },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Tổng giờ/tuần', '': teacherReport.overview.totalWeeklyHours },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Giáo viên quá tải', '': teacherReport.overview.overloadedTeachers },
      { 'BÁO CÁO PHÂN BỔ GIÁO VIÊN': 'Giáo viên thiếu tải', '': teacherReport.overview.underloadedTeachers },
    ])
    appendSheet(workbook, 'Chi tiet giao vien', teacherReport.teachers.map((item, index) => ({
      STT: index + 1,
      'Mã GV': item.teacherId,
      'Giáo viên': item.teacherName,
      'Chuyên môn': item.specialty,
      'Số lớp': item.classCount,
      'Giờ/tuần': item.weeklyHours,
      'Định mức': item.maxWeeklyHours,
      'Mức sử dụng': item.utilization,
      'Trạng thái': item.status,
      'Khuyến nghị': item.recommendation,
    })))
    appendSheet(workbook, 'Chi tiet lop hoc', teacherReport.classes.map((item, index) => ({
      STT: index + 1,
      'Mã lớp': item.classId,
      'Tên lớp': item.className,
      'Khóa học': item.course,
      'Mã giáo viên': item.teacherId,
      'Giáo viên': teacherById.get(item.teacherId)?.teacherName || '',
      'Phòng': item.room,
      'Lịch học': item.schedule,
      'Giờ bắt đầu': item.startTime,
      'Giờ kết thúc': item.endTime,
      'Số học viên': item.studentCount,
      'Trạng thái': item.status,
    })))
    appendSheet(workbook, 'Lich phan cong', teacherReport.assignments.map((item) => ({
      'Mã phân công': item.assignmentId,
      'Mã giáo viên': item.teacherId,
      'Giáo viên': teacherById.get(item.teacherId)?.teacherName || '',
      'Mã lớp': item.classId,
      'Tên lớp': classById.get(item.classId)?.className || '',
      'Vai trò': item.role,
      'Ngày bắt đầu': item.startDate,
      'Ngày kết thúc': item.endDate,
      'Thứ': item.weekday,
      'Giờ bắt đầu': item.startTime,
      'Giờ kết thúc': item.endTime,
      'Phòng': item.room,
      'Trạng thái': item.status,
    })))
    appendSheet(workbook, 'Du lieu bieu do', teacherReport.chartDataset)
    XLSX.writeFile(workbook, `BaoCao_PhanBo_GiaoVien_${formatDateFile(startDate, endDate)}.xlsx`)
  }

  const exportEquipmentReport = () => {
    const workbook = XLSX.utils.book_new()
    appendSheet(workbook, 'Tong quan', [
      { 'BÁO CÁO TÌNH TRẠNG THIẾT BỊ': 'Tổng thiết bị', 'Giá trị': equipmentReport.overview.total },
      { 'BÁO CÁO TÌNH TRẠNG THIẾT BỊ': 'Đang sử dụng', 'Giá trị': equipmentReport.overview.active },
      { 'BÁO CÁO TÌNH TRẠNG THIẾT BỊ': 'Cần kiểm tra', 'Giá trị': equipmentReport.overview.checking },
      { 'BÁO CÁO TÌNH TRẠNG THIẾT BỊ': 'Đang bảo trì', 'Giá trị': equipmentReport.overview.maintenance },
      { 'BÁO CÁO TÌNH TRẠNG THIẾT BỊ': 'Đang hỏng', 'Giá trị': equipmentReport.overview.broken },
    ])
    appendSheet(workbook, 'Chi tiet thiet bi', equipmentReport.equipment.map((item, index) => ({
      STT: index + 1,
      'Mã thiết bị': item.equipmentCode,
      'Tên thiết bị': item.equipmentName,
      'Loại': item.category,
      'Phòng': item.roomName,
      'Số lượng': item.quantity,
      'Tình trạng': item.condition,
      'Trạng thái phân bổ': item.allocationStatus,
      'Ngày phân bổ': item.allocatedDate,
    })))
    appendSheet(workbook, 'Bao tri hong hoc', equipmentReport.tickets.map((ticket) => {
      const equipment = equipmentById.get(ticket.equipmentId)
      const room = roomById.get(ticket.roomId)
      return {
        'Mã phiếu': ticket.id,
        'Mã thiết bị': equipment?.equipmentCode || ticket.equipmentId,
        'Tên thiết bị': equipment?.equipmentName || '',
        'Mã phòng': ticket.roomId,
        'Phòng': room?.roomName || '',
        'Nội dung sự cố': ticket.issue,
        'Mức độ': ticket.severity,
        'Ngày báo': ticket.reportedAt,
        'Người báo': employeeById.get(ticket.reportedBy)?.name || '',
        'Người xử lý': employeeById.get(ticket.assignedTo)?.name || '',
        'Trạng thái': ticket.status,
        'Ngày bắt đầu': ticket.startedAt || '',
        'Ngày hoàn thành': ticket.completedAt || '',
        'Chi phí dự kiến': ticket.estimatedCost,
        'Chi phí thực tế': ticket.actualCost,
        'Ghi chú': ticket.note,
      }
    }))
    appendSheet(workbook, 'Thiet bi theo phong', equipmentReport.rooms.map((room) => {
      const equipment = room.equipment
      return {
        'Mã phòng': room.roomId,
        'Phòng': room.roomName,
        'Sức chứa': room.capacity,
        'Tổng thiết bị': equipment.reduce((total, item) => total + item.quantity, 0),
        'Thiết bị tốt': equipment.filter((item) => item.condition === 'Tốt').reduce((total, item) => total + item.quantity, 0),
        'Cần kiểm tra': equipment.filter((item) => item.condition === 'Cần kiểm tra').reduce((total, item) => total + item.quantity, 0),
        'Đang bảo trì': equipment.filter((item) => item.condition === 'Đang bảo trì').reduce((total, item) => total + item.quantity, 0),
        'Đang hỏng': equipment.filter((item) => item.condition === 'Hỏng').reduce((total, item) => total + item.quantity, 0),
        'Trạng thái phòng': room.allocationStatus,
      }
    }))
    appendSheet(workbook, 'Chi phi bao tri', equipmentReport.tickets.map((ticket) => {
      const equipment = equipmentById.get(ticket.equipmentId)
      const room = roomById.get(ticket.roomId)
      const actual = ticket.actualCost ?? 0
      return {
        'Mã phiếu': ticket.id,
        'Mã thiết bị': equipment?.equipmentCode || ticket.equipmentId,
        'Tên thiết bị': equipment?.equipmentName || '',
        'Phòng': room?.roomName || '',
        'Ngày báo': ticket.reportedAt,
        'Ngày hoàn thành': ticket.completedAt || '',
        'Chi phí dự kiến': ticket.estimatedCost,
        'Chi phí thực tế': ticket.actualCost,
        'Chênh lệch': actual - ticket.estimatedCost,
        'Trạng thái': ticket.status,
      }
    }))
    XLSX.writeFile(workbook, `BaoCao_TinhTrang_ThietBi_${formatDateFile(startDate, endDate)}.xlsx`)
  }

  const handleExport = () => {
    if (activeTab === 'teachers') exportTeacherReport()
    else exportEquipmentReport()
  }

  const teacherColumns = [
    { header: 'Mã GV', accessorKey: 'teacherId' },
    { header: 'Giáo viên', accessorKey: 'teacherName' },
    { header: 'Chuyên môn', accessorKey: 'specialty' },
    { header: 'Số lớp', accessorKey: 'classCount' },
    { header: 'Giờ/tuần', accessorKey: 'weeklyHours' },
    { header: 'Mức sử dụng', cell: ({ row }) => <Badge tone={row.original.utilization >= 100 ? 'rose' : row.original.utilization >= 85 ? 'amber' : 'green'}>{formatPercent(row.original.utilization)}</Badge> },
    { header: 'Trạng thái', accessorKey: 'status' },
    { header: 'Khuyến nghị', accessorKey: 'recommendation' },
  ]
  const equipmentColumns = [
    { header: 'Mã thiết bị', accessorKey: 'equipmentCode' },
    { header: 'Tên thiết bị', accessorKey: 'equipmentName' },
    { header: 'Loại', accessorKey: 'category' },
    { header: 'Phòng', accessorKey: 'roomName' },
    { header: 'Số lượng', accessorKey: 'quantity' },
    { header: 'Tình trạng', accessorKey: 'condition' },
    { header: 'Trạng thái phân bổ', accessorKey: 'allocationStatus' },
    { header: 'Ngày phân bổ', accessorKey: 'allocatedDate' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">Báo cáo</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Báo cáo vận hành học vụ</h1>
          <p className="mt-2 text-sm text-slate-500">Dữ liệu báo cáo dùng chung cho giao diện, biểu đồ và Excel.</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <Button type="button" onClick={handleExport}>
            <Download size={17} />
            {activeTab === 'teachers' ? 'Xuất báo cáo phân bổ giáo viên' : 'Xuất báo cáo tình trạng thiết bị'}
          </Button>
        </div>
      </div>

      <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className={`grid gap-4 ${activeTab === 'teachers' ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          <ReportSelect label="Cơ sở" value={campusFilter} onChange={setCampusFilter} options={reportFilterOptions.campuses} />
          {activeTab === 'teachers' && <ReportSelect label="Khóa học" value={courseFilter} onChange={setCourseFilter} options={reportFilterOptions.courses} />}
          <DateInput label="Từ ngày" value={startDate} onChange={setStartDate} />
          <DateInput label="Đến ngày" value={endDate} onChange={setEndDate} />
        </div>
      </Card>

      {activeTab === 'teachers' && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <SummaryCard label="Tổng giáo viên" value={teacherReport.overview.totalTeachers} />
            <SummaryCard label="Tổng lớp" value={teacherReport.overview.totalClasses} />
            <SummaryCard label="Tổng giờ/tuần" value={teacherReport.overview.totalWeeklyHours} />
            <SummaryCard label="Quá tải" value={teacherReport.overview.overloadedTeachers} />
          </div>
          <DataTable columns={teacherColumns} data={teacherReport.teachers} />
        </>
      )}

      {activeTab === 'equipment' && (
        <>
          <div className="grid gap-4 md:grid-cols-5">
            <SummaryCard label="Tổng thiết bị" value={equipmentReport.overview.total} />
            <SummaryCard label="Đang sử dụng" value={equipmentReport.overview.active} />
            <SummaryCard label="Cần kiểm tra" value={equipmentReport.overview.checking} />
            <SummaryCard label="Đang bảo trì" value={equipmentReport.overview.maintenance} />
            <SummaryCard label="Đang hỏng" value={equipmentReport.overview.broken} />
          </div>
          <DataTable columns={equipmentColumns} data={equipmentReport.equipment} />
        </>
      )}
    </div>
  )
}

const ReportSelect = ({ disabled = false, label, onChange, options, value }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <select
      className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-50 disabled:text-slate-400"
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
)

const DateInput = ({ label, onChange, value }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <input
      className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
)

const SummaryCard = ({ label, value }) => (
  <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
    <p className="text-sm font-bold text-slate-600">{label}</p>
    <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
  </Card>
)
