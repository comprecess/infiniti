import { FC } from 'react'

import styles from './SubmitButton.module.scss'

interface SubmitButtonProps {
  title: string
  type?: 'button' | 'submit' | 'reset'
}

export const SubmitButton: FC<SubmitButtonProps> = ({ title, type }) => {
  return (
    <button className={styles.wrapper} type={type}>
      {title}
    </button>
  )
}
