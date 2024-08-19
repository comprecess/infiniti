import DOMPurify from 'dompurify'
import { FC } from 'react'

import { IconItem } from '../IconItem/IconItem'
import styles from './Item.module.scss'

interface ItemProps {
  account: string
  date: string
  icon: string
  message: string
  time: string
}

export const Item: FC<ItemProps> = ({ account, date, icon, message, time }) => {
  const safeHTML = DOMPurify.sanitize(message)

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperContainer}>
        <div className={styles.container}>
          <div className={styles.leftContainer}>
            <IconItem nameIcon={icon} />
            <div className={styles.dateTime}>
              <span className={styles.date}>{date}</span>
              <span className={styles.time}>{time}</span>
            </div>
          </div>
          <div className={styles.rightContainer}>
            <span className={styles.account}>{account}</span>
            <div
              dangerouslySetInnerHTML={{ __html: safeHTML }}
              className={styles.message}
            />
            <div className={styles.buttonsList}>
              <button className={styles.buttonEdit}>
                <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
              </button>
              <button className={styles.buttonTrash}>
                <img
                  src='/icons/trash.svg'
                  alt='Trash'
                  className={styles.icon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
