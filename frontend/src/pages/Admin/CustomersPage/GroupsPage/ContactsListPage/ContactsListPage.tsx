import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { GroupContactsListProps } from '../../../../../app/constants/constants'
import { RecentContactsList } from '../../../../../features/Admin/CustomersPage/GroupsPage/RecentContactsList/RecentConatctsList'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getContactsList } from '../../../../../shared/utils/api/Groups/GetContactsList'
import styles from './ContactsListPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/(\d+)$/
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

export const AdminContactsListPage: FC = () => {
  const [contacts, setContacts] = useState<
  GroupContactsListProps[] | null
  >(null)

  const id = useIdFromUrl()

  const getContacts = async () => {
    if (id !== null) {
      const contactsResponse = await getContactsList(id)

      setContacts(contactsResponse)
    }
  }

  useEffect(() => {
    getContacts()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {contacts ? (
          <div className={styles.container}>
            <div className={styles.items}>
              <ButtonBlue
                title='Send Email'
                icon='/icons/send.svg'
                style={styles.blueButton}
              />
            </div>
            <div className={styles.content}>
              <RecentContactsList list={contacts} />
            </div>
          </div>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
