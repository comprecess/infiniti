import React, { FC } from 'react'

import { CurrencyProps } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentCurrencies.module.scss'

interface RecentCurrenciesProps {
  currencyList: CurrencyProps[]
  deleteCurrency: (id: number) => void
  changeBaseCurrency: (id: number) => void
  editCurrency: (
    id: number,
    inputValueName: string,
    inputValueRate: string,
  ) => void
}

export const RecentCurrencies: FC<RecentCurrenciesProps> = ({
  currencyList,
  deleteCurrency,
  changeBaseCurrency,
  editCurrency,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Currency Code' style={styles.currencyCodeColumn} />
        <Title
          title='Base Conversion Rate'
          style={styles.baseConversionRateColumn}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {currencyList.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                id={order.id}
                currencyCode={order.code}
                baseConversionRate={order.rate}
                baseCurrency={order.isdefault}
                deleteCurrency={deleteCurrency}
                changeBaseCurrency={changeBaseCurrency}
                editCurrency={editCurrency}
              />
              {index !== currencyList.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
