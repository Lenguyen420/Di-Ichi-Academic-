import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../Common/Button.jsx'

const inputClass = 'mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100'

const emptyDeviceForm = {
  brokenReason: '',
  checkedAt: '',
  id: '',
  name: '',
  note: '',
  quantity: '',
  serial: '',
  status: 'Tốt',
  type: '',
}

const toDateInputValue = (value) => {
  const [day, month, year] = String(value || '').split('/')
  return day && month && year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : ''
}

const Field = ({ children, label }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    {children}
  </label>
)

export const EquipmentDeviceModal = ({ device = null, mode = 'create', onClose }) => {
  const [form, setForm] = useState(() => device ? {
    brokenReason: device.status === 'Hỏng' ? device.condition || '' : '',
    checkedAt: toDateInputValue(device.checkedAt),
    id: device.id || '',
    name: device.name || '',
    note: device.status !== 'Hỏng' ? device.condition || '' : '',
    quantity: String(device.quantity || ''),
    serial: device.serial || '',
    status: device.status || 'Tốt',
    type: device.type || '',
  } : emptyDeviceForm)

  const isEdit = mode === 'edit'
  const title = isEdit ? 'Sửa thiết bị' : 'Thêm thiết bị'
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label={`Đóng popup ${title.toLowerCase()}`} />
      <section className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-orange-600">Thiết bị lớp học</p>
            <h2 className="mt-1 text-xl font-black uppercase text-slate-950">{title}</h2>
          </div>
          <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label={`Đóng ${title.toLowerCase()}`}>
            <X size={18} />
          </Button>
        </div>

        <form className="max-h-[calc(92vh-5rem)] space-y-5 overflow-y-auto p-5" onSubmit={(event) => event.preventDefault()}>
        <section>
          <h3 className="text-sm font-black uppercase text-orange-600">Thông tin thiết bị</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <Field label="Tên thiết bị *">
              <input className={inputClass} placeholder="Máy chiếu Epson EB-X06" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            </Field>
            <Field label="Mã thiết bị *">
              <input className={inputClass} placeholder="TB001" value={form.id} onChange={(event) => updateField('id', event.target.value)} />
            </Field>
            <Field label="Loại thiết bị *">
              <select className={inputClass} value={form.type} onChange={(event) => updateField('type', event.target.value)}>
                <option value="" disabled>Chọn loại thiết bị</option>
                <option>Máy chiếu</option>
                <option>Máy tính</option>
                <option>Âm thanh</option>
                <option>Bảng tương tác</option>
                <option>Thiết bị online</option>
              </select>
            </Field>
            <Field label="Số serial">
              <input className={inputClass} placeholder="EP123456" value={form.serial} onChange={(event) => updateField('serial', event.target.value)} />
            </Field>
            <Field label="Số lượng *">
              <input className={inputClass} placeholder="1" type="number" min="1" value={form.quantity} onChange={(event) => updateField('quantity', event.target.value)} />
            </Field>
            <Field label="Ngày nhập thiết bị">
              <input className={inputClass} type="date" value={form.checkedAt} onChange={(event) => updateField('checkedAt', event.target.value)} />
            </Field>
          </div>
        </section>

        <section className="border-t border-orange-100 pt-5">
          <h3 className="text-sm font-black uppercase text-orange-600">Tình trạng</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Tốt', 'Cần kiểm tra', 'Hỏng', 'Bảo trì'].map((status) => (
              <label key={status} className="inline-flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-2 text-sm font-semibold text-slate-700">
                <input className="h-4 w-4 accent-orange-600" type="radio" name="device-status" checked={form.status === status} onChange={() => updateField('status', status)} />
                {status}
              </label>
            ))}
          </div>
          {form.status === 'Hỏng' && (
            <Field label="Lý do hỏng *">
              <textarea
                className={`${inputClass} h-24 py-3`}
                placeholder="Ví dụ: Máy chiếu không nhận tín hiệu HDMI"
                value={form.brokenReason}
                onChange={(event) => updateField('brokenReason', event.target.value)}
              />
            </Field>
          )}
          <Field label="Ghi chú">
            <textarea
              className={`${inputClass} h-24 py-3`}
              placeholder="Ghi chú"
              value={form.note}
              onChange={(event) => updateField('note', event.target.value)}
            />
          </Field>
        </section>

        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit" onClick={onClose}>Lưu thiết bị</Button>
        </div>
      </form>
    </section>
  </div>
  )
}
