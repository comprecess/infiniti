import { FC, useEffect, useState } from 'react'

import { GroupsListProps } from '../../../../app/constants/constants'
import { NewGroup } from '../../../../features/Admin/CustomersPage/GroupsPage/NewGroup/NewGroup'
import { RecentButtons } from '../../../../features/Admin/CustomersPage/GroupsPage/RecentButtons/RecentButtons'
import { RecentGroups } from '../../../../features/Admin/CustomersPage/GroupsPage/RecentGroups/RecentGroups'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { addGroup } from '../../../../shared/utils/api/Groups/AddGroup'
import { deleteGroup } from '../../../../shared/utils/api/Groups/DeleteGroup'
import { getListGroups } from '../../../../shared/utils/api/Groups/GetGroups'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './GroupsPage.module.scss'

export const AdminGroupsPage: FC = () => {
  const [groups, setGroups] = useState<GroupsListProps[]>([])
  const [newGroup, setNewGroup] = useState<boolean>(false)

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    null,
  )
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false)

  const [name, setName] = useState<string>('')

  const showToast = useCustomToast()

  const getGroups = async () => {
    const groupsResponse: GroupsListProps[] = await getListGroups()

    setGroups(groupsResponse)
  }

  const openNewGroupModal = () => {
    setNewGroup(!newGroup)
  }

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen)
  }

  const confirmDeleteGroup = (id: number) => {
    setSelectedGroupId(id)
    setIsConfirmationModalOpen(true)
  }

  const createGroup = async () => {
    const addGroupResponse = await addGroup(name)

    if (addGroupResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new group',
        status: 'success',
      })
      getGroups()
    } else {
      showToast({
        title: 'Error',
        description: 'Error creating group',
        status: 'error',
      })
    }

    openNewGroupModal()
  }

  const deleteSelectedGroup = async () => {
    if (selectedGroupId === null) return

    const deleteResponse = await deleteGroup(selectedGroupId)

    if (deleteResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the group',
        status: 'success',
      })
      getGroups()
    } else {
      showToast({
        title: 'Error',
        description: 'Error when deleting group',
        status: 'error',
      })
    }

    openConfirmationModal()
  }

  const handleInputChange = (name: string, value: string) => {
    if (name === 'groupName') {
      setName(value)
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Groups'
  }, [])

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {groups.length > 0 ? (
          <RecentCard
            title='Groups'
            style={styles.recentFullScreen}
            Component={RecentButtons}
            componentProps={{ firstButtonClick: openNewGroupModal }}
          >
            <RecentGroups
              groupsList={groups}
              deleteGroup={confirmDeleteGroup}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
      <NewGroup
        modalNewGroup={newGroup}
        handleOpenCloseModal={openNewGroupModal}
        handleInputChange={handleInputChange}
        createNewGroup={createGroup}
      />
      <ConfirmationModal
        isOpened={isConfirmationModalOpen}
        handleOpenCloseModal={openConfirmationModal}
        agree={deleteSelectedGroup}
      />
    </div>
  )
}
