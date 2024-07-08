import { FC, useEffect, useState } from 'react'

import { RecentCurrencies } from '../../../../features/Admin/CurrenciesPage/RecentCurrencies/RecentCurrencies'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CurrenciesPage.module.scss'

export const AdminCurrenciesPage: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpenCloseModal = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (name: string, value: string) => {
    console.log(name, value)
  }

  useEffect(() => {
    document.title = 'infiniti | Currencies'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          title='Currencies'
          style={styles.recentFullScreen}
          Component={ButtonBlue}
          componentProps={{
            title: 'New Currency',
            icon: '/icons/plus.svg',
            iconProps: styles.icon,
            onClick: handleOpenCloseModal,
            style: styles.blueButton,
          }}
        >
          <RecentCurrencies />
        </RecentCard>
      </section>
      <CustomModalWindow
        maxWidth={'400px'}
        isOpen={isOpen}
        onClose={handleOpenCloseModal}
      >
        <div className={styles.modalInput}>
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>New Currency</h4>
            <div className={styles.cross} onClick={handleOpenCloseModal}>
              <CrossIcon />
            </div>
          </div>
          <div className={styles.modalInputDescription}>
            <CustomInput
              title='Currency Code'
              type='text'
              id='currencyCode'
              name='currencyCode'
              onChange={handleInputChange}
            />
            <span className={styles.modalDescription}>
              Currency ISO Code, eg. USD, GBP, INR etc...
            </span>
          </div>
          <div className={styles.modalInputDescription}>
            <CustomInput
              title='Base Conversion Rate'
              type='number'
              id='baseConversionRate'
              name='baseConversionRate'
              onChange={handleInputChange}
            />
            <span className={styles.modalDescription}>
              Enter the value of 1 = How much RUB ?
            </span>
          </div>
          <ButtonBlue title='Save' />
        </div>
      </CustomModalWindow>
    </div>
  )
}
