import styles from './Item.module.scss'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentPasswordManager.module.scss'

interface ItemProps {
  name: string
  url: string
  username: string
}

export const Item = ({ name, url, username }: ItemProps) => {
  const openInNewTab = (url: string) => {
    const validUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`
    window.open(validUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.nameColumn} ${styles.nameItem}`}>
        {name}
      </span>
      <span className={`${styleItem.urlColumn} ${styles.urlItem}`}>
        {url}
      </span>
      <span
        className={`${styleItem.usernameColumn} ${styles.usernameItem}`}
      >
        {username}
      </span>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomMiniButton
          style='blue'
          icon='/icons/globe.svg'
          alt='Open Link'
          tooltipTitle='Open Link'
          onClick={() => openInNewTab(url)}
        />
        <CustomMiniButton
          style='mint'
          icon='/icons/clipBoard.svg'
          alt='Clipboard'
        />
        <CustomMiniButton
          style='cherry'
          icon='/icons/lock.svg'
          alt='Lock'
        />
      </div>
    </div>
  )
}
