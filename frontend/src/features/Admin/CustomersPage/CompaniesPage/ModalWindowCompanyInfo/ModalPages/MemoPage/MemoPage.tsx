import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'

import styles from './MemoPage.module.scss'
import { RolesAccess } from '../../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCompanyPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/get-company-page'
import { putUpdateCompanyMemo } from '../../../../../../../shared/utils/api/Admin/Companies/View/put-update-company-memo'

interface Memo {
  notes: string
}

interface MemoPageProps {
  id: number
  roles?: { [key: string]: RolesAccess }
}

export const MemoPage = ({ id, roles }: MemoPageProps) => {
  const [memo, setMemo] = useState<Memo | null>(null)

  const showToast = useCustomToast()

  const getMemoPage = async () => {
    const response = await getCompanyPage(id, 'memo')

    if (!response.status) return

    setMemo(response.data)
  }

  const editMemo = async () => {
    const editResponse = await putUpdateCompanyMemo(
      id,
      'memo',
      memo?.notes || '',
    )

    if (editResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed Memo',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: editResponse.message,
        status: 'error',
      })
    }
  }

  const onChangeMemo = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMemo({
      ...memo,
      notes: event.target.value,
    })
  }

  useEffect(() => {
    getMemoPage()
  }, [])

  return (
    <div className={styles.wrapper}>
      {memo ? (
        <>
          <Textarea
            maxHeight='285px'
            value={memo.notes}
            focusBorderColor='#1b1e29'
            borderColor='#1b1e29'
            border='1px solid #1b1e29'
            _hover={{ borderColor: '#1b1e29' }}
            fontSize='14px'
            lineHeight='20px'
            onChange={onChangeMemo}
          />
          {roles && roles.companies.edit === 0 ? (
            <div style={{ display: 'none' }} />
          ) : (
            <ButtonBlue
              title='Save'
              style={styles.buttonBlue}
              styleTitle={styles.buttonBlueTitle}
              onClick={editMemo}
            />
          )}
        </>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
