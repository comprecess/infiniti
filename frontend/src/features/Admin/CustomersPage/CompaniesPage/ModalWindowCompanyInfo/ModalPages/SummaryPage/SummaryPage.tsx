import { useEffect, useState } from 'react'

import {
  CompanyData,
  RolesAccess,
} from '../../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCompanyPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/get-company-page'
import { Item } from './Item/Item'
import styles from './SummaryPage.module.scss'

interface SummaryPageProps {
  id: number
  onClick: (id: number) => void
}

export const SummaryPage = ({ id, onClick }: SummaryPageProps) => {
  const [summary, setSummary] = useState<CompanyData | null>(null)
  const [access, setAccess] = useState<RolesAccess | null>(null)

  const getSummaryPage = async () => {
    const response = await getCompanyPage(id, 'summary')

    if (!response.status) return

    setAccess(response.data.access)
    setSummary(response.data.data)
  }

  const handleOpenEditPanel = () => {
    onClick(id)
  }

  useEffect(() => {
    getSummaryPage()
  }, [])

  return (
    <div className={styles.wrapper}>
      {summary ? (
        <>
          <div className={styles.list}>
            {summary.name && (
              <Item title='Company Name:' description={summary.name} />
            )}
            {summary.url && (
              <Item title='URL:' description={summary.url} />
            )}
            {summary.email && (
              <Item title='Email:' description={summary.email} />
            )}
            {summary.phone && (
              <Item title='Phone:' description={summary.phone} />
            )}
          </div>
          {access?.edit === 1 && (
            <ButtonBlue
              title='Edit'
              style={styles.buttonBlue}
              styleTitle={styles.buttonBlueTitle}
              onClick={handleOpenEditPanel}
            />
          )}
        </>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
