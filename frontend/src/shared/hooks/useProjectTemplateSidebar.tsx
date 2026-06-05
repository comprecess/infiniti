import { useEffect, useState } from 'react'
import { BookOpenIcon } from '../icons/BookOpenIcon'
import { ChartIcon } from '../icons/ChartIcon'
import { ExpensesIcon } from '../icons/ExpensesIcon'
import { DashboardIcon } from '../icons/sidebarList/DashboardIcon'
import { FileIcon } from '../icons/sidebarList/FileIcon'
import { InvoicesIcon } from '../icons/sidebarList/InvoicesIcon'
import { LeadsIcon } from '../icons/sidebarList/LeadsIcon'
import { LogIcon } from '../icons/sidebarList/LogIcon'
import { TalentsIcon } from '../icons/sidebarList/TalentsIcon'
import { TasksIcon } from '../icons/sidebarList/TasksIcon'
import { AccountingIcon } from '../icons/sidebarList/AccountingIcon'
import {
  getTemplateSections,
  TemplateSection,
} from '../utils/api/Admin/ProjectTemplates/get-template-sections'

export interface SidebarPage {
  id: number
  name: string
  page: string
  type: string
  icon: React.ReactNode
}

/**
 * Map of section codes to their corresponding icons.
 * Falls back to DashboardIcon if the code is not found.
 */
const iconMap: Record<string, React.ReactNode> = {
  summary: <DashboardIcon />,
  tasks: <TasksIcon />,
  files: <FileIcon />,
  deal_room: <FileIcon />,
  expenses: <ExpensesIcon />,
  invoices: <InvoicesIcon />,
  'gantt-chart': <ChartIcon />,
  gantt_chart: <ChartIcon />,
  analytics: <BookOpenIcon />,
  logs: <LogIcon />,
  growth_plan: <ChartIcon />,
  valuation: <AccountingIcon />,
  pipeline_buyers: <LeadsIcon />,
  pipeline_investors: <TalentsIcon />,
}

/**
 * Map section code to the URL page path.
 * Some codes use underscores in DB but hyphens in URLs.
 */
const codeToPage = (code: string): string => {
  return code.replace(/_/g, '-')
}

/**
 * Convert API template sections to sidebar page items.
 */
const sectionsToPages = (sections: TemplateSection[]): SidebarPage[] => {
  return sections.map((section, index) => ({
    id: index,
    name: section.name,
    page: codeToPage(section.code),
    type: codeToPage(section.code),
    icon: iconMap[section.code] || <DashboardIcon />,
  }))
}

/**
 * Hook that fetches template sections and returns sidebar pages.
 * Falls back to the legacy sidebar if no template_code is provided.
 */
export const useProjectTemplateSidebar = (
  templateCode: string | null | undefined,
  legacyPages: SidebarPage[],
): { pages: SidebarPage[]; loading: boolean } => {
  const [pages, setPages] = useState<SidebarPage[]>(legacyPages)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // If no template code, use legacy sidebar
    if (!templateCode) {
      setPages(legacyPages)
      return
    }

    const fetchSections = async () => {
      setLoading(true)
      const response = await getTemplateSections(templateCode)

      if (response.status && response.data.length > 0) {
        setPages(sectionsToPages(response.data))
      } else {
        // Fallback to legacy if API fails
        setPages(legacyPages)
      }
      setLoading(false)
    }

    fetchSections()
  }, [templateCode])

  return { pages, loading }
}
