import { useMemo, useState } from 'react'
import { CalendarDays, Filter, Plus, Search, Table, UserRoundCheck } from 'lucide-react'
import { toast } from 'sonner'
import { ClassDetailModal } from '../../components/ClassManagement/ClassDetailModal.jsx'
import { ClassListTable } from '../../components/ClassManagement/ClassListTable.jsx'
import { ClassScheduleDetailModal, ClassScheduleTable } from '../../components/ClassManagement/ClassScheduleTable.jsx'
import { TeacherAssignmentModal } from '../../components/ClassManagement/TeacherAssignmentModal.jsx'
import { TeacherAssignmentTable } from '../../components/ClassManagement/TeacherAssignmentTable.jsx'
import { TeacherScheduleModal } from '../../components/ClassManagement/TeacherScheduleModal.jsx'
import { Button } from '../../components/Common/Button.jsx'
import { Card } from '../../components/Common/Card.jsx'
import { PageTabs } from '../../components/Common/PageTabs.jsx'
import { classList, teacherAssignments } from '../../datas/academicOperationsData.js'

const allCoursesOption = 'Tất cả khóa học'
const allCampusesOption = 'Tất cả cơ sở'
const allStatusesOption = 'Tất cả trạng thái'
const allTeachersOption = 'Tất cả giáo viên'
const tabs = [
  { id: 'classes', label: 'Danh sách lớp', icon: Table },
  { id: 'teachers', label: 'Phân phối giáo viên', icon: UserRoundCheck },
  { id: 'schedule', label: 'Lịch học', icon: CalendarDays },
]

const defaultAssignmentRole = 'Giáo viên chính'
const classPageSize = 10
const teacherPageSize = 5

const parseMinutes = (time) => {
  const [hour, minute] = time.split(':').map((part) => Number(part) || 0)
  return hour * 60 + minute
}

const parseTimeRange = (value) => {
  const [start = '', end = ''] = String(value || '').split('-').map((part) => part.trim())
  return { end: parseMinutes(end), start: parseMinutes(start) }
}

const hasSharedTeachingDay = (firstSchedule, secondSchedule) => {
  const firstDays = String(firstSchedule || '').split(',')[0].trim()
  const secondDays = String(secondSchedule || '').split(',')[0].trim()
  return firstDays && secondDays && firstDays === secondDays
}

const hasTimeOverlap = (firstTime, secondTime) => {
  const first = parseTimeRange(firstTime)
  const second = parseTimeRange(secondTime)
  return first.start < second.end && second.start < first.end
}

export const ClassManagementPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [classRows, setClassRows] = useState(classList)
  const [teacherRows, setTeacherRows] = useState(teacherAssignments)
  const [keyword, setKeyword] = useState('')
  const [courseFilter, setCourseFilter] = useState(allCoursesOption)
  const [campusFilter, setCampusFilter] = useState(allCampusesOption)
  const [statusFilter, setStatusFilter] = useState(allStatusesOption)
  const [teacherKeyword, setTeacherKeyword] = useState('')
  const [teacherCourseFilter, setTeacherCourseFilter] = useState(allCoursesOption)
  const [teacherFilter, setTeacherFilter] = useState(allTeachersOption)
  const [teacherStatusFilter, setTeacherStatusFilter] = useState(allStatusesOption)
  const [teacherCampusFilter, setTeacherCampusFilter] = useState(allCampusesOption)
  const [scheduleCampusFilter, setScheduleCampusFilter] = useState(allCampusesOption)
  const [scheduleCourseFilter, setScheduleCourseFilter] = useState(allCoursesOption)
  const [scheduleTeacherFilter, setScheduleTeacherFilter] = useState(allTeachersOption)
  const [scheduleRoomFilter, setScheduleRoomFilter] = useState('Tất cả phòng')
  const [classPage, setClassPage] = useState(1)
  const [teacherPage, setTeacherPage] = useState(1)
  const [assignmentForm, setAssignmentForm] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedTeacherSchedule, setSelectedTeacherSchedule] = useState(null)
  const [selectedClassSchedule, setSelectedClassSchedule] = useState(null)

  const courseOptions = useMemo(() => [...new Set(classRows.map((item) => item.course))], [classRows])
  const campusOptions = useMemo(() => [...new Set(classRows.map((item) => item.campus))], [classRows])
  const statusOptions = useMemo(() => [...new Set(classRows.map((item) => item.status))], [classRows])
  const teacherOptions = useMemo(() => teacherRows.map((item) => item.teacher), [teacherRows])
  const teacherStatusOptions = useMemo(() => [...new Set(teacherRows.map((item) => item.status))], [teacherRows])
  const roomOptions = useMemo(() => [...new Set(classRows.map((item) => item.room))], [classRows])
  const filteredClasses = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    return classRows.filter((item) => {
      const matchesKeyword = !normalizedKeyword || [item.name, item.teacher, item.room].some((value) => String(value || '').toLowerCase().includes(normalizedKeyword))
      const matchesCourse = courseFilter === allCoursesOption || item.course === courseFilter
      const matchesCampus = campusFilter === allCampusesOption || item.campus === campusFilter
      const matchesStatus = statusFilter === allStatusesOption || item.status === statusFilter
      return matchesKeyword && matchesCourse && matchesCampus && matchesStatus
    })
  }, [campusFilter, classRows, courseFilter, keyword, statusFilter])
  const filteredTeachers = useMemo(() => {
    const normalizedKeyword = teacherKeyword.trim().toLowerCase()
    return teacherRows.filter((item) => {
      const matchesKeyword = !normalizedKeyword || [item.teacher, item.specialty, ...item.classNames].some((value) => String(value || '').toLowerCase().includes(normalizedKeyword))
      const matchesCourse = teacherCourseFilter === allCoursesOption || item.course === teacherCourseFilter
      const matchesTeacher = teacherFilter === allTeachersOption || item.teacher === teacherFilter
      const matchesStatus = teacherStatusFilter === allStatusesOption || item.status === teacherStatusFilter
      const matchesCampus = teacherCampusFilter === allCampusesOption || item.campus === teacherCampusFilter
      return matchesKeyword && matchesCourse && matchesTeacher && matchesStatus && matchesCampus
    })
  }, [teacherCampusFilter, teacherCourseFilter, teacherFilter, teacherKeyword, teacherRows, teacherStatusFilter])
  const classTotalPages = Math.max(1, Math.ceil(filteredClasses.length / classPageSize))
  const teacherTotalPages = Math.max(1, Math.ceil(filteredTeachers.length / teacherPageSize))
  const pagedClasses = useMemo(() => {
    const safePage = Math.min(classPage, classTotalPages)
    const start = (safePage - 1) * classPageSize
    return filteredClasses.slice(start, start + classPageSize)
  }, [classPage, classTotalPages, filteredClasses])
  const pagedTeachers = useMemo(() => {
    const safePage = Math.min(teacherPage, teacherTotalPages)
    const start = (safePage - 1) * teacherPageSize
    return filteredTeachers.slice(start, start + teacherPageSize)
  }, [filteredTeachers, teacherPage, teacherTotalPages])
  const selectedAssignmentClass = useMemo(
    () => classRows.find((item) => item.id === assignmentForm?.classId) || null,
    [assignmentForm?.classId, classRows],
  )
  const assignmentClassOptions = useMemo(
    () => classRows.filter((item) => item.course === assignmentForm?.course),
    [assignmentForm?.course, classRows],
  )
  const conflictMessage = useMemo(() => {
    if (!assignmentForm || !selectedAssignmentClass) return ''

    const selectedTeacher = teacherRows.find((item) => item.id === assignmentForm.teacherId)
    if (!selectedTeacher) return ''

    const conflictingClass = classRows.find((item) =>
      item.id !== selectedAssignmentClass.id
      && item.teacher === selectedTeacher.teacher
      && hasSharedTeachingDay(item.schedule, selectedAssignmentClass.schedule)
      && hasTimeOverlap(item.time, selectedAssignmentClass.time),
    )

    return conflictingClass ? `${selectedTeacher.teacher} đã có lớp ${conflictingClass.name} trùng lịch ${conflictingClass.schedule}.` : ''
  }, [assignmentForm, classRows, selectedAssignmentClass, teacherRows])
  const availableRooms = useMemo(() => [...new Set(classRows.map((item) => item.roomDetail ? `Phòng ${item.roomDetail}` : item.room))], [classRows])
  const selectedTeacherScheduleClasses = useMemo(
    () => classRows.filter((item) => item.teacher === selectedTeacherSchedule?.teacher),
    [classRows, selectedTeacherSchedule?.teacher],
  )
  const filteredScheduleClasses = useMemo(() => classRows.filter((item) => {
    const matchesCampus = scheduleCampusFilter === allCampusesOption || item.campus === scheduleCampusFilter
    const matchesCourse = scheduleCourseFilter === allCoursesOption || item.course === scheduleCourseFilter
    const matchesTeacher = scheduleTeacherFilter === allTeachersOption || item.teacher === scheduleTeacherFilter
    const matchesRoom = scheduleRoomFilter === 'Tất cả phòng' || item.room === scheduleRoomFilter
    return matchesCampus && matchesCourse && matchesTeacher && matchesRoom
  }), [classRows, scheduleCampusFilter, scheduleCourseFilter, scheduleRoomFilter, scheduleTeacherFilter])

  const openAssignmentModal = (teacher = null) => {
    const firstUnassignedClass = classRows.find((item) => !item.teacher) || classRows[0]
    const targetTeacher = teacher || teacherRows.find((item) => item.status === 'Chưa phân lớp') || teacherRows[0]
    setAssignmentForm({
      classId: firstUnassignedClass.id,
      course: firstUnassignedClass.course,
      teacherId: targetTeacher.id,
      role: defaultAssignmentRole,
      room: firstUnassignedClass.roomDetail ? `Phòng ${firstUnassignedClass.roomDetail}` : firstUnassignedClass.room,
    })
  }

  const updateAssignmentForm = (field, value) => {
    setAssignmentForm((current) => {
      const next = { ...current, [field]: value }
      if (field === 'course') {
        const firstClassInCourse = classRows.find((item) => item.course === value)
        next.classId = firstClassInCourse?.id || ''
        next.room = firstClassInCourse?.roomDetail ? `Phòng ${firstClassInCourse.roomDetail}` : firstClassInCourse?.room || ''
      }

      if (field === 'classId') {
        const nextClass = classRows.find((item) => item.id === value)
        next.room = nextClass?.roomDetail ? `Phòng ${nextClass.roomDetail}` : nextClass?.room || current.room
      }

      return next
    })
  }

  const handleAssignmentSubmit = (event) => {
    event.preventDefault()
    if (conflictMessage || !selectedAssignmentClass) return

    const selectedTeacher = teacherRows.find((item) => item.id === assignmentForm.teacherId)
    if (!selectedTeacher) return

    setClassRows((current) => current.map((item) =>
      item.id === selectedAssignmentClass.id
        ? { ...item, room: assignmentForm.room.replace('Phòng ', 'P.'), roomDetail: assignmentForm.room.replace('Phòng ', ''), status: 'Đang học', teacher: selectedTeacher.teacher }
        : item,
    ))
    setTeacherRows((current) => current.map((item) => {
      if (item.id !== selectedTeacher.id) return item

      const classNames = [...new Set([...item.classNames, selectedAssignmentClass.shortName])]
      const teachingDays = [...new Set([...String(item.teachingDays || '').split(',').map((day) => day.trim()).filter(Boolean), selectedAssignmentClass.schedule.split(',')[0]])].join(', ')
      return { ...item, classCount: Math.max(item.classCount + 1, classNames.length), classNames, status: 'Đang dạy', teachingDays }
    }))
    setAssignmentForm(null)
    toast.success('Đã lưu phân công giáo viên.')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-bold text-orange-600">Lớp học</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Quản lý lớp học</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Theo dõi danh sách lớp, phân phối giáo viên và lịch học theo từng phòng.</p>
        </div>
        <PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'classes' && (
        <>
          <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-black text-slate-700">Tìm kiếm lớp</span>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="h-11 w-full rounded-lg border border-orange-100 bg-white px-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    placeholder="Tên lớp, giáo viên hoặc phòng học..."
                    value={keyword}
                    onChange={(event) => {
                      setKeyword(event.target.value)
                      setClassPage(1)
                    }}
                  />
                </div>
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <FilterSelect label="Khóa học" value={courseFilter} onChange={(value) => { setCourseFilter(value); setClassPage(1) }} options={[allCoursesOption, ...courseOptions]} />
                <FilterSelect label="Cơ sở" value={campusFilter} onChange={(value) => { setCampusFilter(value); setClassPage(1) }} options={[allCampusesOption, ...campusOptions]} />
                <FilterSelect label="Trạng thái" value={statusFilter} onChange={(value) => { setStatusFilter(value); setClassPage(1) }} options={[allStatusesOption, ...statusOptions]} />
              </div>
            </div>
          </Card>
          <ClassListTable classes={pagedClasses} onView={setSelectedClass} />
          <PaginationControls
            currentPage={Math.min(classPage, classTotalPages)}
            label="lớp"
            pageSize={classPageSize}
            totalItems={filteredClasses.length}
            totalPages={classTotalPages}
            onPageChange={setClassPage}
          />
        </>
      )}

      {activeTab === 'teachers' && (
        <>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold text-orange-600">Phân phối giáo viên</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Quản lý và phân công giáo viên vào các lớp học.</h2>
            </div>
            <Button type="button" onClick={() => openAssignmentModal()}>
              <Plus size={18} /> Phân công giáo viên
            </Button>
          </div>

          <TeacherStats />

          <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-black text-slate-700">Tìm kiếm</span>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="h-11 w-full rounded-lg border border-orange-100 bg-white px-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    placeholder="Tìm giáo viên hoặc lớp..."
                    value={teacherKeyword}
                    onChange={(event) => {
                      setTeacherKeyword(event.target.value)
                      setTeacherPage(1)
                    }}
                  />
                </div>
              </label>
              <div className="grid gap-4 md:grid-cols-4">
                <FilterSelect label="Khóa học" value={teacherCourseFilter} onChange={(value) => { setTeacherCourseFilter(value); setTeacherPage(1) }} options={[allCoursesOption, ...courseOptions]} />
                <FilterSelect label="Giáo viên" value={teacherFilter} onChange={(value) => { setTeacherFilter(value); setTeacherPage(1) }} options={[allTeachersOption, ...teacherOptions]} />
                <FilterSelect label="Trạng thái" value={teacherStatusFilter} onChange={(value) => { setTeacherStatusFilter(value); setTeacherPage(1) }} options={[allStatusesOption, ...teacherStatusOptions]} />
                <FilterSelect label="Cơ sở" value={teacherCampusFilter} onChange={(value) => { setTeacherCampusFilter(value); setTeacherPage(1) }} options={[allCampusesOption, ...campusOptions]} />
              </div>
            </div>
          </Card>

          <TeacherAssignmentTable
            assignments={pagedTeachers}
            onAssign={openAssignmentModal}
            onViewSchedule={setSelectedTeacherSchedule}
          />
          <PaginationControls
            currentPage={Math.min(teacherPage, teacherTotalPages)}
            label="giáo viên"
            pageSize={teacherPageSize}
            totalItems={filteredTeachers.length}
            totalPages={teacherTotalPages}
            onPageChange={setTeacherPage}
          />
        </>
      )}
      {activeTab === 'schedule' && (
        <>
          <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="grid gap-4 md:grid-cols-4">
              <FilterSelect label="Cơ sở" value={scheduleCampusFilter} onChange={setScheduleCampusFilter} options={[allCampusesOption, ...campusOptions]} />
              <FilterSelect label="Khóa học" value={scheduleCourseFilter} onChange={setScheduleCourseFilter} options={[allCoursesOption, ...courseOptions]} />
              <FilterSelect label="Giáo viên" value={scheduleTeacherFilter} onChange={setScheduleTeacherFilter} options={[allTeachersOption, ...teacherOptions]} />
              <FilterSelect label="Phòng" value={scheduleRoomFilter} onChange={setScheduleRoomFilter} options={['Tất cả phòng', ...roomOptions]} />
            </div>
          </Card>

          <ClassScheduleTable
            classes={filteredScheduleClasses}
            onViewSchedule={setSelectedClassSchedule}
          />
        </>
      )}
      {selectedClass && <ClassDetailModal classItem={selectedClass} onClose={() => setSelectedClass(null)} />}
      {selectedClassSchedule && (
        <ClassScheduleDetailModal
          schedule={selectedClassSchedule}
          onClose={() => setSelectedClassSchedule(null)}
          onEditSchedule={(schedule) => toast.info(`Chỉnh sửa lịch ${schedule.name} sẽ được bổ sung ở bước tiếp theo.`)}
          onViewClass={(schedule) => {
            setSelectedClassSchedule(null)
            setSelectedClass(classRows.find((item) => item.id === schedule.id))
          }}
        />
      )}
      {selectedTeacherSchedule && (
        <TeacherScheduleModal
          classes={selectedTeacherScheduleClasses}
          onClose={() => setSelectedTeacherSchedule(null)}
          teacher={selectedTeacherSchedule}
        />
      )}
      {assignmentForm && (
        <TeacherAssignmentModal
          conflictMessage={conflictMessage}
          courseOptions={courseOptions}
          filteredClasses={assignmentClassOptions}
          form={assignmentForm}
          onChange={updateAssignmentForm}
          onClose={() => setAssignmentForm(null)}
          onSubmit={handleAssignmentSubmit}
          rooms={availableRooms}
          selectedClass={selectedAssignmentClass}
          teachers={teacherRows}
        />
      )}
    </div>
  )
}

const TeacherStats = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {[
      { label: 'Tổng giáo viên', value: '32' },
      { label: 'Đã phân lớp', value: '29' },
      { label: 'Chưa phân lớp', value: '3' },
    ].map((item) => (
      <Card key={item.label} className="rounded-lg bg-gradient-to-br from-orange-50 to-white">
        <p className="text-sm font-bold text-slate-500">{item.label}</p>
        <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
      </Card>
    ))}
  </div>
)

const PaginationControls = ({ currentPage, label, onPageChange, pageSize, totalItems, totalPages }) => {
  const firstItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0
  const lastItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border border-orange-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center">
      <span className="font-semibold">
        Hiển thị {firstItem}-{lastItem} / {totalItems} {label}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange((page) => Math.max(1, page - 1))}
        >
          Trang trước
        </Button>
        <span className="min-w-20 text-center font-black text-slate-900">
          {currentPage}/{totalPages}
        </span>
        <Button
          variant="secondary"
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange((page) => Math.min(totalPages, page + 1))}
        >
          Trang sau
        </Button>
      </div>
    </div>
  )
}

const FilterSelect = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="text-sm font-black text-slate-700">{label}</span>
    <div className="relative mt-2">
      <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <select
        className="h-11 w-full rounded-lg border border-orange-100 bg-white px-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  </label>
)
