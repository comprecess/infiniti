import { Dispatch, FC, SetStateAction } from 'react'

import { SettingsRoleFormData } from '../../../../../app/constants/constants'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import styles from './Header.module.scss'

interface HeaderProps {
  formData: {
    name: string
    access: SettingsRoleFormData[]
  } | null
  setFormData: Dispatch<
  SetStateAction<{
    name: string
    access: SettingsRoleFormData[]
  } | null>
  >
}

export const Header: FC<HeaderProps> = ({ formData, setFormData }) => {
  const handleOnChange = (_field: string, value: string | number) => {
    if (!formData) return

    setFormData({
      ...formData,
      name: value as string,
    })
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Role Name'
        type='text'
        id='roleName'
        name='roleName'
        value={formData?.name}
        onChange={handleOnChange}
      />
      <span className={styles.description}>
        Check all data to enable viewing of all data. By unchecking this,
        the user under this Role will see only the data created by that
        user.
      </span>
    </div>
  )
}
