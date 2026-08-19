import { X } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'

const statusTone = {
  'Bảo trì': 'amber',
  'Cần kiểm tra': 'amber',
  'Dự phòng': 'amber',
  Hỏng: 'rose',
  Tốt: 'green',
}

export const EquipmentDetailModal = ({ device, onClose, onEdit }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup chi tiết thiết bị" />
    <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Chi tiết thiết bị</p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">{device.name}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">{device.id} · {device.type}</p>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng chi tiết thiết bị">
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <Info label="Mã thiết bị" value={device.id} />
          <Info label="Tên thiết bị" value={device.name} />
          <Info label="Loại thiết bị" value={device.type} />
          <Info label="Số serial" value={device.serial || 'Chưa cập nhật'} />
          <Info label="Số lượng" value={device.quantity} />
          <Info label="Ngày kiểm tra" value={device.checkedAt} />
          <Info label="Phòng hiện tại" value={device.room || 'Chưa phân bổ'} />
          <Info label="Tình trạng" value={<Badge tone={statusTone[device.status] || 'slate'}>{device.status}</Badge>} />
        </div>

        <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4">
          <p className="text-xs font-black uppercase text-slate-400">Ghi chú kỹ thuật</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{device.condition || 'Chưa có ghi chú.'}</p>
        </div>

        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Đóng</Button>
          <Button type="button" onClick={() => onEdit(device)}>Sửa thiết bị</Button>
        </div>
      </div>
    </section>
  </div>
)

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <div className="mt-1 font-semibold text-slate-800">{value}</div>
  </div>
)
