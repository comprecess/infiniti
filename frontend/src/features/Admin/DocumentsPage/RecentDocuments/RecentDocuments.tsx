import { Fragment, useCallback, useState } from 'react'

import { Item } from './Item/Item'
import styles from './RecentDocuments.module.scss'
import { CustomersFilesData, RolesAccess } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { getAuthToken } from '../../../../shared/utils/api/get-auth-token'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentDocumentsProps {
  files: CustomersFilesData[]
  access: RolesAccess | undefined
  deleteFile: (idFile: number) => void
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
}

export const RecentDocuments = ({
  files,
  access,
  deleteFile,
  changeSortName,
}: RecentDocumentsProps) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1])

  const authToken = getAuthToken()

  const handleSortChange = useCallback(
    (index: number, sortNameItem: string, sortTypeItem: number) => {
      setSortNumbers(prevSortNumbers =>
        prevSortNumbers.map((_num, i) => (i === index ? sortTypeItem : 1)),
      )
      changeSortName(sortNameItem, sortTypeItem)
    },
    [changeSortName],
  )

  const clearSort = () => {
    setSortNumbers(new Array(2).fill(1))
  }

  if (files.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          sorted
          title='Type'
          style={styles.typeColumn}
          sortType={sortNumbers[0]}
          sortName='id'
          sortIndex={0}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Title'
          style={styles.titleColumn}
          sortType={sortNumbers[1]}
          sortName='title'
          sortIndex={1}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {files.map((file, index) => {
          return (
            <Fragment key={file.id}>
              <Item
                idFile={file.id}
                authToken={authToken}
                global={file.global}
                title={file.title}
                link={file.link}
                type={file.type}
                access={access}
                deleteFile={deleteFile}
              />
              {index !== files.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
