import { useEffect, useState } from 'react'

import styles from './EditUserPage.module.scss'
import { SettingsEditUserData, SettingsUserInputData } from '../../../../../app/constants/constants'
import {
  Fields,
  PartialFieldsEditUserData,
} from '../../../../../features/Admin/Settings/UsersPage/EditUser/Fields/Fields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomSwitch } from '../../../../../shared/ui/CustomSwitch/CustomSwitch'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getUserInfo } from '../../../../../shared/utils/api/Admin/Settings/Users/EditUser/get-user-info'
import { postUpdateAvatarUser } from '../../../../../shared/utils/api/Admin/Settings/Users/EditUser/post-update-avatar-user'
import { putUpdateAdditionallyUserInfo } from '../../../../../shared/utils/api/Admin/Settings/Users/EditUser/put-update-additionally-user-info'
import { putUpdateUserInfo } from '../../../../../shared/utils/api/Admin/Settings/Users/EditUser/put-update-user-info'
import { getUserInputData } from '../../../../../shared/utils/api/Admin/Settings/Users/NewUser/get-user-input-data'
import { useIdFromUrl } from '../../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminEditUserPage = () => {
  const [formData, setFormData] = useState<PartialFieldsEditUserData | null>(null)

  const [userInfo, setUserInfo] = useState<SettingsEditUserData | null>(null)
  const [inputData, setInputData] = useState<SettingsUserInputData | null>(null)

  const id = useIdFromUrl('user')
  const showToast = useCustomToast()

  const getUserData = async () => {
    if (id === null) return

    const response = await getUserInfo(id)

    if (!response.status) return

    setUserInfo(response.data.data)
  }

  const getInputData = async () => {
    const response = await getUserInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const updateUserInfo = async () => {
    if (id === null || formData === null) return

    const { status, message } = await putUpdateUserInfo(id, formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully updated your User information',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const updateUserAvatar = async (file: FormData) => {
    if (id === null) return

    const { status, message } = await postUpdateAvatarUser(id, file)

    if (status) {
      showToast({
        title: 'Successfully',
        description: "You have successfully updated the user's avatar",
        status: 'success',
      })
      getUserData()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const updateAdditionallyInfoUser = async (data: { [key: string]: number }) => {
    if (id === null) return

    const { status, message } = await putUpdateAdditionallyUserInfo(id, data)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully updated User information',
        status: 'success',
      })
      getUserData()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Edit User'
  }, [])

  useEffect(() => {
    getUserData()
    getInputData()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {inputData && userInfo ? (
        <section className={styles.section}>
          <RecentCard
            title='Edit User'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: updateUserInfo,
            }}
          >
            <Fields
              userInfo={userInfo}
              inputData={inputData}
              updateUserAvatar={updateUserAvatar}
              updateAdditionallyInfoUser={updateAdditionallyInfoUser}
              onFormDataChange={setFormData}
            />
          </RecentCard>
          <RecentCard title='Notifications' style={styles.recentFullScreen}>
            <div className={styles.itemsContainer}>
              <CustomCheckBox
                title='Email'
                defaultChecked={userInfo.emailNotify === 1 ? true : false}
                onChange={event =>
                  updateAdditionallyInfoUser({
                    emailNotify: event.target.checked === true ? 1 : 0,
                  })
                }
              />
              <CustomCheckBox
                title='SMS'
                defaultChecked={userInfo.smsNotify === 1 ? true : false}
                onChange={event =>
                  updateAdditionallyInfoUser({
                    smsNotify: event.target.checked === true ? 1 : 0,
                  })
                }
              />
            </div>
          </RecentCard>
          <RecentCard title='Departments' style={styles.recentFullScreen}>
            <div className={styles.itemsContainer}>
              {inputData.department.map(department => {
                return (
                  <div key={department.id} className={styles.switchContainer}>
                    <CustomSwitch
                      isChecked={
                        !!userInfo.departments.find(departments => departments.id === department.id)
                      }
                      onChange={() =>
                        updateAdditionallyInfoUser({
                          department: department.id,
                        })
                      }
                    />
                    <span className={styles.departmentTitle}>{department.name}</span>
                  </div>
                )
              })}
            </div>
          </RecentCard>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
