import { Textarea } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'

import {
  SalesBlankData,
  SalesNewInvoiceFormData,
  SalesNewInvoiceInputData,
  SalesNewInvoicePriceCalcProps,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import { postInvoicePriceCalc } from '../../../../../shared/utils/api/Admin/Sales/NewInvoice/PostInvoicePriceCalc'
import { AddProductOrService } from '../../AddProductOrService/AddProductOrService'
import { Blank } from './Blank/Blank'
import styles from './Fields.module.scss'
import { Item } from './Item/Item'

interface FieldsProps {
  data: SalesNewInvoiceInputData
  onFormDataChange: (data: Partial<SalesNewInvoiceFormData>) => void
}

export interface PartialFieldsPostData
  extends Partial<SalesNewInvoiceFormData> {
  [key: string]:
  | string
  | number
  | SalesBlankData[]
  | boolean
  | undefined
  | null
}

export const Fields: FC<FieldsProps> = ({ data, onFormDataChange }) => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({
    invoiceNum: data.invoiceNum,
    num: data.num,
    status: data.status[0],
    checkPublic: 1,
    currency: data.currency.find(currency => currency.isdefault === 1)
      ?.code,
    blankList: [
      {
        index: 0,
        service: 'calc',
        description: '',
        amount: 0,
        price: 0,
        discount: 0,
        discountType: 'percent',
        tax: 1,
      },
    ],
    notes: data.notes,
  })

  const [priceCalc, setPriceCalc] =
    useState<SalesNewInvoicePriceCalcProps | null>(null)

  const [modalProductService, setModalProductService] =
    useState<boolean>(false)

  const handleOpenCloseProductService = () => {
    setModalProductService(!modalProductService)
  }

  const postPriceCalc = async () => {
    const blankList = (formData.blankList || []).map(blank => ({
      serviceId: blank.serviceId,
      id: blank.id,
      service: blank.service,
      amount: blank.amount,
      price: blank.price,
      tax: blank.tax,
      discount: blank.discount,
      discountType: blank.discountType,
    }))

    const currency = formData.currency || ''

    const postResponse = await postInvoicePriceCalc({
      blankList,
      currency,
    })

    setPriceCalc(postResponse)
  }

  const handleChangeInput = (
    field: string,
    value: string | number | SalesBlankData[] | boolean | undefined | null,
  ) => {
    if (field === 'currency' && typeof value === 'number') {
      const currencyData = data.currency.find(
        currency => currency.id === value,
      )
      value = currencyData ? currencyData.code : ''
    } else if (field === 'status' && typeof value === 'number') {
      value = data.status[value]
    } else if (
      (field === 'dueDate' || field === 'repeat') &&
      typeof value === 'number'
    ) {
      if (value === 0) {
        value = null
      } else {
        value = value - 1
      }
    } else if (field === 'clientId' && typeof value === 'number') {
      if (value === 0) {
        value = null
      } else {
        value = data.client[value - 1].id
      }
    } else if (field === 'checkPublic' && typeof value === 'boolean') {
      value = value === true ? 1 : 0
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  const handleAddBlank = () => {
    setFormData(prevFormData => {
      const newId = prevFormData.blankList?.length || 0

      const newBlank: SalesBlankData = {
        index: newId,
        service: 'calc',
        description: '',
        amount: 0,
        price: 0,
        discount: 0,
        discountType: 'percent',
        tax: 1,
      }

      return {
        ...prevFormData,
        blankList: [...(prevFormData.blankList || []), newBlank],
      }
    })
  }

  const handleAddServiceBlank = (
    idService: string,
    price: number,
    description: string,
  ) => {
    setFormData(prevFormData => {
      const newId = prevFormData.blankList?.length || 0

      const newBlank: SalesBlankData = {
        index: newId,
        serviceId: parseInt(idService),
        service: 'serviceProduct',
        description,
        amount: 0,
        price,
        discount: 0,
        discountType: 'percent',
        tax: 1,
      }

      return {
        ...prevFormData,
        blankList: [...(prevFormData.blankList || []), newBlank],
      }
    })
  }

  const handleBlankChange = (
    id: number,
    field: string,
    value: string | number | undefined,
  ) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      blankList: (prevFormData.blankList || []).map(blank =>
        blank.index === id ? { ...blank, [field]: value } : blank,
      ),
    }))
  }

  const handleRemoveBlank = (id: number) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      blankList: (prevFormData.blankList || []).filter(
        blank => blank.index !== id,
      ),
    }))
  }

  useEffect(() => {
    if (!formData.blankList) return

    if (formData.blankList?.length > 0) {
      postPriceCalc()
    }
  }, [formData.blankList, formData.currency])

  useEffect(() => {
    onFormDataChange(formData)
  }, [formData, onFormDataChange])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.section}>
          <CustomInput
            title='Title'
            type='text'
            id='title'
            name='title'
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
              value={
                data.client.find(client => client.id === formData.clientId)
                  ?.address
              }
            />
          </div>
          <CustomInput
            title='Invoice Prefix'
            type='text'
            id='invoiceNum'
            name='invoiceNum'
            value={data.invoiceNum}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Invoice #'
            type='text'
            id='num'
            name='num'
            value={data.num}
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Invoice Date'
            onChange={handleChangeInput}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Hide Info</span>
            <CustomCheckBox
              defaultChecked
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
            idList={data.client.map((_client, index) => index + 1)}
            nameList={data.client.map(client =>
              `${client.account}${
                client.email ? ` - ${client.email}` : ''
              }`.trim(),
            )}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Status'
            titleOnChange='status'
            value={0}
            idList={data.status.map((_status, index) => index)}
            nameList={data.status.map(status => status)}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Currency'
            titleOnChange='currency'
            idList={data.currency.map(currency => currency.id)}
            nameList={data.currency.map(currency => currency.code)}
            value={
              data.currency.find(currency => currency.isdefault === 1)?.id
            }
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Receipt Number'
            type='text'
            id='receiptNumber'
            name='receiptNumber'
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Show quantity as'
            type='text'
            id='showQuantity'
            name='showQuantity'
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Payment Terms'
            titleOnChange='dueDate'
            placeholder='None'
            idList={data.dueDate.map((_dueDate, index) => index + 1)}
            nameList={data.dueDate.map(date => date)}
            onChange={handleChangeInput}
          />
          <CustomSelect
            title='Repeat Every'
            titleOnChange='repeat'
            placeholder='None'
            idList={data.repeat.map((_repeat, index) => index + 1)}
            nameList={data.repeat.map(date => date)}
            onChange={handleChangeInput}
          />
        </section>
      </div>
      {formData.blankList && priceCalc?.data && (
        <section className={styles.blank}>
          <CustomDivider />
          {formData.blankList.map(blank => (
            <React.Fragment key={blank.index}>
              <Blank
                id={blank.index}
                amount={blank.amount}
                price={blank.price}
                itemName={blank.description}
                discountAmount={blank.discount}
                taxInput={data.tax}
                totalPrice={
                  priceCalc.data &&
                  priceCalc.data[blank.index]?.total !== undefined
                    ? priceCalc.data[blank.index].total
                    : 0
                }
                currencySymbol={
                  data.currency.find(
                    currency => currency.code === formData.currency,
                  )?.info.symbol || ''
                }
                onRemove={() => handleRemoveBlank(blank.index)}
                onChange={(field, value) =>
                  handleBlankChange(blank.index, field, value)
                }
              />
              <CustomDivider />
            </React.Fragment>
          ))}
        </section>
      )}
      <section className={styles.buttonsBlank}>
        <ButtonBlue
          titleNone
          title='Add Blank'
          icon='/icons/plus.svg'
          iconProps={styles.buttonAddIcon}
          style={styles.buttonAddNew}
          onClick={handleAddBlank}
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
        <Item title='Sub Total' value={priceCalc?.result?.price} />
        <Item title='Discount' value={priceCalc?.result?.discount} />
        <Item title='Tax' value={priceCalc?.result?.tax} />
        <Item title='Total' value={priceCalc?.result?.total} />
      </section>
      <section className={styles.footerTextEditor}>
        <TextEditor
          defaultValue={data.notes}
          setValue={message => handleChangeInput('notes', message)}
        />
      </section>
      <AddProductOrService
        modalOpen={modalProductService}
        serviceList={data.service}
        addNewServiceBlank={handleAddServiceBlank}
        handleOpenCloseModal={handleOpenCloseProductService}
      />
    </div>
  )
}
