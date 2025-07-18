import { useState } from 'react'

import { NotificationCardData } from '../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomMiniButton } from '../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { patchSetDevicePush } from '../../../../shared/utils/api/Push/patch-set-device-push'
import styles from './NotifDevicesCard.module.scss'

interface NotifDevicesCardProps {
  data: NotificationCardData
  deleteNotification: (token: string) => void
}

export const NotifDevicesCard = ({
  data,
  deleteNotification,
}: NotifDevicesCardProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const showToast = useCustomToast()

  const handleActiveNotifications = async (isChecked: boolean) => {
    const { status } = await patchSetDevicePush(
      data.subscription,
      isChecked === true ? 1 : 0,
    )

    if (status && isChecked === true) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully enabled notifications for this device',
        status: 'success',
      })
    } else if (status && isChecked === false) {
      showToast({
        title: 'Successfully',
        description:
          'You have successfully disabled notifications for this device',
        status: 'success',
      })
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <span className={styles.name}>{data.name}</span>
        <div className={styles.buttons}>
          <CustomCheckBox
            title='Active?'
            titleOnChange='active'
            defaultChecked={data.enabled === 1 ? true : false}
            onInputChange={(_name, isChecked) =>
              handleActiveNotifications(isChecked)
            }
          />
          <CustomMiniButton
            style='cherry'
            icon='/icons/trash.svg'
            alt='Delete'
            tooltipTitle='Delete'
            onClick={handleOpenConfirmationModal}
          />
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={() => deleteNotification(data.subscription)}
        />
      )}
    </>
  )
}
