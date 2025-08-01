import { Textarea } from '@chakra-ui/react'
import { Fragment, useEffect, useState } from 'react'

import {
  BlankCalc,
  SalesBlankData,
  SalesEditOfferData,
  SalesNewInvoicePriceCalcProps,
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
import { postOfferPriceCalc } from '../../../../../shared/utils/api/Admin/Sales/NewOffer/PostOfferPriceCalc'
import { AddProductOrService } from '../../../Sales/AddProductOrService/AddProductOrService'
import { Blank } from '../../../Sales/EditOffer/Blank/Blank'
import { TotalItem } from '../../../Sales/NewOfferPage/Fields/TotalItem/TotalItem'
import styles from './Fields.module.scss'

interface FieldsProps {
  data: SalesEditOfferData
  inputData: SalesOfferInputData
  token?: string | null
  onFormDataChange: (data: Partial<InfoData>) => void
}

interface InfoData {
  id: number
  blankList: SalesBlankData[]
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
  token: string | null
}

export interface PartialFieldsCartToOfferData extends Partial<InfoData> {
  [key: string]:
  | string
  | number
  | SalesBlankData[]
  | BlankCalc
  | boolean
  | undefined
  | null
}

export const Fields = ({
  data,
  token,
  inputData,
  onFormDataChange,
}: FieldsProps) => {
  const [formData, setFormData] = useState<PartialFieldsCartToOfferData>({
    token,
    subject: data.subject,
    offerNum: data.offerNum,
    num: data.num,
    clientId: data.client?.id,
    stage: data.stage,
    dateCreated: data.dateCreated,
    validUntil: data.validUntil,
    proposal: data.proposal,
    notes: data.notes,
    checkPublic: data.checkPublic,
    blankCalc: data.blankCalc,
    blankList:
      data.blank &&
      data.blank.map(item => ({
        ...item,
        tax:
          item.tax && typeof item.tax === 'object'
            ? (item.tax as SalesNewInvoiceTaxProps).id
            : null,
      })),
  })

  const [priceCalc, setPriceCalc] =
    useState<SalesNewInvoicePriceCalcProps | null>(null)

  const [modalProductService, setModalProductService] =
    useState<boolean>(false)

  const handleOpenCloseProductService = () => {
    setModalProductService(prev => !prev)
  }

  const handleChangeInput = (
    field: string,
    value: string | number | SalesBlankData[] | boolean | undefined | null,
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

    const postResponse = await postOfferPriceCalc({
      blankList,
    })

    setPriceCalc(postResponse)
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

  const handleRemoveBlank = (id: number) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      blankList: (prevFormData.blankList || []).filter(
        blank => blank.index !== id,
      ),
    }))
  }

  const clientAddress =
    inputData.client?.find(client => client.id === formData.clientId)
      ?.address || ''

  const isLoadBlank =
    formData.blankList && formData.blankList.length > 0 && priceCalc?.data

  useEffect(() => {
    onFormDataChange(formData)
  }, [formData, onFormDataChange])

  useEffect(() => {
    if (!formData.blankList) return

    if (formData.blankList?.length > 0) {
      postPriceCalc()
    }
  }, [formData.blankList])

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
      {formData.blankList && isLoadBlank && (
        <section className={styles.blank}>
          <CustomDivider />
          {formData.blankList.map(blank => (
            <Fragment key={blank.index}>
              <Blank
                id={blank.index}
                amount={blank.amount}
                price={blank.price}
                itemName={blank.description}
                taxValue={blank.tax || 0}
                discountAmount={blank.discount}
                allTaxes={inputData.tax}
                discountType={blank.discountType}
                totalPrice={
                  priceCalc.data &&
                  priceCalc.data[blank.index]?.total !== undefined
                    ? priceCalc.data[blank.index].total
                    : 0
                }
                onRemove={() => handleRemoveBlank(blank.index)}
                onChange={(name, value) =>
                  handleBlankChange(blank.index, name, value)
                }
              />
              <CustomDivider />
            </Fragment>
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
        <div className={styles.totalList}>
          <TotalItem title='Sub Total' value={priceCalc?.result?.price} />
          <TotalItem
            title='Discount'
            value={priceCalc?.result?.discount}
          />
          <TotalItem title='Tax' value={priceCalc?.result?.tax} />
          <TotalItem title='Total' value={priceCalc?.result?.total} />
        </div>
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
        addNewServiceBlank={handleAddServiceBlank}
        handleOpenCloseModal={handleOpenCloseProductService}
      />
    </div>
  )
}
