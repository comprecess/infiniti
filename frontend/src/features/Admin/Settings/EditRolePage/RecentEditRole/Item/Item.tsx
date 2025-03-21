import { SettingsRoleFormData } from '../../../../../../app/constants/constants'
import { CustomSwitch } from '../../../../../../shared/ui/CustomSwitch/CustomSwitch'
import styleItem from '../RecentEditRole.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  index: number
  name: string
  viewValue: number
  editValue: number
  createValue: number
  deleteValue: number
  allValue: number
  handleChange: (
    index: number,
    field: keyof SettingsRoleFormData,
    value: number,
  ) => void
}

export const Item = ({
  index,
  name,
  viewValue,
  editValue,
  createValue,
  deleteValue,
  allValue,
  handleChange,
}: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.permissionColumn} ${styles.permissionItem}`}
      >
        {name}
      </span>
      <div className={`${styleItem.viewColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          isChecked={viewValue === 1 ? true : false}
          onChange={(_name, value) =>
            handleChange(index, 'view', value === true ? 1 : 0)
          }
        />
      </div>
      <div className={`${styleItem.editColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          isChecked={editValue === 1 ? true : false}
          onChange={(_name, value) =>
            handleChange(index, 'edit', value === true ? 1 : 0)
          }
        />
      </div>
      <div className={`${styleItem.createColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          isChecked={createValue === 1 ? true : false}
          onChange={(_name, value) =>
            handleChange(index, 'create', value === true ? 1 : 0)
          }
        />
      </div>
      <div className={`${styleItem.deleteColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          isChecked={deleteValue === 1 ? true : false}
          onChange={(_name, value) =>
            handleChange(index, 'delete', value === true ? 1 : 0)
          }
        />
      </div>
      <div
        className={`${styleItem.allInformationColumn} ${styles.checkBoxItem}`}
      >
        <CustomSwitch
          isChecked={allValue === 1 ? true : false}
          onChange={(_name, value) =>
            handleChange(index, 'all', value === true ? 1 : 0)
          }
        />
      </div>
    </div>
  )
}
