import { FC } from 'react'

import styles from './Avatar.module.scss'

interface AvatarProps {
  avatar: string
  name: string
}

export const Avatar: FC<AvatarProps> = ({ avatar, name }) => {
  return (
    <div className={styles.wrapper}>
      <img
        className={styles.avatar}
        src={avatar ? avatar : '/profileWithoutAvatar.svg'}
        alt='Profile Avatar'
      />
      <span className={styles.title}>{name}</span>
    </div>
  )
}
