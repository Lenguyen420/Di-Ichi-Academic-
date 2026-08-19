export const academicKpis = [
  { id: 'classes', label: 'Lớp học', value: '24', change: '+2 tháng này', tone: 'green' },
  { id: 'teachers', label: 'Giáo viên', value: '32', change: '28 đang dạy', tone: 'orange' },
  { id: 'rooms', label: 'Phòng học', value: '18', change: '16 đang dùng', tone: 'amber' },
  { id: 'devices', label: 'Thiết bị', value: '156', change: '142 hoạt động', tone: 'green' },
]

export const academicAlerts = [
  { id: 'AL-1001', label: 'Giáo viên chưa được phân lớp', count: 3 },
  { id: 'AL-1002', label: 'Lớp chưa có giáo viên', count: 2 },
  { id: 'AL-1003', label: 'Thiết bị đang hỏng', count: 7 },
  { id: 'AL-1004', label: 'Thiết bị cần bảo trì', count: 4 },
]

export const todayClassSchedule = [
  { id: 'TODAY-1001', time: '08:00', className: 'IELTS 01', room: 'Phòng A101', teacher: 'Nguyễn Minh Anh' },
  { id: 'TODAY-1002', time: '10:00', className: 'TOEIC 02', room: 'Phòng A102', teacher: 'Trần Văn Nam' },
  { id: 'TODAY-1003', time: '14:00', className: 'Kids 03', room: 'Phòng B201', teacher: 'Lê Hoàng' },
  { id: 'TODAY-1004', time: '18:00', className: 'IELTS 04', room: 'Phòng A103', teacher: 'Nguyễn Minh Anh' },
]

export const classList = [
  {
    id: 'CLASS-1001',
    name: 'IELTS Foundation 08A',
    shortName: 'IELTS 08A',
    course: 'IELTS Foundation',
    specialty: 'IELTS',
    campus: 'Cơ sở Phú Nhuận',
    teacher: 'Nguyễn Thùy Linh',
    schedule: 'T2-T4, 18:30',
    days: 'Thứ 2 - Thứ 4',
    time: '18:30 - 20:00',
    room: 'P.201',
    roomDetail: '201',
    students: '16/20',
    status: 'Đang học',
    startDate: '20/08/2026',
    endDate: '20/11/2026',
  },
  {
    id: 'CLASS-1002',
    name: 'IELTS Foundation 08B',
    shortName: 'IELTS 08B',
    course: 'IELTS Foundation',
    specialty: 'IELTS',
    campus: 'Cơ sở Phú Nhuận',
    teacher: 'Đỗ Minh Quân',
    schedule: 'T3-T5, 18:30',
    days: 'Thứ 3 - Thứ 5',
    time: '18:30 - 20:00',
    room: 'P.202',
    roomDetail: '202',
    students: '15/20',
    status: 'Đang học',
    startDate: '21/08/2026',
    endDate: '21/11/2026',
  },
  {
    id: 'CLASS-1003',
    name: 'IELTS Foundation 09A',
    shortName: 'IELTS 09A',
    course: 'IELTS Foundation',
    specialty: 'IELTS',
    campus: 'Cơ sở Quận 3',
    teacher: '',
    schedule: 'T2-T4, 20:00',
    days: 'Thứ 2 - Thứ 4',
    time: '20:00 - 21:30',
    room: 'P.204',
    roomDetail: '204',
    students: '10/20',
    status: 'Chưa phân giáo viên',
    startDate: '28/08/2026',
    endDate: '28/11/2026',
  },
  {
    id: 'CLASS-1004',
    name: 'IELTS Foundation 09B',
    shortName: 'IELTS 09B',
    course: 'IELTS Foundation',
    specialty: 'IELTS',
    campus: 'Cơ sở Bình Thạnh',
    teacher: '',
    schedule: 'T7-CN, 14:00',
    days: 'Thứ 7 - Chủ nhật',
    time: '14:00 - 15:30',
    room: 'P.305',
    roomDetail: '305',
    students: '8/18',
    status: 'Chưa phân giáo viên',
    startDate: '29/08/2026',
    endDate: '29/11/2026',
  },
  {
    id: 'CLASS-1005',
    name: 'Future Stars 07B',
    shortName: 'TOEIC 07B',
    course: 'Future Stars',
    specialty: 'TOEIC',
    campus: 'Cơ sở Phú Nhuận',
    teacher: 'Trần Hoàng Nam',
    schedule: 'T3-T5, 19:00',
    days: 'Thứ 3 - Thứ 5',
    time: '19:00 - 20:30',
    room: 'P.203',
    roomDetail: '203',
    students: '14/18',
    status: 'Đang học',
    startDate: '18/08/2026',
    endDate: '18/11/2026',
  },
  {
    id: 'CLASS-1006',
    name: 'Bright Stars 06C',
    shortName: 'Bright Stars 06C',
    course: 'Bright Stars',
    specialty: 'Kids',
    campus: 'Cơ sở Quận 3',
    teacher: 'Phạm Minh Hạnh',
    schedule: 'T7-CN, 09:00',
    days: 'Thứ 7 - Chủ nhật',
    time: '09:00 - 10:30',
    room: 'P.101',
    roomDetail: '101',
    students: '18/20',
    status: 'Đang học',
    startDate: '22/08/2026',
    endDate: '22/11/2026',
  },
  {
    id: 'CLASS-1007',
    name: 'Di-Ichi Leader 09B',
    shortName: 'Di-Ichi 09B',
    course: 'Di-Ichi Leader',
    specialty: 'IELTS',
    campus: 'Cơ sở Bình Thạnh',
    teacher: 'Lê Anh Khoa',
    schedule: 'T3-T5, 17:30',
    days: 'Thứ 3 - Thứ 5',
    time: '17:30 - 19:00',
    room: 'P.302',
    roomDetail: '302',
    students: '12/16',
    status: 'Sắp khai giảng',
    startDate: '25/08/2026',
    endDate: '25/11/2026',
  },
]

export const teacherAssignments = [
  { id: 'TA-1001', teacher: 'Nguyễn Thùy Linh', specialty: 'IELTS', classNames: ['IELTS 08A', 'IELTS 08B'], classCount: 2, teachingDays: 'T2-T4, T3-T5', status: 'Đang dạy', campus: 'Cơ sở Phú Nhuận', course: 'IELTS Foundation' },
  { id: 'TA-1002', teacher: 'Trần Hoàng Nam', specialty: 'TOEIC', classNames: ['TOEIC 07B'], classCount: 3, teachingDays: 'T3-T5', status: 'Đang dạy', campus: 'Cơ sở Phú Nhuận', course: 'Future Stars' },
  { id: 'TA-1003', teacher: 'Phạm Minh Hạnh', specialty: 'Kids', classNames: ['Bright Stars 06C'], classCount: 1, teachingDays: 'T7-CN', status: 'Đang dạy', campus: 'Cơ sở Quận 3', course: 'Bright Stars' },
  { id: 'TA-1004', teacher: 'Lê Anh Khoa', specialty: 'IELTS', classNames: [], classCount: 0, teachingDays: '', status: 'Chưa phân lớp', campus: 'Cơ sở Bình Thạnh', course: 'Di-Ichi Leader' },
]

export const classSchedules = [
  { id: 'SCH-1001', className: 'IELTS Foundation 08A', weekday: 'Thứ 2, Thứ 4', time: '18:30 - 20:00', room: 'Phòng 201', teacher: 'Nguyễn Thùy Linh' },
  { id: 'SCH-1002', className: 'IELTS Foundation 08B', weekday: 'Thứ 3, Thứ 5', time: '18:30 - 20:00', room: 'Phòng 202', teacher: 'Đỗ Minh Quân' },
  { id: 'SCH-1003', className: 'IELTS Foundation 09A', weekday: 'Thứ 2, Thứ 4', time: '20:00 - 21:30', room: 'Phòng 204', teacher: '' },
  { id: 'SCH-1004', className: 'IELTS Foundation 09B', weekday: 'Thứ 7, Chủ nhật', time: '14:00 - 15:30', room: 'Phòng 305', teacher: '' },
  { id: 'SCH-1005', className: 'Future Stars 07B', weekday: 'Thứ 3, Thứ 5', time: '19:00 - 20:30', room: 'Phòng 203', teacher: 'Trần Hoàng Nam' },
  { id: 'SCH-1006', className: 'Bright Stars 06C', weekday: 'Thứ 7, Chủ nhật', time: '09:00 - 10:30', room: 'Phòng 101', teacher: 'Phạm Minh Hạnh' },
  { id: 'SCH-1007', className: 'Di-Ichi Leader 09B', weekday: 'Thứ 3, Thứ 5', time: '17:30 - 19:00', room: 'Phòng 302', teacher: 'Lê Anh Khoa' },
]

export const classroomDeviceKpis = [
  { id: 'total', label: 'Tổng thiết bị', value: '156', change: '18 phòng đang quản lý', tone: 'orange' },
  { id: 'active', label: 'Đang sử dụng', value: '142', change: '91% sẵn sàng', tone: 'green' },
  { id: 'broken', label: 'Đang hỏng', value: '7', change: '3 phiếu mới tuần này', tone: 'rose' },
  { id: 'maintenance', label: 'Bảo trì', value: '4', change: '2 đang sửa', tone: 'amber' },
]

export const classroomDevices = [
  { id: 'TB001', name: 'Máy chiếu Epson EB-X06', type: 'Máy chiếu', campus: 'Cơ sở Quận 1', room: 'A101', quantity: 1, status: 'Tốt', serial: 'EP123456', checkedAt: '15/08/2026', condition: 'Hoạt động ổn định' },
  { id: 'TB002', name: 'Laptop giáo viên Dell 5420', type: 'Máy tính', campus: 'Cơ sở Quận 1', room: 'A101', quantity: 1, status: 'Tốt', serial: 'DL5420-A101', checkedAt: '15/08/2026', condition: 'Pin tốt, đã cập nhật phần mềm' },
  { id: 'TB003', name: 'Loa Bluetooth JBL', type: 'Âm thanh', campus: 'Cơ sở Quận 1', room: 'A102', quantity: 2, status: 'Hỏng', serial: 'JBL-A102', checkedAt: '12/08/2026', condition: 'Một loa rè, cần kiểm tra cổng sạc' },
  { id: 'TB004', name: 'Micro không dây Shure', type: 'Âm thanh', campus: 'Cơ sở Bình Thạnh', room: 'B201', quantity: 2, status: 'Tốt', serial: 'SH-B201', checkedAt: '14/08/2026', condition: 'Tín hiệu ổn định' },
  { id: 'TB005', name: 'Bảng tương tác ViewSonic', type: 'Bảng tương tác', campus: 'Cơ sở Quận 3', room: 'C301', quantity: 1, status: 'Bảo trì', serial: 'VS-C301', checkedAt: '18/08/2026', condition: 'Cảm ứng lệch góc phải' },
  { id: 'TB006', name: 'Webcam Logitech C920', type: 'Thiết bị online', campus: 'Cơ sở Quận 1', room: 'Kho thiết bị', quantity: 3, status: 'Dự phòng', serial: 'LG-KHO-03', checkedAt: '10/08/2026', condition: 'Sẵn sàng cấp phát' },
]

export const deviceAllocations = [
  {
    room: 'A101',
    campus: 'Cơ sở Quận 1',
    checkedAt: '15/08/2026',
    devices: [
      { id: 'TB001', name: 'Máy chiếu Epson EB-X06', type: 'Máy chiếu', quantity: 1, status: 'Tốt' },
      { id: 'TB002', name: 'Laptop giáo viên Dell 5420', type: 'Máy tính', quantity: 1, status: 'Tốt' },
    ],
  },
  {
    room: 'A102',
    campus: 'Cơ sở Quận 1',
    checkedAt: '12/08/2026',
    devices: [
      { id: 'TB003', name: 'Loa Bluetooth JBL', type: 'Âm thanh', quantity: 2, status: 'Cần kiểm tra' },
      { id: 'TB007', name: 'Remote máy chiếu', type: 'Phụ kiện', quantity: 1, status: 'Tốt' },
    ],
  },
  {
    room: 'B201',
    campus: 'Cơ sở Bình Thạnh',
    checkedAt: '14/08/2026',
    devices: [
      { id: 'TB004', name: 'Micro không dây Shure', type: 'Âm thanh', quantity: 2, status: 'Tốt' },
      { id: 'TB008', name: 'Bộ chia HDMI', type: 'Phụ kiện', quantity: 1, status: 'Tốt' },
    ],
  },
]

export const maintenanceTickets = [
  { id: 'MT-1001', deviceId: 'TB001', device: 'Máy chiếu Epson EB-X06', room: 'A101', condition: 'Hỏng', reporter: 'Nguyễn Minh Anh', issue: 'Máy chiếu không nhận tín hiệu HDMI.', priority: 'Trung bình', status: 'Đang sửa', reportedAt: '18/08/2026', cost: '500.000 VNĐ', note: 'Đã gửi kỹ thuật kiểm tra cổng HDMI.' },
  { id: 'MT-1002', deviceId: 'TB003', device: 'Loa Bluetooth JBL', room: 'A102', condition: 'Hỏng', reporter: 'Giáo vụ Mai Anh', issue: 'Loa rè khi mở âm lượng trên 60%.', priority: 'Cao', status: 'Chờ xử lý', reportedAt: '17/08/2026', cost: 'Chưa xác định', note: 'Ưu tiên đổi thiết bị dự phòng cho lớp tối.' },
  { id: 'MT-1003', deviceId: 'TB005', device: 'Bảng tương tác ViewSonic', room: 'C301', condition: 'Cần kiểm tra', reporter: 'Lê Hoàng Vy', issue: 'Cảm ứng lệch tại góc phải màn hình.', priority: 'Thấp', status: 'Đã sửa', reportedAt: '14/08/2026', cost: '0 VNĐ', note: 'Đã cân chỉnh lại cảm ứng.' },
]

export const teacherAllocationReport = [
  { id: 'TR-1001', teacher: 'Nguyễn Thùy Linh', assignedClasses: 5, weeklyHours: 18, utilization: '86%', recommendation: 'Giữ tải hiện tại' },
  { id: 'TR-1002', teacher: 'Trần Hoàng Nam', assignedClasses: 4, weeklyHours: 16, utilization: '72%', recommendation: 'Có thể nhận lớp tối T2/T4' },
  { id: 'TR-1003', teacher: 'Phạm Minh Hạnh', assignedClasses: 6, weeklyHours: 22, utilization: '104%', recommendation: 'Cần giảm 1 lớp cuối tuần' },
  { id: 'TR-1004', teacher: 'Lê Anh Khoa', assignedClasses: 3, weeklyHours: 12, utilization: '68%', recommendation: 'Ưu tiên lớp Di Ichi Leader mới' },
]

export const equipmentStatusReport = [
  { id: 'ER-1001', type: 'Máy chiếu', total: 8, ready: 7, maintenance: 1, readiness: '88%' },
  { id: 'ER-1002', type: 'Âm thanh', total: 10, ready: 9, maintenance: 1, readiness: '90%' },
  { id: 'ER-1003', type: 'Máy tính', total: 6, ready: 5, maintenance: 1, readiness: '83%' },
  { id: 'ER-1004', type: 'Bảng tương tác', total: 4, ready: 4, maintenance: 0, readiness: '100%' },
]
