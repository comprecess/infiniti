import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'

import { SettingsCustomFieldsProps } from '../../../../../app/constants/constants'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './CustomField.module.scss'

interface CustomFiledProps {
  input: SettingsCustomFieldsProps
  onChange: (name: string, value: string) => void
}

export const CustomField: FC<CustomFiledProps> = ({ input, onChange }) => {
  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChange(input.name, event.target.value)
  }

  return (
    <div className={styles.wrapper}>
      {input.type === 'textBox' && (
        <CustomInput
          title={input.name}
          type='text'
          id={input.name}
          name={input.name}
          onChange={onChange}
        />
      )}
      {input.type === 'password' && (
        <CustomInput
          title={input.name}
          type='password'
          id={input.name}
          name={input.name}
          onChange={onChange}
        />
      )}
      {input.type === 'dropDown' && (
        <CustomSelect
          title={input.name}
          titleOnChange={input.name}
          placeholder='None'
          selectedList={
            input.fieldOptions ? Object.values(input.fieldOptions) : []
          }
          onChange={onChange}
        />
      )}
      {input.type === 'textArea' && (
        <div className={styles.textAreaWrapper}>
          <span className={styles.textAreaTitle}>{input.name}</span>
          <Textarea
            maxHeight='285px'
            focusBorderColor='#1b1e29'
            borderColor='#1b1e29'
            color='gray.400'
            backgroundColor='brand.800'
            border='1px solid #1b1e29'
            _hover={{ borderColor: '#1b1e29' }}
            fontSize='16px'
            fontWeight='400'
            lineHeight='24px'
            onChange={handleTextAreaChange}
          />
        </div>
      )}
      {input.description && (
        <span className={styles.description}>{input.description}</span>
      )}
    </div>
  )
}
