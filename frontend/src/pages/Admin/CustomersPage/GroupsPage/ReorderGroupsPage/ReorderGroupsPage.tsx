import { useEffect, useState } from 'react'

import { GroupsListProps } from '../../../../../app/constants/constants'
import { RecentReorderGroups } from '../../../../../features/Admin/CustomersPage/GroupsPage/RecentReorderGroups/RecentReorderGroups'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getGroupsList } from '../../../../../shared/utils/api/Admin/Groups/get-groups-list'
import { putSortGroups } from '../../../../../shared/utils/api/Admin/Groups/put-sort-groups'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './ReorderGroupsPage.module.scss'

export const AdminReorderGroupsPage = () => {
  const [groups, setGroups] = useState<GroupsListProps[]>([])

  const showToast = useCustomToast()

  const getGroups = async () => {
    const response = await getGroupsList()

    if (!response.status) return

    setGroups(response.data.data)
  }

  const sortGroupsList = async (listId: number[]) => {
    const { status, message } = await putSortGroups(listId)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the group order',
        status: 'success',
      })

      getGroups()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {groups.length > 0 ? (
          <RecentCard
            title='Reorder Groups Positions'
            style={styles.recentFullScreen}
          >
            <RecentReorderGroups
              groupsList={groups}
              ReRequestGetGroups={sortGroupsList}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
