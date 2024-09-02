import { FC } from 'react'

import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomRadio } from '../../../../../../shared/ui/CustomRadio/CustomRadio'
import { CustomSelect } from '../../../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../../../shared/ui/TextEditor/TextEditor'
import styles from './Blank.module.scss'

interface BlankProps {
  onChange: (name: string, value: string | number) => void
  onRemove: () => void
}

export const Blank: FC<BlankProps> = ({ onChange, onRemove }) => {
  const handleOnInputChange = (name: string, value: string | number) => {
    onChange(name, value)
  }

  const handleOnTextEditorChange = (message: string) => {
    onChange('itemName', message)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.sectionSecond}>
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Item Name</span>
            <TextEditor setValue={handleOnTextEditorChange} />
          </div>
        </section>
        <section className={styles.sectionFirst}>
          <CustomInput
            title='Qty'
            type='number'
            id='qty'
            name='qty'
            onChange={handleOnInputChange}
          />
          <CustomInput
            title='Price'
            type='number'
            id='price'
            name='price'
            onChange={handleOnInputChange}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Discount</span>
            <div className={styles.discountContainer}>
              <CustomRadio
                radioList={['%', '₽']}
                defaultValue='%'
                onChange={function (_value: string): void {
                  throw new Error('Function not implemented.')
                }}
              />
              <CustomInput
                type='number'
                id='discount'
                name='discount'
                onChange={handleOnInputChange}
              />
            </div>
          </div>
          <CustomSelect
            title='Tax'
            titleOnChange=''
            value=''
            selectedList={[]}
            onChange={() => {}}
          />
          <CustomInput
            readOnly
            title='Total'
            type='number'
            id='total'
            name='total'
            onChange={() => {}}
          />
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
