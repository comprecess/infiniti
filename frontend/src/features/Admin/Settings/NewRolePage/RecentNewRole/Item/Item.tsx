import styles from './Item.module.scss'
import { SettingsRoleFormData } from '../../../../../../app/constants/constants'
import { CustomSwitch } from '../../../../../../shared/ui/CustomSwitch/CustomSwitch'
import styleItem from '../RecentNewRole.module.scss'

interface ItemProps {
  index: number
  name: string
  handleChange: (
    index: number,
    field: keyof SettingsRoleFormData,
    value: number,
  ) => void
}

export const Item = ({ index, name, handleChange }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.permissionColumn} ${styles.permissionItem}`}
      >
        {name}
      </span>
      <div className={`${styleItem.viewColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          onChange={(_name, value) =>
            handleChange(index, 'view', value === true ? 1 : 0)
          }
        />
      </div>
      <div className={`${styleItem.editColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          onChange={(_name, value) =>
            handleChange(index, 'edit', value === true ? 1 : 0)
          }
        />
      </div>
      <div className={`${styleItem.createColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          onChange={(_name, value) =>
            handleChange(index, 'create', value === true ? 1 : 0)
          }
        />
      </div>
      <div className={`${styleItem.deleteColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          onChange={(_name, value) =>
            handleChange(index, 'delete', value === true ? 1 : 0)
          }
        />
      </div>
      <div
        className={`${styleItem.allInformationColumn} ${styles.checkBoxItem}`}
      >
        <CustomSwitch
          onChange={(_name, value) =>
            handleChange(index, 'all', value === true ? 1 : 0)
          }
        />
      </div>
    </div>
  )
}
