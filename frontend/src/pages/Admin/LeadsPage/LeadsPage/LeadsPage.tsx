import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'

import styles from './LeadsPage.module.scss'
import { RecentLeads } from '../../../../features/Admin/LeadsPage/RecentLeads/RecentLeads'
import { ModalWindowLead, LeadFormData } from '../../../../features/Admin/LeadsPage/ModalWindowLead/ModalWindowLead'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { Search } from '../../../../shared/ui/Search/Search'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { PagesList } from '../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { getLeadsList } from '../../../../shared/utils/api/Admin/Leads/get-leads-list'
import { postCreateLead } from '../../../../shared/utils/api/Admin/Leads/post-create-lead'
import { putUpdateLead } from '../../../../shared/utils/api/Admin/Leads/put-update-lead'
import { deleteLead } from '../../../../shared/utils/api/Admin/Leads/delete-lead'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import { usePullToRefresh } from '../../../../shared/hooks/usePullToRefresh'

export interface LeadItem {
  id: string | number
  name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  status: string
  source: string
  title: string
  website: string
  created_at: string
}

const EMPTY_FORM: LeadFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  status: 'New',
  source: '',
  website: '',
}

const PER_PAGE = 10

export const AdminLeadsPage = () => {
  const [search, setSearch] = useState('')
  const [sortName, setSortName] = useState<keyof LeadItem>('created_at')
  const [sortType, setSortType] = useState<0 | 1>(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState<LeadFormData>(EMPTY_FORM)

  const queryClient = useQueryClient()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024

  const { pullY, refreshing } = usePullToRefresh({
    enabled: isMobile,
    threshold: 70,
    onRefresh: async () => {
      await queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
  const showToast = useCustomToast()

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await getLeadsList()
      if (!response.status) return []
      const apiData = response.data
      if (Array.isArray(apiData?.data?.data)) return apiData.data.data as LeadItem[]
      if (Array.isArray(apiData?.data)) return apiData.data as LeadItem[]
      if (Array.isArray(apiData)) return apiData as LeadItem[]
      return []
    },
    placeholderData: previousData => previousData,
  })

  // Фильтрация + сортировка по всем данным
  const filteredAndSorted = useMemo(() => {
    if (!leadsData) return []
    let result = [...leadsData]

    if (search.trim()) {
      const s = search.toLowerCase()
      result = result.filter(
        lead =>
          (lead.name || `${lead.first_name} ${lead.last_name}`).toLowerCase().includes(s) ||
          (lead.company || '').toLowerCase().includes(s) ||
          (lead.email || '').toLowerCase().includes(s) ||
          (lead.phone || '').toLowerCase().includes(s),
      )
    }

    result.sort((a, b) => {
      const aVal = String(a[sortName] || '')
      const bVal = String(b[sortName] || '')
      return sortType === 1 ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
    })

    return result
  }, [leadsData, search, sortName, sortType])

  // Пагинация
  const totalItems = filteredAndSorted.length
  const lastPage = Math.max(1, Math.ceil(totalItems / PER_PAGE))

  // Сбрасываем на первую страницу при поиске/сортировке
  useEffect(() => {
    setCurrentPage(1)
  }, [search, sortName, sortType])

  const pagedLeads = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE
    return filteredAndSorted.slice(start, start + PER_PAGE)
  }, [filteredAndSorted, currentPage])

  const meta = useMemo(() => ({
    current_page: currentPage,
    last_page: lastPage,
    per_page: PER_PAGE,
    total: totalItems,
    from: totalItems === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1,
    to: Math.min(currentPage * PER_PAGE, totalItems),
    links: [],
    path: '',
  }), [currentPage, lastPage, totalItems])

  const handleSearchChange = (value: string) => setSearch(value)

  const handleSort = useCallback((_index: number, name: string, type: number) => {
    setSortName(name as keyof LeadItem)
    setSortType(type as 0 | 1)
  }, [])

  const handleFormChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: String(value) }))
  }

  const handleOpenCreate = () => {
    setEditId(null)
    setFormData(EMPTY_FORM)
    setModalOpen(true)
  }

  const handleOpenEdit = (lead: LeadItem) => {
    setEditId(String(lead.id))
    setFormData({
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      title: lead.title || '',
      status: lead.status || 'New',
      source: lead.source || '',
      website: lead.website || '',
    })
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditId(null)
  }

  const handleSave = async () => {
    if (!formData.first_name.trim()) {
      showToast({ title: 'Error', description: 'First name is required', status: 'error' })
      return
    }

    const response = editId
      ? await putUpdateLead(editId!, formData as unknown as Record<string, string>)
      : await postCreateLead(formData as unknown as Record<string, string>)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: editId ? 'Lead updated successfully' : 'Lead created successfully',
        status: 'success',
      })

      if (editId) {
        // Optimistic update: patch the cached list immediately, no refetch needed
        queryClient.setQueryData(['leads'], (old: LeadItem[] | undefined) => {
          if (!old) return old
          return old.map(lead =>
            String(lead.id) === editId
              ? {
                  ...lead,
                  first_name: formData.first_name,
                  last_name: formData.last_name,
                  name: `${formData.first_name} ${formData.last_name}`.trim(),
                  email: formData.email,
                  phone: formData.phone,
                  company: formData.company,
                  title: formData.title,
                  status: formData.status,
                  source: formData.source,
                  website: formData.website,
                }
              : lead
          )
        })
      } else {
        // New lead — refetch to get it with HubSpot id
        queryClient.invalidateQueries({ queryKey: ['leads'] })
      }

      handleCloseModal()
    } else {
      showToast({ title: 'Error', description: response.message, status: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    const response = await deleteLead(id)
    if (response.status) {
      showToast({ title: 'Successfully', description: 'Lead deleted', status: 'success' })
      // Remove from cache immediately
      queryClient.setQueryData(['leads'], (old: LeadItem[] | undefined) => {
        if (!old) return old
        return old.filter(lead => String(lead.id) !== id)
      })
    } else {
      showToast({ title: 'Error', description: response.message, status: 'error' })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Leads'
  }, [])

  return (
    <div className={styles.wrapper}>
      {/* Pull-to-refresh indicator (mobile only) */}
      {(pullY > 0 || refreshing) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: refreshing ? 48 : Math.min(pullY, 48),
          background: 'rgba(27,30,41,0.95)',
          transition: refreshing ? 'none' : 'height 0.1s',
          overflow: 'hidden',
        }}>
          {refreshing ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5965e7" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
              </path>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={pullY >= 70 ? '#5965e7' : '#9ea0b7'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: `rotate(${Math.min(pullY / 70, 1) * 180}deg)`, transition: 'transform 0.1s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          )}
        </div>
      )}
      <section className={styles.section}>
        <RecentCard
          title='Leads'
          style={styles.recentFullScreen}
          HeaderComponent={Search}
          headerProps={{
            style: styles.search,
            searchValue: search,
            onSearchChange: handleSearchChange,
          }}
          Component={ButtonBlue}
          componentProps={{
            title: 'New Lead',
            titleNone: true,
            icon: '/icons/plus.svg',
            iconProps: styles.icon,
            onClick: handleOpenCreate,
          }}
          PagesComponent={totalItems > 0 ? PagesList : undefined}
          pagesProps={
            totalItems > 0
              ? {
                  meta,
                  nextPage: (page: number) => setCurrentPage(page),
                  size: 'sm',
                }
              : undefined
          }
        >
          {isLoading ? (
            <LoadingSpinner size='xl' />
          ) : (
            <RecentLeads
              leadsList={pagedLeads}
              onSort={handleSort}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          )}
        </RecentCard>
      </section>

      <ModalWindowLead
        isOpen={modalOpen}
        title={editId ? 'Edit Lead' : 'New Lead'}
        onClose={handleCloseModal}
        onSave={handleSave}
        formData={formData}
        onChange={handleFormChange}
      />
    </div>
  )
}
