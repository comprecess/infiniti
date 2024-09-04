import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GroupsListProps } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { EditGroup } from '../../../../features/Admin/CustomersPage/GroupsPage/EditGroup/EditGroup'
import { NewGroup } from '../../../../features/Admin/CustomersPage/GroupsPage/NewGroup/NewGroup'
import { RecentButtons } from '../../../../features/Admin/CustomersPage/GroupsPage/RecentButtons/RecentButtons'
import { RecentGroups } from '../../../../features/Admin/CustomersPage/GroupsPage/RecentGroups/RecentGroups'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { addGroup } from '../../../../shared/utils/api/Admin/Groups/AddGroup'
import { deleteGroup } from '../../../../shared/utils/api/Admin/Groups/DeleteGroup'
import { editGroup } from '../../../../shared/utils/api/Admin/Groups/EditGroup'
import { getListGroups } from '../../../../shared/utils/api/Admin/Groups/GetGroups'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './GroupsPage.module.scss'

export const AdminGroupsPage: FC = () => {
  const [groups, setGroups] = useState<GroupsListProps[] | null>(null)

  const [newGroup, setNewGroup] = useState<boolean>(false)
  const [modalEditGroups, setModalEditGroups] = useState<boolean>(false)

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    null,
  )
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false)

  const [name, setName] = useState<string>('')

  const navigate = useNavigate()
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

  const confirmDeleteGroup = (id: number) => {
    setSelectedGroupId(id)
    setIsConfirmationModalOpen(true)
  }

  const createGroup = async () => {
    const addGroupResponse = await addGroup(name)

    if (addGroupResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new group',
        status: 'success',
      })
      getGroups()
    } else {
      showToast({
        title: 'Error',
        description: addGroupResponse.message,
        status: 'error',
      })
    }

    openNewGroupModal()
  }

  const deleteSelectedGroup = async () => {
    if (selectedGroupId === null) return

    const deleteResponse = await deleteGroup(selectedGroupId)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the group',
        status: 'success',
      })
      getGroups()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }

    openConfirmationModal()
  }

  const editSelectedGroup = async () => {
    if (selectedGroupId === null) return

    const editResponse = await editGroup(selectedGroupId, name)

    if (editResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the group name',
        status: 'success',
      })
      getGroups()
    } else {
      showToast({
        title: 'Error',
        description: editResponse.message,
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

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {groups ? (
          <RecentCard
            title='Groups'
            style={styles.recentFullScreen}
            Component={RecentButtons}
            componentProps={{
              firstButtonClick: openNewGroupModal,
              secondButtonClick: handleNavigateToOrder,
            }}
          >
            <RecentGroups
              groupsList={groups}
              deleteGroup={confirmDeleteGroup}
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
      <ConfirmationModal
        isOpened={isConfirmationModalOpen}
        handleOpenCloseModal={openConfirmationModal}
        agree={deleteSelectedGroup}
      />
    </div>
  )
}
