import { FC, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { getInfoSelectedInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/GetInfoSelectedInvoice'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewInvoice.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/view\/(\d+)$/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )
}

export const AdminViewInvoice: FC = () => {
  const id = useIdFromUrl()

  const getInvoiceInfo = async () => {
    if (id === null) return

    const getResponse = await getInfoSelectedInvoice(id)

    console.log(getResponse)
  }

  useEffect(() => {
    document.title = 'infiniti | View Invoice '
  }, [])

  useEffect(() => {
    getInvoiceInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <CustomInput
          readOnly
          title='Unique Invoice URL:'
          type='text'
          name='uniqueURL'
          id='uniqueURL'
          value='URL'
          styleInput={styles.input}
          onChange={() => {}}
        />
        <RecentCard title='---Invoice---'>Content</RecentCard>
      </section>
    </div>
  )
}
