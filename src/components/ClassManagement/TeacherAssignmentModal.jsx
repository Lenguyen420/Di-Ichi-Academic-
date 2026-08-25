import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../Common/Button.jsx'

export const TeacherAssignmentModal = ({
  conflictMessage,
  courseOptions,
  form,
  filteredClasses,
  onChange,
  onClose,
  onSubmit,
  rooms,
  selectedClass,
  teachers,
}) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 p-4">
    <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Đóng popup phân công giáo viên" />
    <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-lg border border-orange-100 bg-white shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4 border-b border-orange-100 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-orange-600">Phân công</p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">Phân công giáo viên</h2>
        </div>
        <Button className="shrink-0" variant="ghost" type="button" onClick={onClose} aria-label="Đóng phân công">
          <X size={18} />
        </Button>
      </div>

      <form className="space-y-4 p-5" onSubmit={onSubmit}>
        <SelectField label="Khóa học" value={form.course} onChange={(value) => onChange('course', value)} options={courseOptions.map((course) => ({ label: course, value: course }))} />
        <SelectField label="Lớp học" value={form.classId} onChange={(value) => onChange('classId', value)} options={filteredClasses.map((item) => ({ label: item.name, value: item.id }))} />
        {/* <SelectField label="Giáo viên" value={form.teacherId} onChange={(value) => onChange('teacherId', value)} options={teachers.map((item) => ({ label: item.teacher, value: item.id }))} /> */}
        <TeacherAutocomplete
          teachers={teachers}
          value={form.teacherId}
          onChange={(value) => onChange('teacherId', value)}
        />
        <div>
          <p className="text-sm font-black text-slate-700">Vai trò</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {['Giáo viên chính', 'Trợ giảng'].map((role) => (
              <label key={role} className="inline-flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-2 text-sm font-semibold text-slate-700">
                <input className="h-4 w-4 accent-orange-600" type="radio" name="teacher-role" value={role} checked={form.role === role} onChange={(event) => onChange('role', event.target.value)} />
                {role}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-4">
          <p className="text-sm font-black text-slate-700">Lịch học</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{selectedClass ? `${selectedClass.schedule.split(',')[0]} | ${selectedClass.time}` : '—'}</p>
        </div>

        <SelectField label="Phòng" value={form.room} onChange={(value) => onChange('room', value)} options={rooms.map((room) => ({ label: room, value: room }))} />

        {conflictMessage && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {conflictMessage}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit" disabled={Boolean(conflictMessage)}>Lưu phân công</Button>
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

const TeacherAutocomplete = ({ teachers, value, onChange }) => {
  const [keyword, setKeyword] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const selectedTeacher = useMemo(
    () => teachers.find((item) => item.id === value),
    [teachers, value]
  )

  useEffect(() => {
    if (selectedTeacher) {
      setKeyword(selectedTeacher.teacher)
    }
  }, [selectedTeacher])

  const filteredTeachers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) return teachers

    return teachers.filter((item) =>
      item.teacher.toLowerCase().includes(normalizedKeyword)
    )
  }, [keyword, teachers])

  const handleChange = (event) => {
    const newValue = event.target.value

    setKeyword(newValue)
    setIsOpen(true)

    // Nếu sửa nội dung sau khi đã chọn giáo viên thì bỏ lựa chọn cũ
    if (selectedTeacher && newValue !== selectedTeacher.teacher) {
      onChange('')
    }
  }

  const handleSelect = (teacher) => {
    onChange(teacher.id)
    setKeyword(teacher.teacher)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <label className="block">
        <span className="text-sm font-black text-slate-700">
          Giáo viên
        </span>

        <input
          type="text"
          value={keyword}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Nhập tên giáo viên để tìm kiếm..."
          autoComplete="off"
          className="mt-2 h-11 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
        />
      </label>

      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-orange-100 bg-white p-1 shadow-xl">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(teacher)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm transition ${
                  teacher.id === value
                    ? 'bg-orange-50 font-bold text-orange-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{teacher.teacher}</span>

                {teacher.id === value && (
                  <span className="text-xs font-bold text-orange-600">
                    Đã chọn
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-sm font-medium text-slate-500">
              Không tìm thấy giáo viên phù hợp
            </div>
          )}
        </div>
      )}
    </div>
  )
}
