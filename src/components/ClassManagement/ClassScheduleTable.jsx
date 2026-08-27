import { ChevronLeft, ChevronRight, Edit, Eye } from 'lucide-react'
import { Button } from '../Common/Button.jsx'
import { Card } from '../Common/Card.jsx'

const weekDays = [
  { code: 'T2', date: '17/08/2026', label: 'T2', name: 'Thứ 2' },
  { code: 'T3', date: '18/08/2026', label: 'T3', name: 'Thứ 3' },
  { code: 'T4', date: '19/08/2026', label: 'T4', name: 'Thứ 4' },
  { code: 'T5', date: '20/08/2026', label: 'T5', name: 'Thứ 5' },
  { code: 'T6', date: '21/08/2026', label: 'T6', name: 'Thứ 6' },
  { code: 'T7', date: '22/08/2026', label: 'T7', name: 'Thứ 7' },
  { code: 'CN', date: '23/08/2026', label: 'CN', name: 'Chủ nhật' },
]

const expandScheduleDays = (schedule) => String(schedule || '').split(',')[0].split('-').map((day) => day.trim()).filter(Boolean)

const getStartTime = (time) => String(time || '').split('-')[0].trim()

export const ClassScheduleTable = ({ classes, onViewSchedule }) => {
  const timeSlots = [...new Set(classes.map((classItem) => getStartTime(classItem.time)))].sort()
  const events = classes.flatMap((classItem) =>
    expandScheduleDays(classItem.schedule).map((dayCode) => ({ ...classItem, dayCode, startTime: getStartTime(classItem.time) })),
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-orange-600">Lịch học</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Theo dõi lịch học của các lớp, giáo viên và phòng học.</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" type="button" aria-label="Tuần trước"><ChevronLeft size={18} /></Button>
          <Button variant="secondary" type="button">Hôm nay</Button>
          <Button variant="secondary" type="button" aria-label="Tuần sau"><ChevronRight size={18} /></Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-black text-slate-900">Tuần này</p>
      </div>

      <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[5rem_repeat(7,minmax(7rem,1fr))] border-b border-orange-100 text-sm">
              <div className="px-3 py-3" />
              {weekDays.map((day) => (
                <div key={day.code} className="px-3 py-3 text-center font-black text-slate-700">
                  <p>{day.label}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{day.date}</p>
                </div>
              ))}
            </div>

            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid min-h-24 grid-cols-[5rem_repeat(7,minmax(7rem,1fr))] border-b border-orange-50 last:border-b-0">
                <div className="px-3 py-3 text-sm font-black text-slate-500">{timeSlot}</div>
                {weekDays.map((day) => {
                  const cellEvents = events.filter((event) => event.dayCode === day.code && event.startTime === timeSlot)

                  return (
                    <div key={`${timeSlot}-${day.code}`} className="min-h-24 border-l border-orange-50 p-2">
                      <div className="space-y-2">
                        {cellEvents.map((event) => (
                          <button
                            key={`${event.id}-${day.code}`}
                            className="w-full rounded-lg border border-orange-200 bg-gradient-to-br from-orange-100 to-amber-50 p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
                            type="button"
                            onClick={() => onViewSchedule({ ...event, date: day.date, dayName: day.name })}
                          >
                            <p className="truncate text-xs font-black text-slate-950">{event.shortName}</p>
                            <p className="mt-1 truncate text-xs font-semibold text-orange-700">{event.campus}</p>
                            <p className="mt-1 truncate text-xs font-semibold text-slate-500">{event.room}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

export const ClassScheduleDetailModal = ({ schedule, onClose, onEditSchedule, onViewClass }) => {
  if (!schedule) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup lịch học" />
      <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="border-b border-orange-100 px-5 py-4">
          <p className="text-sm font-bold text-orange-600">Chi tiết lịch học</p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">{schedule.name}</h2>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4">
            <p className="text-xl font-black text-slate-950">{schedule.time}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{schedule.dayName}, {schedule.date}</p>
          </div>

          <Info label="Giáo viên" value={schedule.teacher || 'Chưa phân giáo viên'} />
          <Info label="Cơ sở" value={schedule.campus} />
          <Info label="Phòng" value={schedule.roomDetail} />
          <Info label="Sĩ số" value={schedule.students} />

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => onViewClass(schedule)}>
              <Eye size={18} /> Xem lớp
            </Button>
            <Button type="button" onClick={() => onEditSchedule(schedule)}>
              <Edit size={18} /> Chỉnh sửa lịch
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm font-bold text-slate-500">{label}:</p>
    <p className="mt-1 text-base font-black text-slate-950">{value}</p>
  </div>
)
