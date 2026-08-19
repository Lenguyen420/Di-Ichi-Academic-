import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { DashboardKpiCards } from '../../components/Dashboard/DashboardKpiCards.jsx'
import { Card } from '../../components/Common/Card.jsx'
import { academicAlerts, academicKpis, todayClassSchedule } from '../../datas/academicOperationsData.js'

export const DashboardPage = () => {
  const navigate = useNavigate()

  const handleSelectKpi = (item) => {
    if (item.id === 'classes' || item.id === 'teachers' || item.id === 'rooms') {
      navigate('/lop-hoc')
      return
    }

    if (item.id === 'devices') {
      navigate('/thiet-bi-lop-hoc')
      return
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-orange-600">Trang Tổng quan Giáo vụ</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Các chỉ số</h1>
      </div>

      <DashboardKpiCards kpis={academicKpis} onSelect={handleSelectKpi} />

      <Card className="rounded-lg bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <h2 className="text-lg font-black text-slate-950">Các cảnh báo</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {academicAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between gap-4 rounded-lg border border-amber-100 bg-white/75 px-4 py-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
                  <AlertTriangle size={18} />
                </span>
                <p className="truncate text-sm font-black text-slate-800">{alert.label}</p>
              </div>
              <span className="text-lg font-black text-orange-600">{alert.count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-lg bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div>
          <p className="text-sm font-bold text-orange-600">Lịch học hôm nay</p>
          <h2 className="mt-1 text-lg font-black uppercase text-slate-950">Lịch lớp học hôm nay</h2>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-sky-100 bg-white/75 shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <tbody>
              {todayClassSchedule.map((item) => (
                <tr key={item.id} className="odd:bg-sky-50/70 even:bg-white/70 hover:bg-cyan-50">
                  <td className="w-24 px-4 py-4 font-black text-sky-700">{item.time}</td>
                  <td className="px-4 py-4 font-black text-slate-900">{item.className}</td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{item.room}</td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{item.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
