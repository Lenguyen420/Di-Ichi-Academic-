import { CalendarDays, DoorOpen, GraduationCap, X } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'

export const TeacherScheduleModal = ({ classes, onClose, teacher }) => {
  if (!teacher) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup lịch dạy" />
      <section className="relative z-10 w-full max-w-4xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Lịch dạy giáo viên</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{teacher.teacher}</h2>
            <p className="mt-1 text-sm text-slate-500">{teacher.specialty} · {teacher.campus}</p>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng lịch dạy">
            <X size={18} />
          </Button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <SummaryItem icon={<GraduationCap size={18} />} label="Số lớp" value={String(classes.length)} />
            <SummaryItem icon={<CalendarDays size={18} />} label="Lịch dạy" value={teacher.teachingDays || '—'} />
            <SummaryItem icon={<DoorOpen size={18} />} label="Trạng thái" value={<Badge tone={teacher.status === 'Chưa phân lớp' ? 'amber' : 'green'}>{teacher.status}</Badge>} />
          </div>

          <div className="overflow-hidden rounded-lg border border-orange-100">
            <table className="min-w-full divide-y divide-orange-100 text-left text-sm">
              <thead className="bg-orange-50 text-xs uppercase text-orange-700">
                <tr>
                  <th className="px-4 py-3 font-black">Lớp học</th>
                  <th className="px-4 py-3 font-black">Khóa học</th>
                  <th className="px-4 py-3 font-black">Lịch</th>
                  <th className="px-4 py-3 font-black">Thời gian</th>
                  <th className="px-4 py-3 font-black">Phòng</th>
                  <th className="px-4 py-3 font-black">Sĩ số</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {classes.length ? classes.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-orange-50/60">
                    <td className="px-4 py-3 font-black text-slate-900">{classItem.name}</td>
                    <td className="px-4 py-3 text-slate-700">{classItem.course}</td>
                    <td className="px-4 py-3 text-slate-700">{classItem.days}</td>
                    <td className="px-4 py-3 text-slate-700">{classItem.time}</td>
                    <td className="px-4 py-3 text-slate-700">{classItem.room}</td>
                    <td className="px-4 py-3"><Badge>{classItem.students}</Badge></td>
                  </tr>
                )) : (
                  <tr>
                    <td className="px-4 py-5 text-center font-semibold text-slate-500" colSpan={6}>Giáo viên chưa có lịch dạy.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

const SummaryItem = ({ icon, label, value }) => (
  <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-3">
    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-orange-600 ring-1 ring-orange-100">{icon}</span>
    <p className="mt-3 text-xs font-black uppercase text-slate-400">{label}</p>
    <div className="mt-1 font-semibold text-slate-800">{value}</div>
  </div>
)
