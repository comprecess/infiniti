import { Fragment, useEffect, useState } from 'react'

import { TransactionsViewCompany } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/GetPage'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './TransactionsPage.module.scss'

interface TransactionsPageProps {
  id: number
}

export const TransactionsPage = ({ id }: TransactionsPageProps) => {
  const [transactions, setTransactions] = useState<
  TransactionsViewCompany[] | null
  >(null)

  const getTransactions = async () => {
    const getResponse = await getPage(id, 'transactions')

    setTransactions(getResponse.data)
  }

  useEffect(() => {
    getTransactions()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {transactions ? (
          <div className={styles.table}>
            <div className={styles.columns}>
              <Title title='#' style={styles.hashTagColumn} />
              <Title title='Date' style={styles.dateColumn} />
              <Title title='Account' style={styles.accountColumn} />
              <Title title='Type' style={styles.typeColumn} />
              <Title title='Amount' style={styles.amountColumn} />
              <Title
                title='Description'
                style={styles.descriptionColumn}
              />
              <Title title='Dr.' style={styles.drColumn} />
              <Title title='Cr' style={styles.crColumn} />
              <Title title='Balance' style={styles.balanceColumn} />
              <Title title='Manage' style={styles.manageColumn} />
            </div>
            <div className={styles.items}>
              {transactions.map((item, index) => {
                return (
                  <Fragment key={item.id}>
                    <Item
                      code={item.id}
                      date={item.date}
                      account={item.account}
                      type={item.type}
                      amount={item.amount}
                      status={item.status}
                      description={item.description}
                      dr={item.dr}
                      cr={item.cr}
                      bal={item.bal}
                    />
                    {index !== transactions.length - 1 && (
                      <CustomDivider />
                    )}
                  </Fragment>
                )
              })}
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  )
}
