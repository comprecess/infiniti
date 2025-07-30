import { useEffect, useState } from 'react'

import { GroupContactsListProps } from '../../../../../app/constants/constants'
import { RecentContactsList } from '../../../../../features/Admin/CustomersPage/GroupsPage/RecentContactsList/RecentConatctsList'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteGroupContact } from '../../../../../shared/utils/api/Admin/Groups/delete-group-contact'
import { getContactsList } from '../../../../../shared/utils/api/Admin/Groups/get-contacts-list'
import { useIdFromUrl } from '../../../../../shared/utils/usefulMethods'
import styles from './ContactsListPage.module.scss'

export const AdminContactsListPage = () => {
  const [contacts, setContacts] = useState<
  GroupContactsListProps[] | null
  >(null)

  const id = useIdFromUrl('list')
  const showToast = useCustomToast()

  const getContacts = async () => {
    if (id !== null) {
      const response = await getContactsList(id)

      if (!response.status) return

      setContacts(response.data)
    }
  }

  const deleteContact = async (idCustomer: number) => {
    if (id === null) return

    const response = await deleteGroupContact(id, idCustomer)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully removed a contact from the group',
        status: 'success',
      })
      getContacts()
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
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
              <RecentContactsList
                list={contacts}
                deleteContact={deleteContact}
              />
            </div>
          </div>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
