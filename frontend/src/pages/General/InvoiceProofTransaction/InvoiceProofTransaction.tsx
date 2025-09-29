import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './InvoiceProofTransaction.module.scss'
import { SalesViewInvoiceData } from '../../../app/constants/constants'
import { Routes } from '../../../app/router/routes'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDropZone } from '../../../shared/ui/CustomDropZone/CustomDropZone'
import { CustomInput } from '../../../shared/ui/CustomInput/CustomInput'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { postAddNewDocument } from '../../../shared/utils/api/Admin/Sales/PublicDocumentProof/post-add-new-document'
import { getInfoPublicInvoice } from '../../../shared/utils/api/Admin/Sales/PublicInvoice/get-info-public-invoice'
import { sanitizeMessage } from '../../../shared/utils/TextEditor/sanitizeMessage'

const extractTokenFromUrl = (url: string): string | null => {
  const regex = /\/transaction\/([^/]+)$/
  const match = url.match(regex)

  return match ? match[1] : null
}

const useTokenFromUrl = () => {
  const location = useLocation()

  return useMemo(() => extractTokenFromUrl(location.pathname), [location.pathname])
}

export const InvoiceProofTransaction = () => {
  const [formData, setFormData] = useState<{
    title?: string
    file?: File
  }>({})

  const [info, setInfo] = useState<SalesViewInvoiceData | null>(null)

  const navigate = useNavigate()
  const showToast = useCustomToast()
  const token = useTokenFromUrl()

  const onChangeInput = (name: string, value: string | number | boolean) => {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value,
      }
    })
  }

  const handleDrop = (acceptedFile: File) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      file: acceptedFile,
    }))
  }

  const getInvoiceInfo = async () => {
    if (token === null) return

    const response = await getInfoPublicInvoice(token, '?type=view')

    if (!response.status) return

    setInfo(response.data)
  }

  const addNewDocument = async () => {
    if (token === null) return

    const form = new FormData()

    if (formData.title) form.append('title', formData.title)
    if (formData.file) form.append('file', formData.file)

    const { status, message } = await postAddNewDocument(form, token)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added a Document',
        status: 'success',
      })
      navigate(`/${Routes.public}/${Routes.invoice}/${Routes.view}/${token}`)
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    getInvoiceInfo()
  }, [token])

  return (
    <div className={styles.wrapper}>
      {info ? (
        <div className={styles.container}>
          <span className={styles.title}>Invoice</span>
          <div className={styles.header}>
            <div className={styles.invoiceTitle}>
              {info.title && <h4 className={styles.titleInvoice}>{`${info.title}`}</h4>}
              <h4 className={styles.invoiceCode}>{`#${info.code}`}</h4>
            </div>
            <div className={styles.totalEnd}>
              <div className={styles.totalWrapper}>
                <span className={styles.totalTitle}>Invoice Total:</span>
                <span className={styles.totalValue} contentEditable={false}>
                  {info.blankCalc.total}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.noteWrapper}>
            <span
              dangerouslySetInnerHTML={{
                __html: sanitizeMessage(info.notes),
              }}
              className='dangerouslySetInnerHTML'
            />
          </div>
          <div className={styles.footer}>
            <div className={styles.footerTitleWrapper}>
              <span className={styles.footerTitle}>Upload File</span>
            </div>
            <CustomInput
              title='Title'
              type='text'
              name='title'
              id='title'
              value={`INVOICE / ${info.code} / Proof Of Payment`}
              onChange={onChangeInput}
            />
            <CustomDropZone onDrop={handleDrop} />
            <ButtonBlue title='Send' style={styles.buttonSubmit} onClick={addNewDocument} />
          </div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
