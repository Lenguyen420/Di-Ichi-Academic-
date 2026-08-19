import {
  ChartColumn,
  GraduationCap,
  LayoutDashboard,
  Projector,
} from 'lucide-react'
import { menuItemData } from '../../datas/appStaticData.js'

const menuIcons = {
  ChartColumn,
  GraduationCap,
  LayoutDashboard,
  Projector,
}

export const menuItems = menuItemData.map((item) => ({
  ...item,
  icon: menuIcons[item.icon],
}))
