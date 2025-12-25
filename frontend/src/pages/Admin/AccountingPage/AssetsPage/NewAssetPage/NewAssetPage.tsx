import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './NewAssetPage.module.scss'
import {
  AccountingAssetsInputData,
  AccountingNewAssetForm,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Fields } from '../../../../../features/Admin/AccountingPage/AssetsPage/NewAssetPage/Fields/Fields'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAssetsInputData } from '../../../../../shared/utils/api/Admin/Accounting/get-assets-input-data'
import { postCreateNewAsset } from '../../../../../shared/utils/api/Admin/Accounting/post-create-new-asset'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminNewAssetPage = () => {
  const [form, setForm] = useState<Partial<AccountingNewAssetForm>>({})
  const [inputData, setInputData] = useState<AccountingAssetsInputData | null>()

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const getInputData = async () => {
    const response = await getAssetsInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const addNewAsset = async () => {
    const { status, message } = await postCreateNewAsset(form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new Asset',
        status: 'success',
      })
      navigate(`/${Routes.adminPages}/${Routes.accounting}/${Routes.assets}`)
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | New Asset'

    getInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      {inputData ? (
        <section className={styles.section}>
          <RecentCard
            title='Add New Asset'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              onClick: addNewAsset,
            }}
          >
            <Fields inputData={inputData} setForm={setForm} />
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
