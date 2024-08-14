import { FC } from 'react'

import { ViewFileProps } from '../../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomSelect } from '../../../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './Header.module.scss'

interface HeaderProps {
  groupsList: ViewFileProps[]
  onChange: (name: string, value: string) => void
}

export const Header: FC<HeaderProps> = ({ groupsList, onChange }) => {
  return (
    <div className={styles.wrapper}>
      <CustomSelect
        title='Files'
        selectedList={groupsList.map(item => item.title)}
        onChange={onChange}
      />
      <ButtonBlue title='Submit' style={styles.buttonSubmit} />
    </div>
  )
}
