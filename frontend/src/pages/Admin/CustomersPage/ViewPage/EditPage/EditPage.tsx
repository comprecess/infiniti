import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  CustomerInputsData,
  ViewEditTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { Fields } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/EditPage/Fields/Fields'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCustomerInputsData } from '../../../../../shared/utils/api/Admin/AddCustomer/GetCustomerInputsData'
import { getInfoProfileView } from '../../../../../shared/utils/api/Admin/ViewContact/Edit/GetInfoProfileView'
import styles from './EditPage.module.scss'

export const AdminContactEditPage: FC = () => {
  const [data, setData] = useState<ViewEditTypeData | null>(null)
  const [inputs, setInputs] = useState<CustomerInputsData | null>(null)

  const context = useOutletContext<ViewPageContext>()

  const getInfo = async () => {
    const getResponse = await getInfoProfileView(context.idClient)

    setData(getResponse.data)
  }

  const getInputsList = async () => {
    const getResponse = await getCustomerInputsData()

    setInputs(getResponse)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Edit'
  }, [])

  useEffect(() => {
    getInfo()
    getInputsList()
  }, [context.idClient])

  return (
    <div className={styles.wrapper}>
      {data && inputs ? (
        <div className={styles.container}>
          <Fields
            idClient={context.idClient}
            data={data}
            inputs={inputs}
          />
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
