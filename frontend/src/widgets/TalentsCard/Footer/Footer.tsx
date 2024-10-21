import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './Footer.module.scss'
import { Item } from './Item/Item'

interface FooterProps {
  id: number
  dailyRate: string
  hourlyRate: string
}

export const Footer: FC<FooterProps> = ({ id, dailyRate, hourlyRate }) => {
  const navigate = useNavigate()

  const handleNavigateToTalent = () => {
    navigate(
      `/${Routes.clientPages}/${Routes.talents}/${Routes.talent}/${id}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>
        <Item title={dailyRate} description='Daily rate (8h)' />
        <Item title={hourlyRate} description='Hourly rate' />
      </div>
      <ButtonBlue title='Details' onClick={handleNavigateToTalent} />
    </div>
  )
}
