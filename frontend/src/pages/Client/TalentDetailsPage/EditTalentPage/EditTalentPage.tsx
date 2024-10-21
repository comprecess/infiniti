import { FC, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { Fields } from '../../../../features/Client/TalentDetailsPage/TalentEditPage/Fields/Fields'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditTalentPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/talent\/(\d+)/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  const id = useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )

  return id
}

export const ClientEditTalentPage: FC = () => {
  const id = useIdFromUrl()

  console.log(id)

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard title='Edit Talent' style={styles.recentFullScreen}>
          <Fields />
        </RecentCard>
      </section>
    </div>
  )
}
