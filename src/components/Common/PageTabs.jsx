import { cn } from '../../utils/cn.js'

export const PageTabs = ({ tabs, activeTab, onChange }) => (
  <div className="overflow-x-auto rounded-lg border border-orange-100 bg-white p-1 shadow-sm">
    <div className="flex min-w-max gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-black transition',
              isActive ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
            )}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-pressed={isActive}
          >
            {Icon && <Icon size={17} />}
            {tab.label}
          </button>
        )
      })}
    </div>
  </div>
)
