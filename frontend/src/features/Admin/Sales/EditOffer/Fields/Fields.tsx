import { Textarea } from '@chakra-ui/react'
import React, { FC, useEffect, useRef, useState } from 'react'

import {
  BlankCalc,
  SalesBlanks,
  SalesEditInvoiceBlankData,
  SalesEditOfferData,
  SalesNewInvoiceTaxProps,
  SalesOfferInputData,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import { AddProductOrService } from '../../AddProductOrService/AddProductOrService'
import { TotalItem } from '../../NewOfferPage/Fields/TotalItem/TotalItem'
import { Blank } from '../Blank/Blank'
import styles from './Fields.module.scss'

interface FieldsProps {
  data: SalesEditOfferData
  inputData: SalesOfferInputData
  blanks: SalesBlanks
  addBlank: () => void
  addServiceBlank: (idService: string) => void
  removeBlank: (idBlank: number) => void
  updateBlank: (idBlank: number, data: SalesEditInvoiceBlankData) => void
  onFormDataChange: (data: Partial<InfoData>) => void
}

interface InfoData {
  id: number
  blankList: SalesEditInvoiceBlankData[]
  blankCalc: BlankCalc
  code: string
  dateCreated: string
  notes: string
  num: string
  offerNum: string
  proposal: string
  stage: string
  subject: string
  validUntil: string
  checkPublic: number
}

export interface PartialFieldsPostData extends Partial<InfoData> {
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
  inputData,
  blanks,
  addBlank,
  addServiceBlank,
  removeBlank,
  updateBlank,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({
    subject: data.subject,
    offerNum: data.offerNum,
    num: data.num,
    clientId: data.client.id,
    stage: data.stage,
    dateCreated: data.dateCreated,
    validUntil: data.validUntil,
    proposal: data.proposal,
    notes: data.notes,
    checkPublic: data.checkPublic,
    blankCalc: blanks.blankCalc,
    blankList: blanks.blank.map(item => ({
      ...item,
      tax:
        typeof item.tax === 'object'
          ? (item.tax as SalesNewInvoiceTaxProps).id
          : item.tax,
    })),
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

    if (field === 'stage' && typeof value === 'number') {
      updatedValue = inputData.stage[value]
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
            title='Subject'
            type='text'
            id='subject'
            name='subject'
            value={formData.subject}
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
            title='Offer Prefix'
            type='text'
            id='offerNum'
            name='offerNum'
            value={formData.offerNum}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Offer #'
            type='text'
            id='num'
            name='num'
            value={formData.num}
            onChange={handleChangeInput}
          />
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
            title='Stage'
            titleOnChange='stage'
            idList={inputData.stage.map((_stage, index) => index)}
            nameList={inputData.stage}
            value={inputData.stage.findIndex(
              stage => stage === formData.stage,
            )}
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Date Created'
            titleOnChange='dateCreated'
            value={formData.dateCreated}
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Expiry Date'
            titleOnChange='validUntil'
            value={formData.validUntil}
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
      </div>
      {formData.blankList && formData.blankList.length > 0 && (
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
                onRemove={() => removeBlank(blank.id)}
                onChange={(name, value) =>
                  handleBlankInputChange(blank.id, name, value)
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
        <TotalItem title='Sub Total' value={formData.blankCalc?.price} />
        <TotalItem title='Discount' value={formData.blankCalc?.discount} />
        <TotalItem title='Tax' value={formData.blankCalc?.tax} />
        <TotalItem title='Total' value={formData.blankCalc?.total} />
      </section>
      <section className={styles.footerTextEditor}>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>Proposal Text</span>
          <TextEditor
            defaultValue={formData.proposal}
            setValue={message => handleChangeInput('proposal', message)}
          />
        </div>
      </section>
      <section className={styles.footerTextEditor}>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>
            Customer Notes
          </span>
          <TextEditor
            defaultValue={formData.notes}
            setValue={message => handleChangeInput('notes', message)}
          />
        </div>
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
