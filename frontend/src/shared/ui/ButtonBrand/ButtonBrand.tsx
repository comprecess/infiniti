import { FC } from 'react'

import styles from './ButtonBrand.module.scss'

interface ButtonBrandProps {
  title: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export const ButtonBrand: FC<ButtonBrandProps> = ({
  title,
  type,
  onClick,
}) => {
  return (
    <button className={styles.wrapper} type={type} onClick={onClick}>
      {title}
    </button>
  )
}
