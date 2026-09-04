import { api } from './api.js'

export const loginStaff = ({ email, password }) => api.post('/auth/staff/login', { email, password })
