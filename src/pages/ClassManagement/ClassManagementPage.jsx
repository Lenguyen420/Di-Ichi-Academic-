import { useMemo, useState } from 'react'
import { CalendarDays, Filter, Plus, Search, Table, UserRoundCheck, UsersRound } from 'lucide-react'
import { toast } from 'sonner'
import { ClassDetailModal } from '../../components/ClassManagement/ClassDetailModal.jsx'
import { ClassListTable } from '../../components/ClassManagement/ClassListTable.jsx'
import { ClassScheduleDetailModal, ClassScheduleTable } from '../../components/ClassManagement/ClassScheduleTable.jsx'
import { CreateClassModal } from '../../components/ClassManagement/CreateClassModal.jsx'
import { StudentAssignmentModal } from '../../components/ClassManagement/StudentAssignmentModal.jsx'
import { StudentAssignmentTable } from '../../components/ClassManagement/StudentAssignmentTable.jsx'
import { TeacherAssignmentModal } from '../../components/ClassManagement/TeacherAssignmentModal.jsx'
import { TeacherAssignmentTable } from '../../components/ClassManagement/TeacherAssignmentTable.jsx'
import { TeacherScheduleModal } from '../../components/ClassManagement/TeacherScheduleModal.jsx'
import { Button } from '../../components/Common/Button.jsx'
import { Card } from '../../components/Common/Card.jsx'
import { PageTabs } from '../../components/Common/PageTabs.jsx'
import { classList, studentAssignments, teacherAssignments } from '../../datas/academicOperationsData.js'

const allCoursesOption = 'Tất cả khóa học'
const allCampusesOption = 'Tất cả cơ sở'
const allStatusesOption = 'Tất cả trạng thái'
const allSchedulesOption = 'Tất cả lịch học'
const allTeachersOption = 'Tất cả giáo viên'
const allClassesOption = 'Tất cả lớp'
const tabs = [
  { id: 'classes', label: 'Danh sách lớp', icon: Table },
  { id: 'teachers', label: 'Phân phối giáo viên', icon: UserRoundCheck },
  { id: 'students', label: 'Phân phối học viên', icon: UsersRound },
  { id: 'schedule', label: 'Lịch học', icon: CalendarDays },
]

const defaultAssignmentRole = 'Giáo viên chính'
const classPageSize = 10
const teacherPageSize = 5
const studentPageSize = 8
const defaultClassForm = {
  campus: '',
  course: '',
  endDate: '',
  name: '',
  roomDetail: '',
  specialty: '',
  startDate: '',
  status: 'Chưa phân giáo viên',
  studentCapacity: '20',
  studentCount: '0',
  timeEnd: '20:00',
  timeStart: '18:30',
  weekdays: ['T2', 'T4'],
}

const weekdayLabels = {
  T2: 'Thứ 2',
  T3: 'Thứ 3',
  T4: 'Thứ 4',
  T5: 'Thứ 5',
  T6: 'Thứ 6',
  T7: 'Thứ 7',
  CN: 'Chủ nhật',
}

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

const formatWeekdaysForView = (weekdays) => weekdays.map((day) => weekdayLabels[day]).join(', ')

const formatWeekdaysForSchedule = (weekdays) => weekdays.join('-')

const formatDateForView = (value) => {
  if (!value) return ''

  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

const makeClassId = (rows) => {
  const nextNumber = rows.reduce((maxNumber, item) => {
    const number = Number(String(item.id).replace(/\D/g, '')) || 0
    return Math.max(maxNumber, number)
  }, 1000) + 1

  return `CLASS-${nextNumber}`
}

const getClassCapacity = (students) => String(students || '0/20').split('/')[1] || '20'

const getTeachingScheduleLabel = (classItem) => `${classItem.days} | ${classItem.time}`

const parseClassSize = (students) => {
  const [current = 0, capacity = 0] = String(students || '0/0').split('/').map((value) => Number(value) || 0)
  return { capacity, current }
}

export const ClassManagementPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [classRows, setClassRows] = useState(classList)
  const [studentRows, setStudentRows] = useState(studentAssignments)
  const [teacherRows, setTeacherRows] = useState(teacherAssignments)
  const [keyword, setKeyword] = useState('')
  const [courseFilter, setCourseFilter] = useState(allCoursesOption)
  const [campusFilter, setCampusFilter] = useState(allCampusesOption)
  const [statusFilter, setStatusFilter] = useState(allStatusesOption)
  const [classScheduleFilter, setClassScheduleFilter] = useState(allSchedulesOption)
  const [teacherKeyword, setTeacherKeyword] = useState('')
  const [teacherCourseFilter, setTeacherCourseFilter] = useState(allCoursesOption)
  const [teacherFilter, setTeacherFilter] = useState(allTeachersOption)
  const [teacherStatusFilter, setTeacherStatusFilter] = useState(allStatusesOption)
  const [teacherCampusFilter, setTeacherCampusFilter] = useState(allCampusesOption)
  const [studentKeyword, setStudentKeyword] = useState('')
  const [studentCourseFilter, setStudentCourseFilter] = useState(allCoursesOption)
  const [studentClassFilter, setStudentClassFilter] = useState(allClassesOption)
  const [studentStatusFilter, setStudentStatusFilter] = useState(allStatusesOption)
  const [studentCampusFilter, setStudentCampusFilter] = useState(allCampusesOption)
  const [studentScheduleFilter, setStudentScheduleFilter] = useState(allSchedulesOption)
  const [scheduleCampusFilter, setScheduleCampusFilter] = useState(allCampusesOption)
  const [scheduleCourseFilter, setScheduleCourseFilter] = useState(allCoursesOption)
  const [scheduleTeacherFilter, setScheduleTeacherFilter] = useState(allTeachersOption)
  const [scheduleRoomFilter, setScheduleRoomFilter] = useState('Tất cả phòng')
  const [classPage, setClassPage] = useState(1)
  const [teacherPage, setTeacherPage] = useState(1)
  const [studentPage, setStudentPage] = useState(1)
  const [assignmentForm, setAssignmentForm] = useState(null)
  const [studentAssignmentForm, setStudentAssignmentForm] = useState(null)
  const [classForm, setClassForm] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedTeacherSchedule, setSelectedTeacherSchedule] = useState(null)
  const [selectedClassSchedule, setSelectedClassSchedule] = useState(null)

  const classStudentCounts = useMemo(() => studentRows.reduce((counts, student) => {
    if (!student.classId || student.status === 'Bảo lưu') return counts

    counts[student.classId] = (counts[student.classId] || 0) + 1
    return counts
  }, {}), [studentRows])
  const classRowsWithStudents = useMemo(() => classRows.map((item) => ({
    ...item,
    students: `${classStudentCounts[item.id] || 0}/${getClassCapacity(item.students)}`,
  })), [classRows, classStudentCounts])
  const classById = useMemo(() => new Map(classRowsWithStudents.map((item) => [item.id, item])), [classRowsWithStudents])
  const courseOptions = useMemo(() => [...new Set(classRowsWithStudents.map((item) => item.course))], [classRowsWithStudents])
  const campusOptions = useMemo(() => [...new Set(classRowsWithStudents.map((item) => item.campus))], [classRowsWithStudents])
  const statusOptions = useMemo(() => [...new Set(classRowsWithStudents.map((item) => item.status))], [classRowsWithStudents])
  const classScheduleOptions = useMemo(() => [...new Set(classRowsWithStudents.map((item) => item.days).filter(Boolean))], [classRowsWithStudents])
  const studentClassOptions = useMemo(() => {
    const matchingClasses = studentCourseFilter === allCoursesOption
      ? classRowsWithStudents
      : classRowsWithStudents.filter((item) => item.course === studentCourseFilter)

    return [...new Set(matchingClasses.map((item) => item.name))]
  }, [classRowsWithStudents, studentCourseFilter])
  const studentStatusOptions = useMemo(() => [...new Set(studentRows.map((item) => item.status))], [studentRows])
  const teacherOptions = useMemo(() => teacherRows.map((item) => item.teacher), [teacherRows])
  const teacherStatusOptions = useMemo(() => [...new Set(teacherRows.map((item) => item.status))], [teacherRows])
  const roomOptions = useMemo(() => [...new Set(classRowsWithStudents.map((item) => item.room))], [classRowsWithStudents])
  const enrichedTeacherRows = useMemo(() => teacherRows.map((teacher) => {
    const assignedClasses = classRowsWithStudents.filter((classItem) => classItem.teacher === teacher.teacher)

    if (!assignedClasses.length) return teacher

    return {
      ...teacher,
      classCount: assignedClasses.length,
      classNames: assignedClasses.map((classItem) => classItem.shortName),
      campus: [...new Set(assignedClasses.map((classItem) => classItem.campus))].join(', '),
      course: assignedClasses[0].course,
      teachingDays: [...new Set(assignedClasses.map((classItem) => classItem.days))].join(', '),
      teachingSchedule: [...new Set(assignedClasses.map(getTeachingScheduleLabel))].join('; '),
    }
  }), [classRowsWithStudents, teacherRows])
  const courseProfiles = useMemo(() => courseOptions.map((course) => {
    const courseClasses = classRowsWithStudents.filter((item) => item.course === course)
    const firstClass = courseClasses[0] || {}

    return {
      campuses: [...new Set(courseClasses.map((item) => item.campus))],
      capacity: getClassCapacity(firstClass.students),
      course,
      specialty: firstClass.specialty || course,
    }
  }), [classRowsWithStudents, courseOptions])
  const filteredClasses = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    return classRowsWithStudents.filter((item) => {
      const matchesKeyword = !normalizedKeyword || [item.name, item.teacher, item.room].some((value) => String(value || '').toLowerCase().includes(normalizedKeyword))
      const matchesCourse = courseFilter === allCoursesOption || item.course === courseFilter
      const matchesCampus = campusFilter === allCampusesOption || item.campus === campusFilter
      const matchesStatus = statusFilter === allStatusesOption || item.status === statusFilter
      const matchesSchedule = classScheduleFilter === allSchedulesOption || item.days === classScheduleFilter
      return matchesKeyword && matchesCourse && matchesCampus && matchesStatus && matchesSchedule
    })
  }, [campusFilter, classRowsWithStudents, classScheduleFilter, courseFilter, keyword, statusFilter])
  const filteredTeachers = useMemo(() => {
    const normalizedKeyword = teacherKeyword.trim().toLowerCase()
    return enrichedTeacherRows.filter((item) => {
      const matchesKeyword = !normalizedKeyword || [item.teacher, item.specialty, item.teachingSchedule, ...item.classNames].some((value) => String(value || '').toLowerCase().includes(normalizedKeyword))
      const matchesCourse = teacherCourseFilter === allCoursesOption || item.course === teacherCourseFilter
      const matchesTeacher = teacherFilter === allTeachersOption || item.teacher === teacherFilter
      const matchesStatus = teacherStatusFilter === allStatusesOption || item.status === teacherStatusFilter
      const matchesCampus = teacherCampusFilter === allCampusesOption || item.campus === teacherCampusFilter
      return matchesKeyword && matchesCourse && matchesTeacher && matchesStatus && matchesCampus
    })
  }, [enrichedTeacherRows, teacherCampusFilter, teacherCourseFilter, teacherFilter, teacherKeyword, teacherStatusFilter])
  const enrichedStudentRows = useMemo(() => studentRows.map((student) => {
    const classItem = classById.get(student.classId)

    return {
      ...student,
      campus: classItem?.campus || '',
      className: classItem?.name || '',
      course: classItem?.course || student.targetCourse,
      days: classItem?.days || '',
      room: classItem?.room || '',
      scheduleLabel: classItem ? `${classItem.days} | ${classItem.time}` : '',
      teacher: classItem?.teacher || '',
    }
  }), [classById, studentRows])
  const filteredStudents = useMemo(() => {
    const normalizedKeyword = studentKeyword.trim().toLowerCase()

    return enrichedStudentRows.filter((item) => {
      const matchesKeyword = !normalizedKeyword || [item.name, item.phone, item.email, item.className].some((value) => String(value || '').toLowerCase().includes(normalizedKeyword))
      const matchesCourse = studentCourseFilter === allCoursesOption || item.course === studentCourseFilter || item.targetCourse === studentCourseFilter
      const matchesClass = studentClassFilter === allClassesOption || item.className === studentClassFilter
      const matchesStatus = studentStatusFilter === allStatusesOption || item.status === studentStatusFilter
      const matchesCampus = studentCampusFilter === allCampusesOption || item.campus === studentCampusFilter
      const matchesSchedule = studentScheduleFilter === allSchedulesOption || item.days === studentScheduleFilter
      return matchesKeyword && matchesCourse && matchesClass && matchesStatus && matchesCampus && matchesSchedule
    })
  }, [enrichedStudentRows, studentCampusFilter, studentClassFilter, studentCourseFilter, studentKeyword, studentScheduleFilter, studentStatusFilter])
  const classTotalPages = Math.max(1, Math.ceil(filteredClasses.length / classPageSize))
  const teacherTotalPages = Math.max(1, Math.ceil(filteredTeachers.length / teacherPageSize))
  const studentTotalPages = Math.max(1, Math.ceil(filteredStudents.length / studentPageSize))
  const studentStats = useMemo(() => {
    const assignedCount = studentRows.filter((item) => item.classId).length
    const waitingCount = studentRows.filter((item) => item.status === 'Chờ phân lớp').length

    return [
      { label: 'Tổng học viên', value: String(studentRows.length) },
      { label: 'Đã phân lớp', value: String(assignedCount) },
      { label: 'Chờ phân lớp', value: String(waitingCount) },
    ]
  }, [studentRows])
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
  const pagedStudents = useMemo(() => {
    const safePage = Math.min(studentPage, studentTotalPages)
    const start = (safePage - 1) * studentPageSize
    return filteredStudents.slice(start, start + studentPageSize)
  }, [filteredStudents, studentPage, studentTotalPages])
  const selectedAssignmentClass = useMemo(
    () => classRowsWithStudents.find((item) => item.id === assignmentForm?.classId) || null,
    [assignmentForm?.classId, classRowsWithStudents],
  )
  const assignmentClassOptions = useMemo(
    () => classRowsWithStudents.filter((item) => item.course === assignmentForm?.course),
    [assignmentForm?.course, classRowsWithStudents],
  )
  const conflictMessage = useMemo(() => {
    if (!assignmentForm || !selectedAssignmentClass) return ''

    const selectedTeacher = enrichedTeacherRows.find((item) => item.id === assignmentForm.teacherId)
    if (!selectedTeacher) return ''

    const conflictingClass = classRowsWithStudents.find((item) =>
      item.id !== selectedAssignmentClass.id
      && item.teacher === selectedTeacher.teacher
      && hasSharedTeachingDay(item.schedule, selectedAssignmentClass.schedule)
      && hasTimeOverlap(item.time, selectedAssignmentClass.time),
    )

    return conflictingClass ? `${selectedTeacher.teacher} đã có lớp ${conflictingClass.name} trùng lịch ${conflictingClass.schedule}.` : ''
  }, [assignmentForm, classRowsWithStudents, enrichedTeacherRows, selectedAssignmentClass])
  const availableRooms = useMemo(() => [...new Set(classRowsWithStudents.map((item) => item.roomDetail ? `Phòng ${item.roomDetail}` : item.room))], [classRowsWithStudents])
  const selectedTeacherScheduleClasses = useMemo(
    () => classRowsWithStudents.filter((item) => item.teacher === selectedTeacherSchedule?.teacher),
    [classRowsWithStudents, selectedTeacherSchedule?.teacher],
  )
  const filteredScheduleClasses = useMemo(() => classRowsWithStudents.filter((item) => {
    const matchesCampus = scheduleCampusFilter === allCampusesOption || item.campus === scheduleCampusFilter
    const matchesCourse = scheduleCourseFilter === allCoursesOption || item.course === scheduleCourseFilter
    const matchesTeacher = scheduleTeacherFilter === allTeachersOption || item.teacher === scheduleTeacherFilter
    const matchesRoom = scheduleRoomFilter === 'Tất cả phòng' || item.room === scheduleRoomFilter
    return matchesCampus && matchesCourse && matchesTeacher && matchesRoom
  }), [classRowsWithStudents, scheduleCampusFilter, scheduleCourseFilter, scheduleRoomFilter, scheduleTeacherFilter])
  const selectedStudentAssignmentStudent = useMemo(
    () => enrichedStudentRows.find((item) => item.id === studentAssignmentForm?.studentId) || null,
    [enrichedStudentRows, studentAssignmentForm?.studentId],
  )
  const studentAssignmentClassOptions = useMemo(
    () => classRowsWithStudents.filter((item) => item.course === studentAssignmentForm?.course),
    [classRowsWithStudents, studentAssignmentForm?.course],
  )
  const selectedStudentAssignmentClass = useMemo(
    () => classRowsWithStudents.find((item) => item.id === studentAssignmentForm?.classId) || null,
    [classRowsWithStudents, studentAssignmentForm?.classId],
  )
  const studentAssignmentConflict = useMemo(() => {
    if (!studentAssignmentForm || !selectedStudentAssignmentStudent || !selectedStudentAssignmentClass) return ''
    if (selectedStudentAssignmentClass.course !== studentAssignmentForm.course) return 'Lớp đã chọn không thuộc khóa học của học viên.'

    const seats = parseClassSize(selectedStudentAssignmentClass.students)
    const isSameClass = selectedStudentAssignmentStudent.classId === selectedStudentAssignmentClass.id
    if (!isSameClass && seats.current >= seats.capacity) return `${selectedStudentAssignmentClass.name} đã đủ sĩ số ${selectedStudentAssignmentClass.students}.`

    return ''
  }, [selectedStudentAssignmentClass, selectedStudentAssignmentStudent, studentAssignmentForm])
  const selectedClassStudents = useMemo(
    () => enrichedStudentRows.filter((item) => item.classId === selectedClass?.id),
    [enrichedStudentRows, selectedClass?.id],
  )
  const selectedClassCourseProfile = useMemo(
    () => courseProfiles.find((item) => item.course === classForm?.course) || courseProfiles[0] || null,
    [classForm?.course, courseProfiles],
  )

  const openClassForm = () => {
    const selectedCourse = courseFilter !== allCoursesOption ? courseFilter : courseOptions[0] || ''
    const selectedProfile = courseProfiles.find((item) => item.course === selectedCourse) || courseProfiles[0]

    setClassForm({
      ...defaultClassForm,
      campus: selectedProfile?.campuses[0] || campusOptions[0] || 'Cơ sở Phú Nhuận',
      course: selectedCourse,
      specialty: selectedProfile?.specialty || '',
      studentCapacity: selectedProfile?.capacity || defaultClassForm.studentCapacity,
    })
  }

  const updateClassForm = (field, value) => {
    setClassForm((current) => {
      const next = { ...current, [field]: value }

      if (field === 'course') {
        const nextProfile = courseProfiles.find((item) => item.course === value)
        next.campus = nextProfile?.campuses[0] || ''
        next.specialty = nextProfile?.specialty || value
        next.studentCapacity = nextProfile?.capacity || defaultClassForm.studentCapacity
      }

      return next
    })
  }

  const handleCreateClass = (event) => {
    event.preventDefault()
    const course = classForm.course.trim()
    const name = classForm.name.trim()
    const roomDetail = classForm.roomDetail.trim().replace(/^P\.?\s*/i, '')

    if (!course || !name || !roomDetail || !classForm.weekdays.length) {
      toast.error('Vui lòng chọn khóa học, ngày học, tên lớp và phòng học.')
      return
    }

    const newClass = {
      id: makeClassId(classRows),
      name,
      shortName: name,
      course,
      specialty: classForm.specialty.trim() || course,
      campus: classForm.campus,
      teacher: '',
      schedule: `${formatWeekdaysForSchedule(classForm.weekdays)}, ${classForm.timeStart}`,
      days: formatWeekdaysForView(classForm.weekdays),
      time: `${classForm.timeStart} - ${classForm.timeEnd}`,
      room: `P.${roomDetail}`,
      roomDetail,
      students: `${Number(classForm.studentCount) || 0}/${Number(classForm.studentCapacity) || 0}`,
      status: classForm.status,
      startDate: formatDateForView(classForm.startDate),
      endDate: formatDateForView(classForm.endDate),
    }

    setClassRows((current) => [newClass, ...current])
    setCourseFilter(course)
    setCampusFilter(allCampusesOption)
    setStatusFilter(allStatusesOption)
    setClassScheduleFilter(allSchedulesOption)
    setKeyword('')
    setClassPage(1)
    setClassForm(null)
    toast.success(`Đã thêm lớp ${newClass.name} cho khóa ${newClass.course}.`)
  }

  const openStudentAssignmentModal = (student = null) => {
    const targetStudent = student || enrichedStudentRows.find((item) => item.status === 'Chờ phân lớp') || enrichedStudentRows[0]
    const targetCourse = targetStudent?.targetCourse || courseOptions[0] || ''
    const firstClassInCourse = classRowsWithStudents.find((item) => item.course === targetCourse) || classRowsWithStudents[0]

    setStudentAssignmentForm({
      classId: targetStudent?.classId || firstClassInCourse?.id || '',
      course: targetCourse,
      note: targetStudent?.note || '',
      studentId: targetStudent?.id || '',
    })
  }

  const updateStudentAssignmentForm = (field, value) => {
    setStudentAssignmentForm((current) => {
      const next = { ...current, [field]: value }

      if (field === 'studentId') {
        const nextStudent = enrichedStudentRows.find((item) => item.id === value)
        const nextCourse = nextStudent?.targetCourse || next.course
        const firstClassInCourse = classRowsWithStudents.find((item) => item.course === nextCourse)
        next.course = nextCourse
        next.classId = nextStudent?.classId || firstClassInCourse?.id || ''
        next.note = nextStudent?.note || ''
      }

      if (field === 'course') {
        const firstClassInCourse = classRowsWithStudents.find((item) => item.course === value)
        next.classId = firstClassInCourse?.id || ''
      }

      return next
    })
  }

  const handleStudentAssignmentSubmit = (event) => {
    event.preventDefault()
    if (studentAssignmentConflict || !selectedStudentAssignmentStudent || !selectedStudentAssignmentClass) return

    setStudentRows((current) => current.map((student) =>
      student.id === selectedStudentAssignmentStudent.id
        ? {
            ...student,
            classId: selectedStudentAssignmentClass.id,
            note: studentAssignmentForm.note,
            status: 'Đang học',
            targetCourse: studentAssignmentForm.course,
          }
        : student,
    ))
    setStudentAssignmentForm(null)
    setStudentCourseFilter(studentAssignmentForm.course)
    setStudentClassFilter(allClassesOption)
    setStudentStatusFilter(allStatusesOption)
    setStudentCampusFilter(allCampusesOption)
    setStudentScheduleFilter(allSchedulesOption)
    setStudentPage(1)
    toast.success(`Đã phân ${selectedStudentAssignmentStudent.name} vào lớp ${selectedStudentAssignmentClass.name}.`)
  }

  const openAssignmentModal = (teacher = null) => {
    const firstUnassignedClass = classRowsWithStudents.find((item) => !item.teacher) || classRowsWithStudents[0]
    const targetTeacher = teacher || enrichedTeacherRows.find((item) => item.status === 'Chưa phân lớp') || enrichedTeacherRows[0]
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
        const firstClassInCourse = classRowsWithStudents.find((item) => item.course === value)
        next.classId = firstClassInCourse?.id || ''
        next.room = firstClassInCourse?.roomDetail ? `Phòng ${firstClassInCourse.roomDetail}` : firstClassInCourse?.room || ''
      }

      if (field === 'classId') {
        const nextClass = classRowsWithStudents.find((item) => item.id === value)
        next.room = nextClass?.roomDetail ? `Phòng ${nextClass.roomDetail}` : nextClass?.room || current.room
      }

      return next
    })
  }

  const handleAssignmentSubmit = (event) => {
    event.preventDefault()
    if (conflictMessage || !selectedAssignmentClass) return

    const selectedTeacher = enrichedTeacherRows.find((item) => item.id === assignmentForm.teacherId)
    if (!selectedTeacher) return

    setClassRows((current) => current.map((item) =>
      item.id === selectedAssignmentClass.id
        ? { ...item, room: assignmentForm.room.replace('Phòng ', 'P.'), roomDetail: assignmentForm.room.replace('Phòng ', ''), status: 'Đang học', teacher: selectedTeacher.teacher }
        : item,
    ))
    setTeacherRows((current) => current.map((item) => {
      if (item.id !== selectedTeacher.id) return item

      const classNames = [...new Set([...item.classNames, selectedAssignmentClass.shortName])]
      const teachingDays = [...new Set([...String(item.teachingDays || '').split(',').map((day) => day.trim()).filter(Boolean), selectedAssignmentClass.days])].join(', ')
      const teachingSchedule = [...new Set([...String(item.teachingSchedule || '').split(';').map((schedule) => schedule.trim()).filter(Boolean), getTeachingScheduleLabel(selectedAssignmentClass)])].join('; ')
      return { ...item, classCount: Math.max(item.classCount + 1, classNames.length), classNames, status: 'Đang dạy', teachingDays, teachingSchedule }
    }))
    setAssignmentForm(null)
    toast.success('Đã lưu phân công giáo viên.')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-bold text-orange-600">Khóa học</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Quản lý khóa học và lớp</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Theo dõi danh sách lớp, phân phối giáo viên và lịch học theo từng phòng.</p>
        </div>
        <PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'classes' && (
        <>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-orange-600">Danh sách lớp</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Thêm lớp mới cho từng khóa học.</h2>
            </div>
            <Button type="button" onClick={openClassForm}>
              <Plus size={18} /> Thêm lớp mới
            </Button>
          </div>

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
              <div className="grid gap-4 md:grid-cols-4">
                <FilterSelect label="Khóa học" value={courseFilter} onChange={(value) => { setCourseFilter(value); setClassPage(1) }} options={[allCoursesOption, ...courseOptions]} />
                <FilterSelect label="Cơ sở" value={campusFilter} onChange={(value) => { setCampusFilter(value); setClassPage(1) }} options={[allCampusesOption, ...campusOptions]} />
                <FilterSelect label="Lịch học" value={classScheduleFilter} onChange={(value) => { setClassScheduleFilter(value); setClassPage(1) }} options={[allSchedulesOption, ...classScheduleOptions]} />
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

      {activeTab === 'students' && (
        <>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold text-orange-600">Phân phối học viên</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Xếp học viên vào lớp theo khóa học, lịch học và sĩ số.</h2>
            </div>
            <Button type="button" onClick={() => openStudentAssignmentModal()}>
              <Plus size={18} /> Phân lớp học viên
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {studentStats.map((item) => (
              <Card key={item.label} className="rounded-lg bg-gradient-to-br from-orange-50 to-white">
                <p className="text-sm font-bold text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
              </Card>
            ))}
          </div>

          <Card className="rounded-lg bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-black text-slate-700">Tìm kiếm</span>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="h-11 w-full rounded-lg border border-orange-100 bg-white px-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    placeholder="Tìm học viên, số điện thoại, email hoặc lớp..."
                    value={studentKeyword}
                    onChange={(event) => {
                      setStudentKeyword(event.target.value)
                      setStudentPage(1)
                    }}
                  />
                </div>
              </label>
              <div className="grid gap-4 md:grid-cols-5">
                <FilterSelect label="Khóa học" value={studentCourseFilter} onChange={(value) => { setStudentCourseFilter(value); setStudentClassFilter(allClassesOption); setStudentPage(1) }} options={[allCoursesOption, ...courseOptions]} />
                <FilterSelect label="Lớp học" value={studentClassFilter} onChange={(value) => { setStudentClassFilter(value); setStudentPage(1) }} options={[allClassesOption, ...studentClassOptions]} />
                <FilterSelect label="Trạng thái" value={studentStatusFilter} onChange={(value) => { setStudentStatusFilter(value); setStudentPage(1) }} options={[allStatusesOption, ...studentStatusOptions]} />
                <FilterSelect label="Cơ sở" value={studentCampusFilter} onChange={(value) => { setStudentCampusFilter(value); setStudentPage(1) }} options={[allCampusesOption, ...campusOptions]} />
                <FilterSelect label="Lịch học" value={studentScheduleFilter} onChange={(value) => { setStudentScheduleFilter(value); setStudentPage(1) }} options={[allSchedulesOption, ...classScheduleOptions]} />
              </div>
            </div>
          </Card>

          <StudentAssignmentTable
            onAssign={openStudentAssignmentModal}
            students={pagedStudents}
          />
          <PaginationControls
            currentPage={Math.min(studentPage, studentTotalPages)}
            label="học viên"
            pageSize={studentPageSize}
            totalItems={filteredStudents.length}
            totalPages={studentTotalPages}
            onPageChange={setStudentPage}
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
      {selectedClass && <ClassDetailModal classItem={selectedClass} onClose={() => setSelectedClass(null)} students={selectedClassStudents} />}
      {classForm && (
        <CreateClassModal
          campusOptions={selectedClassCourseProfile?.campuses.length ? selectedClassCourseProfile.campuses : campusOptions}
          courseOptions={courseOptions}
          form={classForm}
          onChange={updateClassForm}
          onClose={() => setClassForm(null)}
          onSubmit={handleCreateClass}
          statusOptions={statusOptions}
        />
      )}
      {selectedClassSchedule && (
        <ClassScheduleDetailModal
          schedule={selectedClassSchedule}
          onClose={() => setSelectedClassSchedule(null)}
          onEditSchedule={(schedule) => toast.info(`Chỉnh sửa lịch ${schedule.name} sẽ được bổ sung ở bước tiếp theo.`)}
          onViewClass={(schedule) => {
            setSelectedClassSchedule(null)
            setSelectedClass(classRowsWithStudents.find((item) => item.id === schedule.id))
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
          teachers={enrichedTeacherRows}
        />
      )}
      {studentAssignmentForm && (
        <StudentAssignmentModal
          availableClasses={studentAssignmentClassOptions}
          conflictMessage={studentAssignmentConflict}
          courseOptions={courseOptions}
          form={studentAssignmentForm}
          onChange={updateStudentAssignmentForm}
          onClose={() => setStudentAssignmentForm(null)}
          onSubmit={handleStudentAssignmentSubmit}
          selectedClass={selectedStudentAssignmentClass}
          selectedStudent={selectedStudentAssignmentStudent}
          students={enrichedStudentRows}
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
