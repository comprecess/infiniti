import { FC } from 'react'

import styles from './Avatar.module.scss'

interface AvatarProps {
  avatar: string
  name: string
}

export const Avatar: FC<AvatarProps> = ({ avatar, name }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <img
          alt='Profile Avatar'
          src={
            avatar
              ? `${avatar}?width=128&height=128`
              : '/profileWithoutAvatar.svg'
          }
        />
      </div>
      <span className={styles.title}>{name}</span>
    </div>
  )
}
