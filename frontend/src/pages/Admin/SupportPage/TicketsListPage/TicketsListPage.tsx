import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './TicketsListPage.module.scss'
import { Routes } from '../../../../app/router/routes'
import { Filters } from '../../../../features/Admin/SupportPage/TicketsPage/Filters/Filters'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { Search } from '../../../../shared/ui/Search/Search'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminTicketsListPage = () => {
  const navigate = useNavigate()

  const navigateToCreateTicket = () => {
    navigate(`/${Routes.adminPages}/${Routes.support}/${Routes.new}/${Routes.ticket}`)
  }

  useEffect(() => {
    document.title = 'infiniti | Tickets'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.titleContainer}>
          <TitlePage title='Tickets' />
          <ButtonBlue
            titleNone
            title='New Ticket'
            icon='/icons/plus.svg'
            style={styles.buttonCreate}
            onClick={navigateToCreateTicket}
          />
        </div>
      </div>
      <section className={styles.sectionFirst}>
        <section className={styles.section}>
          <RecentCard title='Filter Tickets' style={styles.cardFirst}>
            <Filters />
          </RecentCard>
          <RecentCard
            style={styles.cardSecond}
            title='View Tickets'
            HeaderComponent={Search}
            headerProps={{ style: styles.search }}
          >
            Table
          </RecentCard>
        </section>
      </section>
    </div>
  )
}
