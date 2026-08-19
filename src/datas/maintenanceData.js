export const maintenanceEmployees = [
  { id: 'EMP001', name: 'Nguyễn Minh Anh', role: 'Giáo vụ' },
  { id: 'EMP002', name: 'Mai Anh', role: 'Giáo vụ' },
  { id: 'EMP003', name: 'Lê Hoàng Vy', role: 'Giáo vụ' },
  { id: 'EMP004', name: 'Nguyễn Văn A', role: 'Quản lý thiết bị' },
  { id: 'EMP005', name: 'Trần Văn Kỹ Thuật', role: 'Kỹ thuật viên' },
  { id: 'EMP006', name: 'Phạm Quốc Bảo', role: 'Kỹ thuật viên' },
  { id: 'EMP007', name: 'Đỗ Minh Khang', role: 'Kỹ thuật viên' },
]

export const maintenanceData = [
  { id: 'BT001', equipmentId: 'EQ-1001', roomId: 'ROOM-A101', reportedBy: 'EMP001', assignedTo: 'EMP005', issue: 'Không nhận tín hiệu HDMI', severity: 'high', status: 'repairing', reportedAt: '2026-08-18', acceptedAt: '2026-08-18', startedAt: '2026-08-18', expectedDoneAt: '2026-08-20', estimatedCost: 500000, actualCost: 450000, note: 'Đang thay cổng HDMI.' },
  { id: 'BT002', equipmentId: 'EQ-1009', roomId: 'ROOM-B201', reportedBy: 'EMP002', assignedTo: 'EMP006', issue: 'Loa rè khi mở âm lượng lớn', severity: 'urgent', status: 'reported', reportedAt: '2026-08-18', acceptedAt: null, startedAt: null, expectedDoneAt: '2026-08-21', estimatedCost: 700000, actualCost: null, note: '' },
  { id: 'BT003', equipmentId: 'EQ-1007', roomId: 'ROOM-A103', reportedBy: 'EMP003', assignedTo: 'EMP005', issue: 'Cảm ứng lệch góc phải', severity: 'medium', status: 'checking', reportedAt: '2026-08-17', acceptedAt: '2026-08-17', startedAt: '2026-08-18', expectedDoneAt: '2026-08-20', estimatedCost: 0, actualCost: null, note: 'Cần cân chỉnh lại màn hình.' },
  { id: 'BT004', equipmentId: 'EQ-1015', roomId: 'ROOM-D402', reportedBy: 'EMP004', assignedTo: 'EMP007', issue: 'Bóng đèn máy chiếu yếu', severity: 'medium', status: 'waiting_parts', reportedAt: '2026-08-16', acceptedAt: '2026-08-16', startedAt: '2026-08-17', expectedDoneAt: '2026-08-23', estimatedCost: 1200000, actualCost: null, note: 'Đang chờ bóng đèn thay thế.' },
  { id: 'BT005', equipmentId: 'EQ-1012', roomId: 'ROOM-C302', reportedBy: 'EMP003', assignedTo: 'EMP006', issue: 'Pin tụt nhanh', severity: 'low', status: 'accepted', reportedAt: '2026-08-15', acceptedAt: '2026-08-15', startedAt: null, expectedDoneAt: '2026-08-22', estimatedCost: 300000, actualCost: null, note: '' },
  { id: 'BT006', equipmentId: 'EQ-1004', roomId: 'ROOM-A101', reportedBy: 'EMP001', assignedTo: 'EMP005', issue: 'Micro nhiễu tín hiệu', severity: 'medium', status: 'completed', reportedAt: '2026-08-10', acceptedAt: '2026-08-10', startedAt: '2026-08-10', expectedDoneAt: '2026-08-12', estimatedCost: 250000, actualCost: 220000, note: 'Đã thay pin và kiểm tra đầu thu.' },
  { id: 'BT007', equipmentId: 'EQ-1005', roomId: 'ROOM-A102', reportedBy: 'EMP002', assignedTo: 'EMP007', issue: 'Hình ảnh bị nhòe', severity: 'low', status: 'completed', reportedAt: '2026-07-28', acceptedAt: '2026-07-28', startedAt: '2026-07-29', expectedDoneAt: '2026-07-30', estimatedCost: 350000, actualCost: 300000, note: 'Đã vệ sinh ống kính.' },
  { id: 'BT008', equipmentId: 'EQ-1016', roomId: 'ROOM-E501', reportedBy: 'EMP004', assignedTo: 'EMP006', issue: 'Camera mất tiếng micro', severity: 'high', status: 'checking', reportedAt: '2026-08-14', acceptedAt: '2026-08-14', startedAt: '2026-08-15', expectedDoneAt: '2026-08-21', estimatedCost: 600000, actualCost: null, note: '' },
  { id: 'BT009', equipmentId: 'EQ-1013', roomId: 'ROOM-D401', reportedBy: 'EMP003', assignedTo: 'EMP005', issue: 'Không kết nối được bút cảm ứng', severity: 'low', status: 'completed', reportedAt: '2026-07-20', acceptedAt: '2026-07-20', startedAt: '2026-07-21', expectedDoneAt: '2026-07-22', estimatedCost: 150000, actualCost: 120000, note: '' },
  { id: 'BT010', equipmentId: 'EQ-1002', roomId: 'ROOM-A101', reportedBy: 'EMP001', assignedTo: 'EMP007', issue: 'Máy khởi động chậm', severity: 'medium', status: 'cancelled', reportedAt: '2026-07-18', acceptedAt: '2026-07-18', startedAt: null, expectedDoneAt: null, estimatedCost: 0, actualCost: 0, note: 'Hủy do thiết bị hoạt động bình thường sau cập nhật.' },
  { id: 'BT011', equipmentId: 'EQ-1003', roomId: 'ROOM-A101', reportedBy: 'EMP002', assignedTo: 'EMP006', issue: 'Bluetooth chập chờn', severity: 'medium', status: 'completed', reportedAt: '2026-07-10', acceptedAt: '2026-07-10', startedAt: '2026-07-11', expectedDoneAt: '2026-07-12', estimatedCost: 200000, actualCost: 180000, note: '' },
  { id: 'BT012', equipmentId: 'EQ-1008', roomId: 'ROOM-B201', reportedBy: 'EMP004', assignedTo: 'EMP005', issue: 'Cổng HDMI lỏng', severity: 'high', status: 'repairing', reportedAt: '2026-08-13', acceptedAt: '2026-08-13', startedAt: '2026-08-14', expectedDoneAt: '2026-08-20', estimatedCost: 400000, actualCost: null, note: '' },
  { id: 'BT013', equipmentId: 'EQ-1011', roomId: 'ROOM-C301', reportedBy: 'EMP003', assignedTo: 'EMP007', issue: 'Pin chai', severity: 'medium', status: 'reported', reportedAt: '2026-08-12', acceptedAt: null, startedAt: null, expectedDoneAt: '2026-08-24', estimatedCost: 900000, actualCost: null, note: '' },
  { id: 'BT014', equipmentId: 'EQ-1014', roomId: 'ROOM-D401', reportedBy: 'EMP002', assignedTo: 'EMP006', issue: 'Âm lượng nhỏ', severity: 'low', status: 'accepted', reportedAt: '2026-08-11', acceptedAt: '2026-08-11', startedAt: null, expectedDoneAt: '2026-08-19', estimatedCost: 100000, actualCost: null, note: '' },
  { id: 'BT015', equipmentId: 'EQ-1010', roomId: 'ROOM-C301', reportedBy: 'EMP001', assignedTo: 'EMP005', issue: 'Quạt tản nhiệt kêu lớn', severity: 'medium', status: 'completed', reportedAt: '2026-06-25', acceptedAt: '2026-06-25', startedAt: '2026-06-26', expectedDoneAt: '2026-06-28', estimatedCost: 450000, actualCost: 420000, note: '' },
  { id: 'BT016', equipmentId: 'EQ-1006', roomId: 'ROOM-A102', reportedBy: 'EMP004', assignedTo: 'EMP006', issue: 'Webcam hình tối', severity: 'low', status: 'completed', reportedAt: '2026-06-12', acceptedAt: '2026-06-12', startedAt: '2026-06-13', expectedDoneAt: '2026-06-14', estimatedCost: 120000, actualCost: 100000, note: '' },
  { id: 'BT017', equipmentId: 'EQ-1001', roomId: 'ROOM-A101', reportedBy: 'EMP001', assignedTo: 'EMP005', issue: 'Hình ảnh bị nhòe', severity: 'low', status: 'completed', reportedAt: '2026-05-10', acceptedAt: '2026-05-10', startedAt: '2026-05-10', expectedDoneAt: '2026-05-11', estimatedCost: 300000, actualCost: 300000, note: 'Đã vệ sinh lens.' },
  { id: 'BT018', equipmentId: 'EQ-1017', roomId: 'ROOM-KHO-Q1', reportedBy: 'EMP004', assignedTo: 'EMP007', issue: 'Thiếu nắp pin remote', severity: 'low', status: 'reported', reportedAt: '2026-08-09', acceptedAt: null, startedAt: null, expectedDoneAt: '2026-08-25', estimatedCost: 50000, actualCost: null, note: '' },
]

export const maintenanceHistoryData = [
  { id: 'MH001', maintenanceId: 'BT001', dateTime: '2026-08-18T08:30:00', employeeId: 'EMP001', content: 'báo hỏng' },
  { id: 'MH002', maintenanceId: 'BT001', dateTime: '2026-08-18T09:00:00', employeeId: 'EMP004', content: 'tiếp nhận phiếu' },
  { id: 'MH003', maintenanceId: 'BT001', dateTime: '2026-08-18T10:00:00', employeeId: 'EMP004', content: 'phân công Trần Văn Kỹ Thuật' },
  { id: 'MH004', maintenanceId: 'BT001', dateTime: '2026-08-18T14:00:00', employeeId: 'EMP005', content: 'bắt đầu kiểm tra' },
  { id: 'MH005', maintenanceId: 'BT001', dateTime: '2026-08-20T09:00:00', employeeId: 'EMP005', content: 'dự kiến hoàn thành' },
  { id: 'MH006', maintenanceId: 'BT006', dateTime: '2026-08-10T08:00:00', employeeId: 'EMP001', content: 'báo lỗi micro' },
  { id: 'MH007', maintenanceId: 'BT006', dateTime: '2026-08-12T16:00:00', employeeId: 'EMP005', content: 'hoàn tất sửa chữa' },
  { id: 'MH008', maintenanceId: 'BT017', dateTime: '2026-05-10T09:00:00', employeeId: 'EMP001', content: 'báo hình ảnh bị nhòe' },
  { id: 'MH009', maintenanceId: 'BT017', dateTime: '2026-05-11T11:00:00', employeeId: 'EMP005', content: 'hoàn tất vệ sinh lens' },
]
