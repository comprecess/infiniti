import { useNavigate } from 'react-router-dom'

import { Item } from './Item/Item'
import styles from './RecentFiles.module.scss'
import { CustomersFilesData, RolesAccess } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'

interface RecentFilesProps {
  access: RolesAccess
  files: CustomersFilesData[]
}

export const RecentFiles = ({ files }: RecentFilesProps) => {
  const navigate = useNavigate()

  const navigateToCustomer = (name: string, idTalent: number) => {
    navigate(`/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${idTalent}/${name}`)
  }

  return (
    <div className={styles.wrapper}>
      {files.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className={styles.nothingFound}>
          <span className={styles.nothingFoundText}>Nothing Found</span>
        </div>
      )}
    </div>
  )
}
