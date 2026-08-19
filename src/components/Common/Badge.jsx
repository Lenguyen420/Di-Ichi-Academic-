export const Badge = ({ children, tone = 'orange' }) => {
  const tones = {
    orange: 'bg-orange-50 text-orange-700 ring-orange-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${tones[tone]}`}>{children}</span>
}
