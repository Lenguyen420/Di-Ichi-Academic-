import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import logo from '../../assets/logo/LOGO_Diichi.webp'
import { academicAffairsAccount } from '../../datas/appStaticData.js'
import { loginStaff } from '../../services/authApi.js'
import { saveAuthSession } from '../../services/authSession.js'
import { Button } from '../Common/Button.jsx'

const normalizeEmail = (value) => value.trim().toLowerCase()

export const LoginCard = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(academicAffairsAccount.email)
  const [password, setPassword] = useState(academicAffairsAccount.password)
  const [rememberLogin, setRememberLogin] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const normalizedEmail = normalizeEmail(email)
    const normalizedPassword = password.trim()

    if (!normalizedEmail || !normalizedPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin đăng nhập.')
      return
    }

    setIsSubmitting(true)
    try {
      const session = await loginStaff({ email: normalizedEmail, password: normalizedPassword })
      if (!session?.accessToken) throw new Error('INVALID_LOGIN_RESPONSE')

      saveAuthSession({
        accessToken: session.accessToken,
        userId: session.userId,
        userType: session.userType,
        deviceId: session.deviceId,
        branchId: session.branchId,
        fullName: session.fullName,
      }, rememberLogin)
      toast.success('Đăng nhập thành công', {
        description: 'Chào mừng bạn quay lại cổng giáo vụ Di-Ichi.',
      })
      navigate('/dashboard')
    } catch (error) {
      const backendMessage = error.response?.data?.error?.message || error.response?.data?.message
      const description = error.response?.status === 401
        ? 'Email hoặc mật khẩu không đúng.'
        : backendMessage || (error.message === 'INVALID_LOGIN_RESPONSE'
          ? 'Phản hồi đăng nhập không có access token.'
          : error.response ? 'Không thể đăng nhập. Vui lòng thử lại.' : 'Không thể kết nối máy chủ.')
      toast.error('Đăng nhập thất bại', { description })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-orange-950/20 backdrop-blur md:p-8">
      <div className="text-center">
        <img className="mx-auto h-28 w-28 object-contain md:h-32 md:w-32" src={logo} alt="Di-Ichi" />
        <h1 className="mt-5 text-2xl font-black text-slate-950">Đăng nhập giáo vụ</h1>
        <p className="mt-2 text-sm text-slate-500">Truy cập cổng giáo vụ Di-Ichi để quản lý lịch hẹn, lớp học, kiểm tra đầu vào và hồ sơ học viên.</p>
      </div>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Email</span>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
            <Mail size={18} className="text-orange-500" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={academicAffairsAccount.email}
              type="email"
              value={email}
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">Mật khẩu</span>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
            <LockKeyhole size={18} className="text-orange-500" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              onChange={(event) => setPassword(event.target.value)}
              placeholder={academicAffairsAccount.password}
              type={showPassword ? 'text' : 'password'}
              value={password}
            />
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 font-semibold text-slate-600">
            <input
              className="h-4 w-4 rounded border-orange-200 accent-orange-600"
              checked={rememberLogin}
              onChange={(event) => setRememberLogin(event.target.checked)}
              type="checkbox"
            />
            Ghi nhớ đăng nhập
          </label>
          <button className="font-bold text-orange-600" type="button">Quên mật khẩu?</button>
        </div>

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </section>
  )
}
