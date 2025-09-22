import styles from './Item.module.scss'
import { SettingsRoleFormData } from '../../../../../../app/constants/constants'
import { CustomSwitch } from '../../../../../../shared/ui/CustomSwitch/CustomSwitch'
import styleItem from '../RecentEditRole.module.scss'

interface ItemProps {
  index: number
  name: string
  accessItem: SettingsRoleFormData
  handleChangeItemPermission: (
    index: number,
    field: keyof SettingsRoleFormData,
    value: number,
  ) => void
  handleChangeFullItemPermission: (index: number) => void
}

export const Item = ({
  index,
  name,
  accessItem,
  handleChangeItemPermission,
  handleChangeFullItemPermission,
}: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.permissionColumn} ${styles.permissionItem}`}
        onClick={() => handleChangeFullItemPermission(index)}
      >
        {name}
      </span>
      <div className={`${styleItem.viewColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          isChecked={accessItem.view === 1 ? true : false}
          onChange={(_name, value) =>
            handleChangeItemPermission(
              index,
              'view',
              value === true ? 1 : 0,
            )
          }
        />
      </div>
      <div className={`${styleItem.editColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          isChecked={accessItem.edit === 1 ? true : false}
          onChange={(_name, value) =>
            handleChangeItemPermission(
              index,
              'edit',
              value === true ? 1 : 0,
            )
          }
        />
      </div>
      <div className={`${styleItem.createColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          isChecked={accessItem.create === 1 ? true : false}
          onChange={(_name, value) =>
            handleChangeItemPermission(
              index,
              'create',
              value === true ? 1 : 0,
            )
          }
        />
      </div>
      <div className={`${styleItem.deleteColumn} ${styles.checkBoxItem}`}>
        <CustomSwitch
          isChecked={accessItem.delete === 1 ? true : false}
          onChange={(_name, value) =>
            handleChangeItemPermission(
              index,
              'delete',
              value === true ? 1 : 0,
            )
          }
        />
      </div>
      <div
        className={`${styleItem.allInformationColumn} ${styles.checkBoxItem}`}
      >
        <CustomSwitch
          isChecked={accessItem.all === 1 ? true : false}
          onChange={(_name, value) =>
            handleChangeItemPermission(
              index,
              'all',
              value === true ? 1 : 0,
            )
          }
        />
      </div>
    </div>
  )
}
