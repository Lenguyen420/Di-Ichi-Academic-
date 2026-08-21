import { useMemo, useState } from 'react'
import { Bell, Clock, FileText } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { headerNotifications } from '../../datas/notificationData.js'
import { NotificationDetailModal } from './NotificationDetailModal.jsx'

export const HeaderNotifications = () => {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const unreadCount = useMemo(() => headerNotifications.filter((item) => item.unread).length, [])

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification)
    setNotificationOpen(false)
  }

  return (
    <>
      <div className="relative">
        <button
          className="relative grid h-11 w-11 place-items-center rounded-2xl border border-orange-100 bg-white text-slate-600 shadow-sm transition hover:bg-orange-50 hover:text-orange-700"
          aria-label="Thông báo"
          aria-expanded={notificationOpen}
          type="button"
          onClick={() => setNotificationOpen((open) => !open)}
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-orange-600 px-0.5 text-[8px] font-black leading-none text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {notificationOpen && (
          <>
            <button className="fixed inset-0 z-40 cursor-default" type="button" aria-label="Đóng danh sách thông báo" onClick={() => setNotificationOpen(false)} />
            <div className="absolute right-0 top-full z-50 mt-2 w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/15">
              <div className="flex items-start justify-between gap-3 border-b border-orange-100 px-4 py-3">
                <div>
                  <p className="text-xs font-black uppercase text-orange-600">Thông báo</p>
                  <h2 className="text-base font-black text-slate-950">Cập nhật giáo vụ</h2>
                </div>
                <Badge tone="orange">{unreadCount} mới</Badge>
              </div>

              <div className="max-h-[28rem] overflow-y-auto p-2">
                {headerNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-orange-50"
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${notification.unread ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                      {notification.type === 'report' ? <FileText size={17} /> : <Bell size={17} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-black text-slate-900">{notification.title}</span>
                        {notification.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />}
                      </span>
                      <span className="mt-1 line-clamp-2 text-sm font-semibold text-slate-600">{notification.message}</span>
                      <span className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock size={13} />
                        {notification.time}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-orange-100 bg-orange-50/60 px-4 py-3 text-xs font-bold text-slate-500">
                Chọn một thông báo để xem chi tiết.
              </div>
            </div>
          </>
        )}
      </div>

      {selectedNotification && <NotificationDetailModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />}
    </>
  )
}
