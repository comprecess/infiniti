import { useEffect, useState } from 'react'

import { GroupContactsListProps } from '../../../../../app/constants/constants'
import { RecentContactsList } from '../../../../../features/Admin/CustomersPage/GroupsPage/RecentContactsList/RecentConatctsList'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getContactsList } from '../../../../../shared/utils/api/Admin/Groups/GetContactsList'
import { useIdFromUrl } from '../../../../../shared/utils/usefulMethods'
import styles from './ContactsListPage.module.scss'

export const AdminContactsListPage = () => {
  const [contacts, setContacts] = useState<
  GroupContactsListProps[] | null
  >(null)

  const id = useIdFromUrl('list')

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
