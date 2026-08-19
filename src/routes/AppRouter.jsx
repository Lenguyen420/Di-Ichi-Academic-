import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout.jsx'
import { LoginPage } from '../pages/Login/LoginPage.jsx'
import { DashboardPage } from '../pages/Dashboard/DashboardPage.jsx'
import { ClassManagementPage } from '../pages/ClassManagement/ClassManagementPage.jsx'
import { ClassroomEquipmentPage } from '../pages/ClassroomEquipment/ClassroomEquipmentPage.jsx'
import { ReportsPage } from '../pages/Reports/ReportsPage.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/lop-hoc', element: <ClassManagementPage /> },
      { path: '/thiet-bi-lop-hoc', element: <ClassroomEquipmentPage /> },
      { path: '/bao-cao', element: <ReportsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
