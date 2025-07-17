import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewEditTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { Fields } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/EditPage/Fields/Fields'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCustomerInputsData } from '../../../../../shared/utils/api/Admin/AddCustomer/get-customer-input-data'
import { getInfoProfileView } from '../../../../../shared/utils/api/Admin/ViewContact/Edit/GetInfoProfileView'
import styles from './EditPage.module.scss'

export const AdminContactEditPage = () => {
  const context = useOutletContext<ViewPageContext>()

  const { data: edit } = useQuery({
    queryKey: ['edit', context.idClient],
    queryFn: async () => {
      const response: { data: ViewEditTypeData } =
        await getInfoProfileView(context.idClient)

      return response
    },
    placeholderData: previousData => previousData,
  })

  const { data: inputs } = useQuery({
    queryKey: ['inputs', context.idClient],
    queryFn: async () => {
      const response = await getCustomerInputsData()

      if (!response.status) return

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  useEffect(() => {
    document.title = 'infiniti | Contact | Edit'
  }, [])

  return (
    <div className={styles.wrapper}>
      {edit && inputs ? (
        <div className={styles.container}>
          <Fields
            idClient={context.idClient}
            data={edit.data}
            inputs={inputs}
          />
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
