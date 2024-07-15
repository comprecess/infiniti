import { FC, useEffect, useState } from 'react'

import { GroupsListProps } from '../../../../../app/constants/constants'
import { RecentReorderGroups } from '../../../../../features/Admin/CustomersPage/GroupsPage/RecentReorderGroups/RecentReorderGroups'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getListGroups } from '../../../../../shared/utils/api/Groups/GetGroups'
import { sortGroups } from '../../../../../shared/utils/api/Groups/SortGroups'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './ReorderGroupsPage.module.scss'

export const AdminReorderGroupsPage: FC = () => {
  const [groups, setGroups] = useState<GroupsListProps[]>([])

  const showToast = useCustomToast()

  const getGroups = async () => {
    const groupsResponse: GroupsListProps[] = await getListGroups()

    setGroups(groupsResponse)
  }

  const sortGroupsList = async (listId: number[]) => {
    const sortResponse = await sortGroups(listId)

    if (sortResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the group order',
        status: 'success',
      })

      getGroups()
    } else {
      showToast({
        title: 'Error',
        description: 'Error when changing group order',
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
