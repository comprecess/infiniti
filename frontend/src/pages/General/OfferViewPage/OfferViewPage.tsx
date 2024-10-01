import { FC, useState } from 'react'

import { FullInfoClient } from '../../../app/constants/constants'
import { Header } from '../../../features/General/OfferViewPage/Header/Header'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import styles from './OfferViewPage.module.scss'

export const OfferViewPage: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [info, _setInfo] = useState<null>(null)

  const [testClient] = useState<FullInfoClient>({
    id: 0,
    account: 'string',
    address: 'string',
    amount: 'string',
    autologin: 'string',
    balance: 'string',
    city: 'string',
    company: 'string',
    country: 'string',
    customFields: [],
    email: 'string',
    group: 'string',
    notes: 'string',
    phone: 'string',
    primaryContact: 0,
    state: 'string',
    tags: 'string',
    totalExpense: 'string',
    totalProfit: 'string',
    zip: 'string',
  })

  return (
    <div className={styles.wrapper}>
      {!info ? (
        <div className={styles.container}>
          <div className={styles.pdfButtons}>
            <ButtonBlue title='Download PDF' style={styles.downloadPDF} />
            <ButtonBlue title='View PDF' style={styles.viewPDF} />
            <ButtonBlue title='Accept' style={styles.acceptPDF} />
            <ButtonBlue title='Decline' style={styles.declinePDF} />
          </div>
          <div className={styles.header}>
            <Header
              title={'---Title---'}
              invoiceCode={'---Invoice-Code---'}
              invoiceDate={'---Invoice-Date---'}
              dueDate={'---Due-Date---'}
              status={'---Status---'}
              totalInvoice={'---Total---'}
              client={testClient}
              checkPublic={false}
              company={{
                companyAddress: '---Company-Address---',
                companyName: '----Company-Name---',
              }}
            />
          </div>
          <div className={styles.table}>
            <div className={styles.tableContent}>RecentOffer</div>
          </div>
          <div className={styles.footer}>Footer</div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
