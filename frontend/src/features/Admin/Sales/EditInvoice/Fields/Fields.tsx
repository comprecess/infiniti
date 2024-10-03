import { Textarea } from '@chakra-ui/react'
import React, { FC, useEffect, useRef, useState } from 'react'

import {
  BlankCalc,
  SalesBlanks,
  SalesEditInvoiceBlankData,
  SalesEditInvoiceData,
  SalesNewInvoiceInputData,
  SalesNewInvoiceTaxProps,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import { AddProductOrService } from '../../AddProductOrService/AddProductOrService'
import { Item } from '../../NewInvoice/Fields/Item/Item'
import { Blank } from '../Blank/Blank'
import styles from './Fields.module.scss'

interface FieldsProps {
  data: SalesEditInvoiceData
  inputData: SalesNewInvoiceInputData
  blanks: SalesBlanks
  addBlank: () => void
  addServiceBlank: (idService: string) => void
  removeBlank: (idBlank: number) => void
  updateBlank: (idBlank: number, data: SalesEditInvoiceBlankData) => void
  onFormDataChange: (data: Partial<InfoData>) => void
}

interface InfoData {
  title: string
  clientId: number
  invoiceNum: string
  showQuantity: string
  receiptNumber: string
  num: string
  status: string
  currency: string
  notes: string
  date: string
  repeat: number | null
  dueDate: number | null
  checkPublic: number
  blankList: SalesEditInvoiceBlankData[]
  blankCalc: BlankCalc
}

export interface PartialFieldsData extends Partial<InfoData> {
  [key: string]:
  | string
  | number
  | SalesEditInvoiceBlankData[]
  | BlankCalc
  | boolean
  | undefined
  | null
}

export const Fields: FC<FieldsProps> = ({
  data,
  blanks,
  inputData,
  addBlank,
  addServiceBlank,
  removeBlank,
  updateBlank,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<PartialFieldsData>({
    title: data.title,
    clientId: data.client.id,
    invoiceNum: data.invoiceNum,
    showQuantity: data.showQuantity,
    receiptNumber: data.receiptNumber,
    num: data.num,
    date: data.date,
    checkPublic: data.checkPublic,
    status: data.status === 'Unpaid' ? 'Published' : data.status,
    currency: data.currency.code,
    notes: data.notes,
    blankList: blanks.blank.map(item => ({
      ...item,
      tax:
        typeof item.tax === 'object'
          ? (item.tax as SalesNewInvoiceTaxProps).id
          : item.tax,
    })),
    blankCalc: blanks.blankCalc,
    repeat: data.repeat !== null ? data.repeat + 1 : null,
    dueDate: data.dueDate !== null ? data.dueDate + 1 : null,
  })

  const [modalProductService, setModalProductService] =
    useState<boolean>(false)

  const timerRef = useRef<number | null>(null)

  const handleOpenCloseProductService = () => {
    setModalProductService(prev => !prev)
  }

  const handleChangeInput = (
    field: string,
    value:
    | string
    | number
    | SalesEditInvoiceBlankData[]
    | boolean
    | undefined
    | null,
  ) => {
    let updatedValue = value

    if (field === 'currency' && typeof value === 'number') {
      const currencyData = inputData.currency.find(
        currency => currency.id === value,
      )
      updatedValue = currencyData ? currencyData.code : ''
    } else if (field === 'status' && typeof value === 'number') {
      updatedValue = inputData.status[value]
    } else if (
      (field === 'dueDate' || field === 'repeat') &&
      typeof value === 'number'
    ) {
      updatedValue = value === 0 ? null : value - 1
    } else if (field === 'clientId' && typeof value === 'number') {
      updatedValue = value === 0 ? null : inputData.client[value - 1].id
    } else if (field === 'checkPublic' && typeof value === 'boolean') {
      updatedValue = value === true ? 1 : 0
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: updatedValue,
    }))
  }

  const handleBlankInputChange = (
    id: number,
    field: string,
    value: string | number,
  ) => {
    const updatedBlankList = (formData.blankList || []).map(blank =>
      blank.id === id ? { ...blank, [field]: value } : blank,
    )

    setFormData(prevFormData => ({
      ...prevFormData,
      blankList: updatedBlankList,
    }))

    const updatedBlank = updatedBlankList.find(blank => blank.id === id)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      if (updatedBlank) {
        updateBlank(id, updatedBlank)
      }
    }, 1000)
  }

  const updateBlankList = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      blankCalc: blanks.blankCalc,
      blankList: blanks.blank.map(item => ({
        ...item,
        tax:
          typeof item.tax === 'object'
            ? (item.tax as SalesNewInvoiceTaxProps).id
            : item.tax,
      })),
    }))
  }

  const clientAddress =
    inputData.client.find(client => client.id === formData.clientId)
      ?.address || ''

  useEffect(() => {
    onFormDataChange(formData)
  }, [formData, onFormDataChange])

  useEffect(() => {
    updateBlankList()
  }, [blanks])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.section}>
          <CustomInput
            title='Title'
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChangeInput}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Address</span>
            <Textarea
              readOnly
              minHeight='140px'
              maxHeight='232px'
              focusBorderColor='#1b1e29'
              borderColor='#1b1e29'
              color='gray.400'
              backgroundColor='brand.800'
              border='1px solid #1b1e29'
              _hover={{ borderColor: '#1b1e29' }}
              fontSize='16px'
              fontWeight='400'
              lineHeight='24px'
              value={clientAddress}
            />
          </div>
          <CustomInput
            title='Invoice Prefix'
            type='text'
            id='invoiceNum'
            name='invoiceNum'
            value={formData.invoiceNum}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Invoice #'
            type='text'
            id='num'
            name='num'
            value={formData.num}
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Invoice Date'
            titleOnChange='date'
            value={formData.date}
            onChange={handleChangeInput}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Hide Info</span>
            <CustomCheckBox
              defaultChecked={formData.checkPublic === 1 ? true : false}
              titleOnChange='checkPublic'
              title='Hide Personal Info'
              onInputChange={handleChangeInput}
            />
          </div>
        </section>
        <section className={styles.section}>
          <CustomSelect
            title='Customer'
            titleOnChange='clientId'
            placeholder='None'
            idList={inputData.client.map((_client, index) => index + 1)}
            value={
              inputData.client.findIndex(
                client => client.id === formData.clientId,
              ) + 1
            }
            nameList={inputData.client.map(client =>
              `${client.account}${
                client.email ? ` - ${client.email}` : ''
              }`.trim(),
            )}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Status'
            titleOnChange='status'
            idList={inputData.status.map((_status, index) => index)}
            nameList={inputData.status}
            value={inputData.status.findIndex(
              status =>
                status ===
                (formData.status === 'Unpaid'
                  ? 'Published'
                  : formData.status),
            )}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Currency'
            titleOnChange='currency'
            idList={inputData.currency.map(currency => currency.id)}
            nameList={inputData.currency.map(currency => currency.code)}
            value={
              inputData.currency.find(
                currency => currency.code === formData.currency,
              )?.id || 0
            }
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Receipt Number'
            type='text'
            id='receiptNumber'
            name='receiptNumber'
            value={formData.receiptNumber}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Show quantity as'
            type='text'
            id='showQuantity'
            name='showQuantity'
            value={formData.showQuantity}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Payment Terms'
            titleOnChange='dueDate'
            placeholder='None'
            idList={inputData.dueDate.map((_dueDate, index) => index + 1)}
            nameList={inputData.dueDate}
            value={formData.dueDate || 0}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Repeat Every'
            titleOnChange='repeat'
            placeholder='None'
            idList={inputData.repeat.map((_repeat, index) => index + 1)}
            nameList={inputData.repeat}
            value={formData.repeat || 0}
            onChange={handleChangeInput}
          />
        </section>
      </div>
      {formData.blankList && formData.blankList.length > 0 ? (
        <section className={styles.blank}>
          <CustomDivider />
          {formData.blankList.map(blank => (
            <React.Fragment key={blank.id}>
              <Blank
                id={blank.id}
                amount={blank.amount}
                price={blank.price}
                itemName={blank.description}
                taxValue={blank.tax || 0}
                discountAmount={blank.discount}
                allTaxes={inputData.tax}
                discountType={blank.discountType}
                totalPrice={blank.total}
                currencySymbol={
                  inputData.currency.find(
                    currency => currency.code === formData.currency,
                  )?.info.symbol || ''
                }
                onRemove={() => removeBlank(blank.id)}
                onChange={(name, value) =>
                  handleBlankInputChange(blank.id, name, value)
                }
              />
              <CustomDivider />
            </React.Fragment>
          ))}
        </section>
      ) : (
        <div className={styles.wrapperBlankLoadingSpinner}>
          <LoadingSpinner size='xl' />
        </div>
      )}
      <section className={styles.buttonsBlank}>
        <ButtonBlue
          titleNone
          title='Add Blank'
          icon='/icons/plus.svg'
          iconProps={styles.buttonAddIcon}
          style={styles.buttonAddNew}
          onClick={addBlank}
        />
        <ButtonBlue
          titleNone
          title='Add Product or Service'
          icon='/icons/searchWhite.svg'
          iconProps={styles.buttonSearchIcon}
          style={styles.buttonAddProduct}
          onClick={handleOpenCloseProductService}
        />
      </section>
      <section className={styles.calculations}>
        <Item title='Sub Total' value={formData.blankCalc?.price} />
        <Item title='Discount' value={formData.blankCalc?.discount} />
        <Item title='Tax' value={formData.blankCalc?.tax} />
        <Item title='Total' value={formData.blankCalc?.total} />
      </section>
      <section className={styles.footerTextEditor}>
        <TextEditor
          defaultValue={formData.notes}
          setValue={message => handleChangeInput('notes', message)}
        />
      </section>
      <AddProductOrService
        modalOpen={modalProductService}
        serviceList={inputData.service}
        addEditServiceBlank={addServiceBlank}
        handleOpenCloseModal={handleOpenCloseProductService}
      />
    </div>
  )
}
