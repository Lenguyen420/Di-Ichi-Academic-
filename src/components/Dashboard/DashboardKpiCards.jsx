import { ChevronRight, DoorOpen, GraduationCap, Projector, UserRoundCheck } from 'lucide-react'
import { Card } from '../Common/Card.jsx'

const icons = [GraduationCap, UserRoundCheck, DoorOpen, Projector]
const gradients = [
  'from-orange-50 to-amber-50',
  'from-emerald-50 to-teal-50',
  'from-sky-50 to-cyan-50',
  'from-rose-50 to-orange-50',
]

export const DashboardKpiCards = ({ kpis, onSelect }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {kpis.map((item, index) => {
      const Icon = icons[index]
      return (
        <Card
          key={item.id}
          className={`h-full rounded-lg bg-gradient-to-br ${gradients[index]} shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/80 text-orange-600 ring-1 ring-orange-100">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-600">{item.label}</p>
                <p className="mt-1 text-3xl font-black text-slate-950">{item.value}</p>
                <p className="mt-1 text-xs font-bold text-orange-700">{item.change}</p>
              </div>
            </div>
            <button
              className="mt-1 inline-flex shrink-0 items-center gap-1 text-xs font-black text-orange-700 transition hover:text-orange-900"
              type="button"
              onClick={() => onSelect(item)}
            >
              Xem chi tiết <ChevronRight size={16} />
            </button>
          </div>
        </Card>
      )
    })}
  </div>
)
