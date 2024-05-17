import { FC, useState } from 'react'

import styles from './CheckBox.module.scss'

interface CheckBoxProps {
  title: string
  image?: string
}

export const CheckBox: FC<CheckBoxProps> = ({ title, image }) => {
  const [activeCheckBox, setActiveCheckBox] = useState<boolean>(false)

  const handleClick = () => {
    setActiveCheckBox(!activeCheckBox)
  }

  return (
    <div className={styles.wrapper}>
      <div
        id='checkbox'
        className={
          activeCheckBox ? styles.checkBoxActive : styles.checkBoxDisable
        }
        onClick={handleClick}
      >
        {!activeCheckBox || (
          <img
            src={image ? image : '/icons/check.svg'}
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
