import { X } from 'lucide-react'
import { Button } from '../Common/Button.jsx'

export const CreateClassModal = ({
  campusOptions,
  courseOptions,
  form,
  onChange,
  onClose,
  onSubmit,
  statusOptions,
}) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup thêm lớp" />
    <section className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Danh sách lớp</p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">Thêm lớp mới cho khóa học</h2>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng thêm lớp">
          <X size={18} />
        </Button>
      </div>

      <form className="max-h-[calc(92vh-5rem)] space-y-4 overflow-y-auto p-5" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Khóa học" options={courseOptions.map((item) => ({ label: item, value: item }))} required value={form.course} onChange={(value) => onChange('course', value)} />
          <InputField label="Tên lớp" placeholder="VD: IELTS Foundation 10A" required value={form.name} onChange={(value) => onChange('name', value)} />
          <InputField label="Chuyên môn" placeholder="VD: IELTS, TOEIC, Kids" readOnly value={form.specialty} onChange={(value) => onChange('specialty', value)} />
          <SelectField label="Cơ sở" options={campusOptions.map((item) => ({ label: item, value: item }))} value={form.campus} onChange={(value) => onChange('campus', value)} />
        </div>

        <WeekdayField value={form.weekdays} onChange={(value) => onChange('weekdays', value)} />

        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Phòng học" placeholder="VD: 205" required value={form.roomDetail} onChange={(value) => onChange('roomDetail', value)} />
          <SelectField
            label="Trạng thái"
            options={[...new Set(['Chưa phân giáo viên', 'Sắp khai giảng', ...statusOptions])].map((item) => ({ label: item, value: item }))}
            value={form.status}
            onChange={(value) => onChange('status', value)}
          />
          <InputField label="Giờ bắt đầu" required type="time" value={form.timeStart} onChange={(value) => onChange('timeStart', value)} />
          <InputField label="Giờ kết thúc" required type="time" value={form.timeEnd} onChange={(value) => onChange('timeEnd', value)} />
          <InputField label="Ngày khai giảng" type="date" value={form.startDate} onChange={(value) => onChange('startDate', value)} />
          <InputField label="Ngày kết thúc" type="date" value={form.endDate} onChange={(value) => onChange('endDate', value)} />
          <InputField label="Học viên hiện tại" min="0" type="number" value={form.studentCount} onChange={(value) => onChange('studentCount', value)} />
          <InputField label="Sĩ số tối đa" min="1" type="number" value={form.studentCapacity} onChange={(value) => onChange('studentCapacity', value)} />
        </div>

        <div className="flex justify-end gap-2 border-t border-orange-100 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit">Thêm lớp</Button>
        </div>
      </form>
    </section>
  </div>
)

const weekdayOptions = [
  { label: 'Thứ 2', value: 'T2' },
  { label: 'Thứ 3', value: 'T3' },
  { label: 'Thứ 4', value: 'T4' },
  { label: 'Thứ 5', value: 'T5' },
  { label: 'Thứ 6', value: 'T6' },
  { label: 'Thứ 7', value: 'T7' },
  { label: 'Chủ nhật', value: 'CN' },
]

const WeekdayField = ({ onChange, value }) => {
  const selectedDays = value || []

  const toggleDay = (day) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter((item) => item !== day)
      : [...selectedDays, day]

    onChange(nextDays.sort((first, second) => weekdayOptions.findIndex((item) => item.value === first) - weekdayOptions.findIndex((item) => item.value === second)))
  }

  return (
    <div>
      <p className="text-sm font-black text-slate-700">Thứ học <span className="text-red-500">*</span></p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {weekdayOptions.map((day) => (
          <label key={day.value} className="flex h-11 items-center gap-2 rounded-lg border border-orange-100 bg-white px-3 text-sm font-black text-slate-700 transition hover:border-orange-200 hover:bg-orange-50">
            <input
              className="h-4 w-4 accent-orange-600"
              type="checkbox"
              checked={selectedDays.includes(day.value)}
              onChange={() => toggleDay(day.value)}
            />
            {day.label}
          </label>
        ))}
      </div>
    </div>
  )
}

const InputField = ({ label, onChange, value, ...props }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}{props.required && <span className="text-red-500"> *</span>}</span>
    <input
      className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm outline-none placeholder:text-slate-400 read-only:bg-slate-50 read-only:font-semibold read-only:text-slate-600 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    />
  </label>
)

const SelectField = ({ label, onChange, options, value, ...props }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}{props.required && <span className="text-red-500"> *</span>}</span>
    <select
      className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    >
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
)
