import { createPortal } from 'react-dom'
import { Bell, ChartColumn, X } from 'lucide-react'
import { Button } from '../Common/Button.jsx'

export const NotificationDetailModal = ({ notification, onClose }) => {
  const report = notification.report

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup chi tiết thông báo" />
      <section className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Chi tiết thông báo</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{notification.title}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{notification.createdAt} · Mức ưu tiên {notification.priority}</p>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng chi tiết thông báo">
            <X size={18} />
          </Button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4">
            <p className="text-xs font-black uppercase text-slate-400">Nội dung</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{notification.message}</p>
          </div>

          {report ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <NotificationInfo label="Mã báo cáo" value={report.code} />
                <NotificationInfo label="Kỳ báo cáo" value={report.period} />
                <NotificationInfo label="Cơ sở" value={report.campus} />
                <NotificationInfo label="Đơn vị lập" value={report.owner} />
                <NotificationInfo label="Thời gian tạo" value={report.generatedAt} />
                <NotificationInfo label="Loại báo cáo" value={report.name} />
              </div>

              <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4">
                <p className="text-xs font-black uppercase text-slate-400">Tóm tắt báo cáo</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{report.summary}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {report.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
                    <p className="text-xs font-black uppercase text-slate-400">{metric.label}</p>
                    <p className="mt-1 text-2xl font-black text-slate-950">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <ChartColumn size={18} className="text-orange-600" />
                  <p className="text-sm font-black text-slate-950">Nhận định chính</p>
                </div>
                <ul className="mt-3 space-y-2">
                  {report.findings.map((finding) => (
                    <li key={finding} className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold leading-6 text-slate-700">
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-orange-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-orange-600" />
                <p className="text-sm font-black text-slate-950">Thông tin xử lý</p>
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                Vui lòng kiểm tra nội dung thông báo và cập nhật trạng thái trên màn hình nghiệp vụ liên quan.
              </p>
            </div>
          )}

          <div className="flex justify-end border-t border-orange-100 pt-4">
            <Button variant="secondary" type="button" onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}

const NotificationInfo = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <div className="mt-1 font-semibold text-slate-800">{value}</div>
  </div>
)
