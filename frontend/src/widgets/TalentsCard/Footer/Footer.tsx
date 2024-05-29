import { FC } from 'react'

import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './Footer.module.scss'
import { Item } from './Item/Item'

interface FooterProps {
  dailyRate: string
  hourlyRate: string
}

export const Footer: FC<FooterProps> = ({ dailyRate, hourlyRate }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <Item title={dailyRate} description='Daily rate (8h)' />
        <Item title={hourlyRate} description='Hourly rate' />
      </div>
      <ButtonBlue title='Details' />
    </div>
  )
}
