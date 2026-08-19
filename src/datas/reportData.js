export const reportFilterOptions = {
  campuses: ['Tất cả cơ sở', 'Quận 1', 'Quận 3', 'Bình Thạnh', 'Thủ Đức', 'Gò Vấp'],
  courses: ['Tất cả khóa học', 'IELTS', 'TOEIC', 'Kids'],
  months: ['2026-08', '2026-07', '2026-06'],
}

export const teacherReportData = {
  teachers: [
    { teacherId: 'GV001', teacherName: 'Nguyễn Thùy Linh', specialty: 'IELTS', campus: 'Quận 1', classCount: 5, weeklyHours: 18, maxWeeklyHours: 21, utilization: 85.71, status: 'Bình thường', recommendation: 'Giữ tải', month: '2026-08' },
    { teacherId: 'GV002', teacherName: 'Trần Hoàng Nam', specialty: 'TOEIC', campus: 'Quận 1', classCount: 4, weeklyHours: 16, maxWeeklyHours: 22, utilization: 72.73, status: 'Thiếu tải', recommendation: 'Có thể nhận thêm', month: '2026-08' },
    { teacherId: 'GV003', teacherName: 'Phạm Minh Hạnh', specialty: 'Kids', campus: 'Quận 3', classCount: 6, weeklyHours: 22, maxWeeklyHours: 21, utilization: 104.76, status: 'Quá tải', recommendation: 'Cần giảm lớp', month: '2026-08' },
    { teacherId: 'GV004', teacherName: 'Đỗ Minh Quân', specialty: 'IELTS', campus: 'Quận 1', classCount: 3, weeklyHours: 12, maxWeeklyHours: 20, utilization: 60, status: 'Thiếu tải', recommendation: 'Ưu tiên lớp mới', month: '2026-08' },
    { teacherId: 'GV005', teacherName: 'Lê Anh Khoa', specialty: 'IELTS', campus: 'Bình Thạnh', classCount: 5, weeklyHours: 21, maxWeeklyHours: 21, utilization: 100, status: 'Quá tải', recommendation: 'Theo dõi tải', month: '2026-08' },
    { teacherId: 'GV006', teacherName: 'Trần Bảo Ngọc', specialty: 'TOEIC', campus: 'Thủ Đức', classCount: 2, weeklyHours: 8, maxWeeklyHours: 18, utilization: 44.44, status: 'Thiếu tải', recommendation: 'Có thể nhận thêm', month: '2026-08' },
    { teacherId: 'GV007', teacherName: 'Hoàng Minh Châu', specialty: 'IELTS', campus: 'Quận 3', classCount: 4, weeklyHours: 17, maxWeeklyHours: 20, utilization: 85, status: 'Bình thường', recommendation: 'Giữ tải', month: '2026-07' },
  ],
  classes: [
    { classId: 'L01', classCode: 'IELTS08A', className: 'IELTS Foundation 08A', course: 'IELTS Foundation', courseGroup: 'IELTS', teacherId: 'GV001', room: 'A101', schedule: 'T2 - T4', startTime: '18:30', endTime: '20:00', studentCount: 16, status: 'Đang học', campus: 'Quận 1', month: '2026-08' },
    { classId: 'L02', classCode: 'IELTS08B', className: 'IELTS Foundation 08B', course: 'IELTS Foundation', courseGroup: 'IELTS', teacherId: 'GV001', room: 'A102', schedule: 'T3 - T5', startTime: '18:30', endTime: '20:00', studentCount: 15, status: 'Đang học', campus: 'Quận 1', month: '2026-08' },
    { classId: 'L03', classCode: 'IELTS09A', className: 'IELTS Foundation 09A', course: 'IELTS Foundation', courseGroup: 'IELTS', teacherId: 'GV004', room: 'A103', schedule: 'T2 - T4', startTime: '20:00', endTime: '21:30', studentCount: 10, status: 'Đang học', campus: 'Quận 1', month: '2026-08' },
    { classId: 'L04', classCode: 'TOEIC07B', className: 'Future Stars 07B', course: 'Future Stars', courseGroup: 'TOEIC', teacherId: 'GV002', room: 'B201', schedule: 'T3 - T5', startTime: '19:00', endTime: '20:30', studentCount: 14, status: 'Đang học', campus: 'Quận 1', month: '2026-08' },
    { classId: 'L05', classCode: 'KIDS06C', className: 'Bright Stars 06C', course: 'Bright Stars', courseGroup: 'Kids', teacherId: 'GV003', room: 'C301', schedule: 'T7 - CN', startTime: '09:00', endTime: '10:30', studentCount: 18, status: 'Đang học', campus: 'Quận 3', month: '2026-08' },
    { classId: 'L06', classCode: 'IELTS09B', className: 'Di-Ichi Leader 09B', course: 'Di-Ichi Leader', courseGroup: 'IELTS', teacherId: 'GV005', room: 'B202', schedule: 'T3 - T5', startTime: '17:30', endTime: '19:00', studentCount: 12, status: 'Đang học', campus: 'Bình Thạnh', month: '2026-08' },
    { classId: 'L07', classCode: 'TOEIC08A', className: 'TOEIC Practice 08A', course: 'Future Stars', courseGroup: 'TOEIC', teacherId: 'GV006', room: 'D401', schedule: 'T2 - T4', startTime: '18:00', endTime: '19:30', studentCount: 11, status: 'Đang học', campus: 'Thủ Đức', month: '2026-08' },
  ],
  assignments: [
    { assignmentId: 'PC001', teacherId: 'GV001', classId: 'L01', role: 'Giáo viên chính', startDate: '2026-08-01', endDate: '2026-08-31', weekday: 'T2 - T4', startTime: '18:30', endTime: '20:00', room: 'A101', status: 'Đang dạy', month: '2026-08' },
    { assignmentId: 'PC002', teacherId: 'GV001', classId: 'L02', role: 'Giáo viên chính', startDate: '2026-08-01', endDate: '2026-08-31', weekday: 'T3 - T5', startTime: '18:30', endTime: '20:00', room: 'A102', status: 'Đang dạy', month: '2026-08' },
    { assignmentId: 'PC003', teacherId: 'GV004', classId: 'L03', role: 'Giáo viên chính', startDate: '2026-08-01', endDate: '2026-08-31', weekday: 'T2 - T4', startTime: '20:00', endTime: '21:30', room: 'A103', status: 'Đang dạy', month: '2026-08' },
    { assignmentId: 'PC004', teacherId: 'GV002', classId: 'L04', role: 'Giáo viên chính', startDate: '2026-08-01', endDate: '2026-08-31', weekday: 'T3 - T5', startTime: '19:00', endTime: '20:30', room: 'B201', status: 'Đang dạy', month: '2026-08' },
    { assignmentId: 'PC005', teacherId: 'GV003', classId: 'L05', role: 'Giáo viên chính', startDate: '2026-08-01', endDate: '2026-08-31', weekday: 'T7 - CN', startTime: '09:00', endTime: '10:30', room: 'C301', status: 'Đang dạy', month: '2026-08' },
    { assignmentId: 'PC006', teacherId: 'GV005', classId: 'L06', role: 'Giáo viên chính', startDate: '2026-08-01', endDate: '2026-08-31', weekday: 'T3 - T5', startTime: '17:30', endTime: '19:00', room: 'B202', status: 'Đang dạy', month: '2026-08' },
    { assignmentId: 'PC007', teacherId: 'GV006', classId: 'L07', role: 'Giáo viên chính', startDate: '2026-08-01', endDate: '2026-08-31', weekday: 'T2 - T4', startTime: '18:00', endTime: '19:30', room: 'D401', status: 'Đang dạy', month: '2026-08' },
  ],
}
