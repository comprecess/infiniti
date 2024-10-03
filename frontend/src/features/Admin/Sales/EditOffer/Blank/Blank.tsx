import { FC } from 'react'

import { SalesNewInvoiceTaxProps } from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomRadio } from '../../../../../shared/ui/CustomRadio/CustomRadio'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import styles from './Blank.module.scss'

interface BlankProps {
  id: number
  discountAmount: number
  discountType: 'percent' | 'fixed'
  amount: number
  price: number
  itemName: string
  totalPrice: number
  taxValue: number
  allTaxes: SalesNewInvoiceTaxProps[]
  onChange: (name: string, value: string | number) => void
  onRemove: () => void
}

export const Blank: FC<BlankProps> = ({
  id,
  amount,
  discountAmount,
  discountType,
  itemName,
  price,
  totalPrice,
  taxValue,
  allTaxes,
  onChange,
  onRemove,
}) => {
  const handleOnInputChange = (name: string, value: string | number) => {
    onChange(name, value)
  }

  const handleOnTextEditorChange = (message: string) => {
    onChange('description', message)
  }

  const handleDiscountOnChange = (value: string) => {
    onChange('discountType', value === '%' ? 'percent' : 'fixed')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.sectionSecond}>
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Item Name</span>
            <TextEditor
              setValue={handleOnTextEditorChange}
              defaultValue={itemName}
            />
          </div>
        </section>
        <section className={styles.sectionFirst}>
          <CustomInput
            title='Qty'
            type='number'
            id={`${'qty'}-${id}`}
            name={`${'qty'}-${id}`}
            value={amount}
            onInputChange={false}
            onChange={(_name, value) =>
              handleOnInputChange('amount', value)
            }
          />
          <CustomInput
            title='Price'
            type='number'
            id={`${'price'}-${id}`}
            name={`${'price'}-${id}`}
            value={price}
            onInputChange={false}
            onChange={(_name, value) =>
              handleOnInputChange('price', value)
            }
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Discount</span>
            <div className={styles.discountContainer}>
              <CustomRadio
                radioList={['%', 'fix']}
                defaultValue={
                  discountType
                    ? discountType === 'percent'
                      ? '%'
                      : 'fix'
                    : '%'
                }
                onChange={handleDiscountOnChange}
              />
              <CustomInput
                type='number'
                id={`${'discount'}-${id}`}
                name={`${'discount'}-${id}`}
                value={discountAmount}
                onInputChange={false}
                onChange={(_name, value) =>
                  handleOnInputChange('discount', value)
                }
              />
            </div>
          </div>
          <CustomSelect
            title='Tax'
            titleOnChange='tax'
            idList={allTaxes.map(tax => tax.id)}
            nameList={allTaxes.map(tax => tax.name)}
            value={taxValue}
            onInputChange={false}
            onChange={handleOnInputChange}
          />
          <div className={styles.wrapperTotalPrice}>
            <span className={styles.titleTotalPrice}>Total</span>
            <div className={styles.containerTotalPrice}>
              <span className={styles.valueTotalPrice}>{totalPrice}</span>
            </div>
          </div>
        </section>
      </div>
      <div className={styles.buttonRemove}>
        <ButtonBlue
          titleNone
          title='Delete Blank'
          icon='/icons/trash.svg'
          iconProps={styles.buttonIcon}
          style={styles.buttonDeleteBlank}
          onClick={onRemove}
        />
      </div>
    </div>
  )
}
