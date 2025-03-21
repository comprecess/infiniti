import { useNavigate } from 'react-router-dom'

import {
  CustomersFilesData,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Item } from './Item/Item'
import styles from './RecentFiles.module.scss'

interface RecentFilesProps {
  access: RolesAccess
  files: CustomersFilesData[]
}

export const RecentFiles = ({ files }: RecentFilesProps) => {
  const navigate = useNavigate()

  const navigateToCustomer = (name: string, idTalent: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${idTalent}/${name}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      {files.map(file => {
        return (
          <Item
            key={file.id}
            title={file.title}
            typeFile={file.type}
            customerId={file.client?.id || null}
            customerName={file.client?.account || null}
            uploadedAt={file.update}
            link={file.link}
            navigateToCustomer={navigateToCustomer}
          />
        )
      })}
    </div>
  )
}
