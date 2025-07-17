import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AccountingAssetsInputData,
  AccountingNewAssetForm,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Fields } from '../../../../../features/Admin/AccountingPage/AssetsPage/EditAssetPage/Fields/Fields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAssetsInputData } from '../../../../../shared/utils/api/Admin/Accounting/get-assets-input-data'
import { getSelectedAssetInfo } from '../../../../../shared/utils/api/Admin/Accounting/get-selected-asset-info'
import { putUpdateAsset } from '../../../../../shared/utils/api/Admin/Accounting/put-update-asset'
import { useIdFromUrl } from '../../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './EditAssetPage.module.scss'

export const AdminEditAssetPage = () => {
  const [form, setForm] = useState<AccountingNewAssetForm | null>(null)
  const [inputData, setInputData] =
    useState<AccountingAssetsInputData | null>()

  const id = useIdFromUrl('asset')
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInputData = async () => {
    const response = await getAssetsInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const getAssetInfo = async () => {
    if (!id) return

    const response = await getSelectedAssetInfo(id)

    if (!response.status) return

    const { category, ...rest } = response.data.data

    setForm({
      ...rest,
      category: category?.id ?? null,
    })
  }

  const handleEditAssetSubmit = async () => {
    if (!id || !form) return

    const { status, message } = await putUpdateAsset(id, form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the data in the Asset',
        status: 'success',
      })
      navigate(
        `/${Routes.adminPages}/${Routes.accounting}/${Routes.assets}`,
      )
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Edit Asset'
  }, [])

  useEffect(() => {
    getInputData()
    getAssetInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {inputData && form ? (
        <section className={styles.section}>
          <RecentCard
            title='Edit Asset'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              style: styles.buttonSave,
              onClick: handleEditAssetSubmit,
            }}
          >
            <Fields inputData={inputData} form={form} setForm={setForm} />
          </RecentCard>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
