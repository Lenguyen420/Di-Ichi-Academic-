import { X } from 'lucide-react'
import { Badge } from '../Common/Badge.jsx'
import { Button } from '../Common/Button.jsx'

export const StudentAssignmentModal = ({
  availableClasses,
  conflictMessage,
  courseOptions,
  form,
  onChange,
  onClose,
  onSubmit,
  selectedClass,
  selectedStudent,
  students,
}) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup phân phối học viên" />
    <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Phân phối học viên</p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">Xếp lớp học viên</h2>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng phân phối học viên">
          <X size={18} />
        </Button>
      </div>

      <form className="space-y-4 p-5" onSubmit={onSubmit}>
        <SelectField label="Học viên" options={students.map((student) => ({ label: `${student.name} - ${student.targetCourse}`, value: student.id }))} value={form.studentId} onChange={(value) => onChange('studentId', value)} />
        <SelectField label="Khóa học" options={courseOptions.map((course) => ({ label: course, value: course }))} value={form.course} onChange={(value) => onChange('course', value)} />
        <SelectField label="Lớp học" options={availableClasses.map((classItem) => ({ label: `${classItem.name} (${classItem.students})`, value: classItem.id }))} value={form.classId} onChange={(value) => onChange('classId', value)} />

        {selectedClass && (
          <div className="grid gap-3 rounded-lg border border-orange-100 bg-orange-50/60 p-4 md:grid-cols-2">
            <Info label="Lịch học" value={`${selectedClass.days} | ${selectedClass.time}`} />
            <Info label="Cơ sở" value={selectedClass.campus} />
            <Info label="Phòng" value={selectedClass.room} />
            <Info label="Giáo viên" value={selectedClass.teacher || 'Chưa phân giáo viên'} />
          </div>
        )}

        {selectedStudent && (
          <div className="rounded-lg border border-orange-100 bg-white p-4">
            <p className="text-sm font-black text-slate-700">{selectedStudent.name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>{selectedStudent.targetCourse}</Badge>
              <Badge tone={selectedStudent.paymentStatus === 'Còn công nợ' ? 'rose' : 'green'}>{selectedStudent.paymentStatus}</Badge>
            </div>
            {selectedStudent.note && <p className="mt-2 text-sm font-semibold text-slate-500">{selectedStudent.note}</p>}
          </div>
        )}

        {conflictMessage && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {conflictMessage}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-black text-slate-700">Ghi chú phân lớp</span>
          <textarea className="mt-2 h-20 w-full rounded-lg border border-orange-100 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100" placeholder="Ghi chú thêm cho giáo vụ..." value={form.note} onChange={(event) => onChange('note', event.target.value)} />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit" disabled={Boolean(conflictMessage)}>Lưu phân lớp</Button>
        </div>
      </form>
    </section>
  </div>
)

const SelectField = ({ label, onChange, options, value }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <select
      className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
)

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-orange-100 bg-white p-3 shadow-sm">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <div className="mt-1 font-semibold text-slate-800">{value}</div>
  </div>
)
