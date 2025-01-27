import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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

export const AdminContactEmailPage = () => {
  const [values, setValues] = useState<PartialFieldsPostData>()

  const showToast = useCustomToast()
  const queryClient = useQueryClient()
  const context = useOutletContext<ViewPageContext>()

  const { data: email } = useQuery({
    queryKey: ['email', context.idClient],
    queryFn: async () => {
      const response: ViewEmailTypeData = await getSelectedTypeInfo(
        context.idClient,
        'email',
      )

      return response
    },
    staleTime: 5000,
  })

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
      queryClient.invalidateQueries({ queryKey: ['email'] })
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

  return (
    <div className={styles.wrapper}>
      {email ? (
        <RecentCard
          HeaderComponent={Header}
          headerProps={{
            inputTo: email.client.email,
            updateInfo,
            sendEmail,
          }}
        >
          <RecentEmail list={email.logEmail} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
