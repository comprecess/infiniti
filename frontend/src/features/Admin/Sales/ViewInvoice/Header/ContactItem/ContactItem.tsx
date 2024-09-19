import { FC } from 'react'

import styles from './ContactItem.module.scss'

interface ContactItemProps {
  title: string
  value: string
}

export const ContactItem: FC<ContactItemProps> = ({ title, value }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{`${title}:`}</span>
      <span className={styles.value} contentEditable={false}>
        {value ? value : '-'}
      </span>
    </div>
  )
}
