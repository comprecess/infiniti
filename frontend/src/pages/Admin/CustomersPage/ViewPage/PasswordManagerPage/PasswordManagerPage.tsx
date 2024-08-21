import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewPageContext,
  ViewPasswordManagerTypeData,
} from '../../../../../app/constants/constants'
import { RecentPasswordManager } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/PasswordManager/RecentPasswordManager/RecentPasswordManager'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './PasswordManagerPage.module.scss'

export const AdminContactPasswordManagerPage: FC = () => {
  const [data, setData] = useState<ViewPasswordManagerTypeData[] | null>(
    null,
  )

  const context = useOutletContext<ViewPageContext>()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(
      context.idClient,
      'client-password-manager',
    )

    setData(getResponse.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Password Manager'
  }, [])

  useEffect(() => {
    getInfo()
  }, [context.idClient])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard>
          <RecentPasswordManager list={data} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
