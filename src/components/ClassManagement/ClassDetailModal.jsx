import { useState } from 'react'
import { CalendarDays, DoorOpen, GraduationCap, UserRound, UsersRound, X } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'
import { PageTabs } from '../Common/PageTabs.jsx'

const parseClassSize = (students) => {
  const [current = 0, capacity = 0] = String(students || '0/0').split('/').map((value) => Number(value) || 0)
  return { capacity, current, remaining: Math.max(capacity - current, 0) }
}

export const ClassDetailModal = ({ classItem, onClose, students = [] }) => {
  const [activeTab, setActiveTab] = useState('info')
  if (!classItem) return null

  const seats = parseClassSize(classItem.students)
  const tabs = [
    { id: 'info', label: 'Thông tin lớp', icon: GraduationCap },
    { id: 'teacher', label: 'Giáo viên', icon: UserRound },
    { id: 'students', label: 'Học viên', icon: UsersRound },
    { id: 'schedule', label: 'Lịch học', icon: CalendarDays },
    { id: 'room', label: 'Phòng học', icon: DoorOpen },
  ]

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup chi tiết lớp học" />
      <section className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Chi tiết lớp học</p>
            <h2 className="mt-1 text-xl font-black uppercase text-slate-950">Lớp {classItem.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{classItem.course} · {classItem.teacher}</p>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng chi tiết">
            <X size={18} />
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'info' && (
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Khóa học" value={classItem.course} />
              <Info label="Giáo viên" value={classItem.teacher} />
              <Info label="Sĩ số" value={classItem.students} />
              <Info label="Phòng" value={classItem.roomDetail} />
              <Info label="Lịch" value={classItem.days} />
              <Info label="Thời gian" value={classItem.time} />
              <Info label="Ngày khai giảng" value={classItem.startDate} />
              <Info label="Ngày kết thúc" value={classItem.endDate} />
            </div>
          )}

          {activeTab === 'teacher' && (
            <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4">
              <p className="text-sm font-bold text-slate-500">Giáo viên phụ trách</p>
              <p className="mt-1 text-xl font-black text-slate-950">{classItem.teacher}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">Khóa học: {classItem.course}</p>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Info label="Sĩ số hiện tại" value={classItem.students} />
                <Info label="Còn trống" value={`${seats.remaining} chỗ`} />
                <Info label="Học viên trong danh sách" value={`${students.length} học viên`} />
              </div>

              <div className="overflow-hidden rounded-lg border border-orange-100 bg-white">
                <div className="max-h-[42vh] overflow-auto">
                  <table className="min-w-full divide-y divide-orange-100 text-left text-sm">
                    <thead className="bg-orange-50 text-xs uppercase text-orange-700">
                      <tr>
                        <th className="px-4 py-3 font-black">Học viên</th>
                        <th className="px-4 py-3 font-black">Liên hệ</th>
                        <th className="px-4 py-3 font-black">Ngày ghi danh</th>
                        <th className="px-4 py-3 font-black">Học phí</th>
                        <th className="px-4 py-3 font-black">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50">
                      {students.length ? students.map((student) => (
                        <tr key={student.id} className="hover:bg-orange-50/60">
                          <td className="px-4 py-3">
                            <p className="font-black text-slate-900">{student.name}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">{student.id}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{student.phone}</td>
                          <td className="px-4 py-3 text-slate-700">{student.enrolledAt}</td>
                          <td className="px-4 py-3"><Badge tone={student.paymentStatus === 'Còn công nợ' ? 'rose' : 'green'}>{student.paymentStatus}</Badge></td>
                          <td className="px-4 py-3"><Badge tone={student.status === 'Đang học' ? 'green' : 'amber'}>{student.status}</Badge></td>
                        </tr>
                      )) : (
                        <tr>
                          <td className="px-4 py-5 text-center font-semibold text-slate-500" colSpan={5}>Lớp chưa có học viên.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Lịch" value={classItem.days} />
              <Info label="Thời gian" value={classItem.time} />
              <Info label="Ngày khai giảng" value={classItem.startDate} />
              <Info label="Ngày kết thúc" value={classItem.endDate} />
            </div>
          )}

          {activeTab === 'room' && (
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Phòng" value={classItem.roomDetail} />
              <Info label="Cơ sở" value={classItem.campus} />
              <Info label="Trạng thái lớp" value={<Badge tone={classItem.status === 'Đang học' ? 'green' : 'amber'}>{classItem.status}</Badge>} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <div className="mt-1 font-semibold text-slate-800">{value}</div>
  </div>
)
