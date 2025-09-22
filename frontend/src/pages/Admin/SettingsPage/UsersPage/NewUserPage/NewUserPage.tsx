import { useEffect, useState } from 'react'

import styles from './NewUserPage.module.scss'
import { SettingsUserInputData } from '../../../../../app/constants/constants'
import {
  Fields,
  PartialFieldsNewUserData,
} from '../../../../../features/Admin/Settings/UsersPage/NewUser/Fields/Fields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { addNewUser } from '../../../../../shared/utils/api/Admin/Settings/Users/NewUser/AddNewUser'
import { getUserInputData } from '../../../../../shared/utils/api/Admin/Settings/Users/NewUser/GetUserInputData'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminNewUserPage = () => {
  const [formData, setFormData] =
    useState<PartialFieldsNewUserData | null>(null)
  const [inputData, setInputData] = useState<SettingsUserInputData | null>(
    null,
  )

  const showToast = useCustomToast()

  const getInputData = async () => {
    const getResponse = await getUserInputData()

    setInputData(getResponse)
  }

  const createNewUser = async () => {
    const createResponse = await addNewUser(formData)

    if (createResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a User',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: createResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | New User'
    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData ? (
          <RecentCard
            title='Add New User'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: createNewUser,
            }}
          >
            <Fields inputData={inputData} onFormDataChange={setFormData} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
