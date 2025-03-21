import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'

import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/GetPage'
import { updateMemo } from '../../../../../../../shared/utils/api/Admin/Companies/View/UpdateMemoInfo'
import styles from './MemoPage.module.scss'

interface Memo {
  notes: string
}

interface MemoPageProps {
  id: number
}

export const MemoPage = ({ id }: MemoPageProps) => {
  const [memo, setMemo] = useState<Memo | null>(null)

  const showToast = useCustomToast()

  const getMemoPage = async () => {
    const getResponse: Memo = await getPage(id, 'memo')

    setMemo(getResponse)
  }

  const editMemo = async () => {
    const editResponse = await updateMemo(id, 'memo', memo?.notes || '')

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
          <ButtonBlue
            title='Save'
            style={styles.buttonBlue}
            styleTitle={styles.buttonBlueTitle}
            onClick={editMemo}
          />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  )
}
