import { Textarea } from '@chakra-ui/react'
import { Fragment, useEffect, useState } from 'react'

import {
  SalesBlankData,
  SalesNewInvoicePriceCalcProps,
  SalesNewOfferFormData,
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
import { AddProductOrService } from '../../AddProductOrService/AddProductOrService'
import { Blank } from './Blank/Blank'
import styles from './Fields.module.scss'
import { TotalItem } from './TotalItem/TotalItem'

export interface FieldsProps {
  data: SalesOfferInputData
  onFormDataChange: (data: Partial<SalesNewOfferFormData>) => void
}

export interface PartialFieldsNewOfferData
  extends Partial<SalesNewOfferFormData> {
  [key: string]:
  | string
  | number
  | SalesBlankData[]
  | boolean
  | undefined
  | null
}

export const Fields = ({ data, onFormDataChange }: FieldsProps) => {
  const [formData, setFormData] = useState<PartialFieldsNewOfferData>({
    offerNum: data.offerNum,
    num: data.num,
    checkPublic: true,
    stage: data.stage[0],
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

  const handleChangeInput = (
    field: string,
    value: string | number | SalesBlankData[] | boolean | undefined | null,
  ) => {
    if (field === 'stage' && typeof value === 'number') {
      value = data.stage[value]
    } else if (field === 'clientId' && typeof value === 'number') {
      value = value === 0 ? null : data.client[value - 1].id
    } else if (field === 'checkPublic' && typeof value === 'boolean') {
      value = value === true ? 1 : 0
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  useEffect(() => {
    if (!formData.blankList) return

    if (formData.blankList?.length > 0) {
      postPriceCalc()
    }
  }, [formData.blankList])

  useEffect(() => {
    onFormDataChange(formData)
  }, [formData, onFormDataChange])

  const isLoadBlank =
    formData.blankList && formData.blankList.length > 0 && priceCalc?.data

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.section}>
          <CustomInput
            title='Subject'
            type='text'
            id='subject'
            name='subject'
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
            title='Offer Prefix'
            type='text'
            id='offerNum'
            name='offerNum'
            value={data.offerNum}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Offer #'
            type='text'
            id='num'
            name='num'
            value={data.num}
            onChange={handleChangeInput}
          />
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
            title='Stage'
            titleOnChange='stage'
            value={0}
            idList={data.stage.map((_stage, index) => index)}
            nameList={data.stage.map(stage => stage)}
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Date Created'
            titleOnChange='dateCreated'
            onChange={handleChangeInput}
          />
          <CustomDataPicker
            title='Expiry Date'
            titleOnChange='validUntil'
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
                discountAmount={blank.discount}
                taxInput={data.tax}
                totalPrice={
                  priceCalc.data &&
                  priceCalc.data[blank.index]?.total !== undefined
                    ? priceCalc.data[blank.index].total
                    : 0
                }
                onRemove={() => handleRemoveBlank(blank.index)}
                onChange={(field, value) =>
                  handleBlankChange(blank.index, field, value)
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
        <TotalItem title='Sub Total' value={priceCalc?.result?.price} />
        <TotalItem title='Discount' value={priceCalc?.result?.discount} />
        <TotalItem title='Tax' value={priceCalc?.result?.tax} />
        <TotalItem title='Total' value={priceCalc?.result?.total} />
      </section>
      <section className={styles.footerTextEditor}>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>Proposal Text</span>
          <div className={styles.containerEditorDesc}>
            <TextEditor
              setValue={message => handleChangeInput('proposal', message)}
            />
            <span className={styles.editorDesc}>
              Displayed at the Top of the Offer
            </span>
          </div>
        </div>
      </section>
      <section className={styles.footerTextEditor}>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>
            Customer Notes
          </span>
          <div className={styles.containerEditorDesc}>
            <TextEditor
              setValue={message => handleChangeInput('notes', message)}
            />
            <span className={styles.editorDesc}>
              Displayed as a Footer to the Offer
            </span>
          </div>
        </div>
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
