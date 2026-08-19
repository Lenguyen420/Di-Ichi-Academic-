import { academicAffairsAccount, currentEmployee } from '../datas/appStaticData.js'

export const loginStaff = async ({ email, password }) => {
  const isValidLogin = email === academicAffairsAccount.email && password === academicAffairsAccount.password
  if (!isValidLogin) {
    const error = new Error('INVALID_CREDENTIALS')
    error.response = { status: 401 }
    throw error
  }

  return {
    accessToken: 'mock-academic-affairs-token',
    userId: 'GV-1001',
    userType: 'Giáo vụ',
    deviceId: 'WEB-MOCK',
    branchId: 'BRANCH-PN',
    fullName: currentEmployee.name,
  }
}
