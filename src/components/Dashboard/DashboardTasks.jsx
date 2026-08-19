import { Card } from '../Common/Card.jsx'

export const DashboardTasks = ({ tasks }) => (
  <Card className="rounded-lg">
    <h2 className="text-lg font-black text-slate-950">Công việc hôm nay</h2>
    <div className="mt-4 space-y-3">
      {tasks.map((task) => (
        <label key={task.id} className="flex items-start gap-3 rounded-lg border border-orange-100 p-3 text-sm font-semibold text-slate-700">
          <input className="mt-1 h-4 w-4 rounded border-orange-200 accent-orange-600" type="checkbox" />
          {task.content}
        </label>
      ))}
    </div>
  </Card>
)
