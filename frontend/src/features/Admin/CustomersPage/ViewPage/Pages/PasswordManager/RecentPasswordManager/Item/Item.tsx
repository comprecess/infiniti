import { FC } from 'react'

import styleItem from '../RecentPasswordManager.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  name: string
  url: string
  username: string
}

export const Item: FC<ItemProps> = ({ name, url, username }) => {
  const openInNewTab = (url: string) => {
    const validUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`
    window.open(validUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
        {name}
      </span>
      <span className={`${styleItem.urlColumn} ${styles.urlItem}`}>{url}</span>
      <span className={`${styleItem.usernameColumn} ${styles.usernameItem}`}>
        {username}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <button
          className={styles.buttonGlobe}
          onClick={() => openInNewTab(url)}
        >
          <img src='/icons/globe.svg' alt='Globe' className={styles.icon} />
        </button>
        <button className={styles.buttonClipBoard}>
          <img
            src='/icons/clipBoard.svg'
            alt='ClipBoard'
            className={styles.icon}
          />
        </button>
        <button className={styles.buttonLock}>
          <img src='/icons/lock.svg' alt='Lock' className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
