import { FC, useState } from 'react'

import styles from './CheckBox.module.scss'

interface CheckBoxProps {
  title: string
}

export const CheckBox: FC<CheckBoxProps> = ({ title }) => {
  const [isActive, setIsActive] = useState<boolean>(false)

  const handleClick = () => {
    setIsActive(!isActive)
  }

  return (
    <div className={styles.wrapper}>
      <div
        id='checkbox'
        className={
          isActive ? styles.checkBoxActive : styles.checkBoxDisable
        }
        onClick={handleClick}
      >
        {!isActive || (
          <img
            src='/icons/check.svg'
            alt='Check'
            className={styles.check}
          />
        )}
      </div>
      <span className={styles.title} onClick={handleClick}>
        {title}
      </span>
    </div>
  )
}
