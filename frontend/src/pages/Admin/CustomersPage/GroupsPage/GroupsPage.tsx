import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './GroupsPage.module.scss'
import {
  GroupsListProps,
  RolesAccess,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { EditGroup } from '../../../../features/Admin/CustomersPage/GroupsPage/EditGroup/EditGroup'
import { NewGroup } from '../../../../features/Admin/CustomersPage/GroupsPage/NewGroup/NewGroup'
import { RecentButtons } from '../../../../features/Admin/CustomersPage/GroupsPage/RecentButtons/RecentButtons'
import { RecentGroups } from '../../../../features/Admin/CustomersPage/GroupsPage/RecentGroups/RecentGroups'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteGroup } from '../../../../shared/utils/api/Admin/Groups/delete-group'
import { getGroupsList } from '../../../../shared/utils/api/Admin/Groups/get-groups-list'
import { postCreateNewGroup } from '../../../../shared/utils/api/Admin/Groups/post-create-new-group'
import { putUpdateGroup } from '../../../../shared/utils/api/Admin/Groups/put-update-group'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminGroupsPage = () => {
  const [newGroup, setNewGroup] = useState<boolean>(false)
  const [modalEditGroups, setModalEditGroups] = useState<boolean>(false)

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    null,
  )

  const [name, setName] = useState<string>('')

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const { data: groupsData } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await getGroupsList()

      if (!response.status) return

      return response.data as {
        access: RolesAccess
        data: GroupsListProps[]
      }
    },
    placeholderData: previousData => previousData,
  })

  const openNewGroupModal = () => {
    setNewGroup(!newGroup)
  }

  const openEditGroupModal = () => {
    setModalEditGroups(!modalEditGroups)
  }

  const handleNavigateToOrder = () => {
    navigate(Routes.reorder)
  }

  const setIdEditGroup = (id: number, name: string) => {
    setSelectedGroupId(id)
    setName(name)
    openEditGroupModal()
  }

  const createGroup = async () => {
    const { status, message } = await postCreateNewGroup(name)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new group',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }

    openNewGroupModal()
  }

  const deleteSelectedGroup = async (id: number) => {
    const { status, message } = await deleteGroup(id)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the group',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const editSelectedGroup = async () => {
    if (selectedGroupId === null) return

    const { status, message } = await putUpdateGroup(selectedGroupId, name)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the group name',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }

    openEditGroupModal()
  }

  const handleInputChange = (name: string, value: string | number) => {
    if (name === 'groupName') {
      setName(value.toString())
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Groups'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {groupsData ? (
          <RecentCard
            title='Groups'
            style={styles.recentFullScreen}
            Component={RecentButtons}
            componentProps={{
              access: groupsData.access,
              firstButtonClick: openNewGroupModal,
              secondButtonClick: handleNavigateToOrder,
            }}
          >
            <RecentGroups
              access={groupsData.access}
              groupsList={groupsData.data}
              deleteGroup={deleteSelectedGroup}
              editGroup={setIdEditGroup}
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
      <EditGroup
        id={selectedGroupId || 0}
        inputValueName={name}
        modalEditGroup={modalEditGroups}
        handleOpenCloseModal={openEditGroupModal}
        editGroup={editSelectedGroup}
        handleInputChange={handleInputChange}
      />
    </div>
  )
}
