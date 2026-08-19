export const AUTH_SESSION_KEY = 'diIchiEmployeeSession'

export const getAuthSession = () => {
  const rawSession = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY)
  if (!rawSession) return null

  try {
    return JSON.parse(rawSession)
  } catch {
    return null
  }
}

export const saveAuthSession = (session, rememberLogin) => {
  const targetStorage = rememberLogin ? localStorage : sessionStorage
  const otherStorage = rememberLogin ? sessionStorage : localStorage

  otherStorage.removeItem(AUTH_SESSION_KEY)
  otherStorage.removeItem('accessToken')
  targetStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
  targetStorage.setItem('accessToken', session.accessToken)
}

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_SESSION_KEY)
  sessionStorage.removeItem(AUTH_SESSION_KEY)
  localStorage.removeItem('accessToken')
  sessionStorage.removeItem('accessToken')
}

export const getAccessToken = () => {
  const legacyToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
  if (legacyToken) return legacyToken

  const session = getAuthSession()
  return session?.accessToken || session?.access_token || session?.token || ''
}

export const getCurrentUser = () => {
  const session = getAuthSession()
  if (!session?.accessToken) return null

  return {
    userId: session.userId || '',
    userType: session.userType || '',
    deviceId: session.deviceId || '',
    branchId: session.branchId || '',
    fullName: session.fullName || '',
  }
}

export const getBranchId = () => getCurrentUser()?.branchId || ''
export const getUserId = () => getCurrentUser()?.userId || ''
export const getDeviceId = () => getCurrentUser()?.deviceId || ''
