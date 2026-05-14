import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './TicketsListPage.module.scss'
import { Routes } from '../../../../app/router/routes'
import { Filters } from '../../../../features/Admin/SupportPage/TicketsPage/Filters/Filters'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Status } from '../../../../shared/ui/Status/Status'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import { getAdminTicketsInputData } from '../../../../shared/utils/api/Admin/Tickets/get-tickets-input-data'
import { getAdminTicketsList } from '../../../../shared/utils/api/Admin/Tickets/get-tickets-list'

export const AdminTicketsListPage = () => {
  const navigate = useNavigate()
  const [tickets, setTickets]     = useState<any[]>([])
  const [inputData, setInputData] = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [filters, setFilters]     = useState<any>({})

  const navigateToCreateTicket = () => {
    navigate(`/${Routes.adminPages}/${Routes.support}/${Routes.new}/${Routes.ticket}`)
  }

  const loadData = async (f: any = {}) => {
    setLoading(true)
    const [inputRes, listRes] = await Promise.all([
      inputData ? Promise.resolve({ status: true, data: inputData }) : getAdminTicketsInputData(),
      getAdminTicketsList(f),
    ])
    if (inputRes.status && !inputData) setInputData(inputRes.data?.data ?? inputRes.data)
    if (listRes.status) setTickets(listRes.data?.data?.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    document.title = 'infiniti | Tickets'
    loadData()
  }, [])

  const handleApplyFilters = (f: any) => {
    setFilters(f)
    loadData(f)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.titleContainer}>
          <TitlePage title='Tickets' />
          <ButtonBlue
            titleNone
            title='New Ticket'
            icon='/icons/plus.svg'
            onClick={navigateToCreateTicket}
          />
        </div>
      </div>
      <section className={styles.sectionFirst}>
        <section className={styles.section}>
          <RecentCard title='Filter Tickets' style={styles.cardFirst}>
            <Filters inputData={inputData ?? {}} onApply={handleApplyFilters} />
          </RecentCard>
          <RecentCard style={styles.cardSecond} title='View Tickets'>
            {loading ? (
              <div className={styles.loading}><LoadingSpinner size='xl' /></div>
            ) : tickets.length === 0 ? (
              <div className={styles.nothingFound}>
                <span className={styles.nothingFoundText}>Nothing Found</span>
              </div>
            ) : (
              <div className={styles.ticketsTable}>
                <div className={styles.tableHeader}>
                  <span>Code</span>
                  <span>Subject</span>
                  <span>Customer</span>
                  <span>Department</span>
                  <span>Priority</span>
                  <span>Status</span>
                  <span>Updated</span>
                </div>
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className={styles.tableRow}
                    onClick={() =>
                      navigate(`/${Routes.adminPages}/${Routes.support}/${Routes.tickets}/${Routes.view}/${Routes.ticket}/${ticket.id}`)
                    }
                  >
                    <span className={styles.code}>#{ticket.id}</span>
                    <span className={styles.subject}>{ticket.subject}</span>
                    <span>{ticket.client?.name ?? '—'}</span>
                    <span>{ticket.department?.name ?? '—'}</span>
                    <span>{ticket.priority}</span>
                    <Status title={ticket.status} status={ticket.status} />
                    <span className={styles.date}>{ticket.last_reply ? new Date(ticket.last_reply.replace(' ', 'T')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : new Date(ticket.created_at.replace(' ', 'T')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            )}
          </RecentCard>
        </section>
      </section>
    </div>
  )
}
