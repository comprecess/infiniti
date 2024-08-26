import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewEmailTypeData,
  ViewEmailValuesData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { Header } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/EmailPage/Header/Header'
import { RecentEmail } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/EmailPage/RecentEmail/RecentEmail'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { putSendEmail } from '../../../../../shared/utils/api/Admin/ViewContact/Email/PutSendEmail'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './EmailPage.module.scss'

export interface PartialFieldsPostData
  extends Partial<ViewEmailValuesData> {
  [key: string]: string | undefined
}

export const AdminContactEmailPage: FC = () => {
  const [data, setData] = useState<ViewEmailTypeData | null>(null)

  const [values, setValues] = useState<PartialFieldsPostData>()

  const showToast = useCustomToast()
  const context = useOutletContext<ViewPageContext>()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(
      context.idClient,
      'email',
    )

    setData(getResponse)
  }

  const sendEmail = async () => {
    if (values === undefined) return

    const sendResponse = await putSendEmail(
      context.idClient,
      'email',
      values,
    )

    if (sendResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully sent the letter',
        status: 'success',
      })
      getInfo()
    } else {
      showToast({
        title: 'Error',
        description: sendResponse.message,
        status: 'error',
      })
    }
  }

  const updateInfo = (name: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Email'
  }, [])

  useEffect(() => {
    getInfo()
  }, [context.idClient])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard
          HeaderComponent={Header}
          headerProps={{
            inputTo: data.client.email,
            updateInfo,
            sendEmail,
          }}
        >
          <RecentEmail list={data.logEmail} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
