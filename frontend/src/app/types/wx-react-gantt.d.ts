declare module 'wx-react-gantt' {
  import { ComponentType, ReactNode } from 'react'

  export interface GanttProps {
    tasks: any[]
    links?: any[]
    [key: string]: any
  }

  export const Gantt: ComponentType<GanttProps>

  export interface ThemeProps {
    children?: ReactNode
  }

  export const Willow: ComponentType<ThemeProps>
  export const WillowDark: ComponentType<ThemeProps>
}
