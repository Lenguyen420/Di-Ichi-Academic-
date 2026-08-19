import { Bell, Menu } from 'lucide-react'
import { headerEmployee } from '../../datas/appStaticData.js'
import { getAuthSession } from '../../services/authSession.js'

export const Header = ({ onMenu }) => {
  const session = getAuthSession()
  const employeeName = session?.fullName || headerEmployee.name
  return (
    <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/85 px-4 py-3 shadow-sm shadow-orange-950/5 backdrop-blur-xl lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            className="group relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-200 ring-1 ring-orange-300 transition hover:-translate-y-0.5 hover:from-orange-700 hover:to-amber-600 hover:shadow-xl active:translate-y-0 lg:hidden"
            onClick={onMenu}
            type="button"
            aria-label="Mở menu"
          >
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white ring-2 ring-orange-500" />
            <Menu size={23} strokeWidth={2.6} />
          </button>

          <div>
            <p className="text-xs font-black uppercase tracking-wide text-orange-600">GIÁO VỤ</p>
            <h1 className="text-lg font-black text-slate-950 md:text-xl">Quản lý lớp học, giáo viên và trang thiết bị</h1>
          </div>

        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-orange-100 bg-white text-slate-600 shadow-sm transition hover:bg-orange-50 hover:text-orange-700" aria-label="Thông báo">
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>

          <button className="flex min-h-12 items-center gap-3 rounded-2xl border border-orange-100 bg-white px-2 py-1.5 shadow-sm transition hover:bg-orange-50">
            <img className="h-9 w-9 rounded-xl object-cover ring-2 ring-orange-100" src={headerEmployee.avatar} alt={employeeName} />
            <div className="hidden max-w-40 text-left sm:block">
              <p className="truncate text-sm font-black text-slate-900">{employeeName}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
