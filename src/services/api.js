import { clearAuthSession, getAccessToken } from './authSession.js'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(payload?.message || payload?.error?.message || 'API_REQUEST_FAILED')
    error.response = { data: payload, status: response.status }
    throw error
  }

  return payload?.data ?? payload
}

export const apiRequest = async (path, options = {}) => {
  const headers = new Headers(options.headers)
  const token = getAccessToken()

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, { ...options, headers })
  } catch (cause) {
    const error = new Error('NETWORK_ERROR', { cause })
    error.response = null
    throw error
  }

  if (response.status === 401 && path !== '/auth/staff/login') {
    clearAuthSession()
    if (window.location.pathname !== '/login') window.location.assign('/login')
  }

  return parseResponse(response)
}

export const api = {
  delete: (path) => apiRequest(path, { method: 'DELETE' }),
  get: (path) => apiRequest(path),
  patch: (path, data) => apiRequest(path, { method: 'PATCH', body: JSON.stringify(data) }),
  post: (path, data) => apiRequest(path, { method: 'POST', body: JSON.stringify(data) }),
}
