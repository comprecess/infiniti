import { Textarea } from '@chakra-ui/react'
import { ChangeEvent } from 'react'

import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import styles from './ProjectsExperienceItem.module.scss'

interface ProjectsExperienceItemProps {
  company: string
  position: string
  periodFrom: string
  periodTo: string
  responsibilities: string
  removeBlock: () => void
  onChange: (name: string, value: string | number) => void
}

export const ProjectsExperienceItem = ({
  company,
  position,
  periodFrom,
  periodTo,
  responsibilities,
  removeBlock,
  onChange,
}: ProjectsExperienceItemProps) => {
  const handleOnInputChange = (name: string, value: string | number) => {
    onChange(name, value)
  }

  const handleTextAreaChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChange('responsibilities', event.target.value)
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Company'
        type='text'
        id='name'
        name='name'
        value={company}
        onChange={handleOnInputChange}
      />
      <CustomInput
        title='Position'
        type='text'
        id='position'
        name='position'
        value={position}
        onChange={handleOnInputChange}
      />
      <CustomDataPicker
        title='Period From'
        titleOnChange='periodFrom'
        value={periodFrom}
        onChange={handleOnInputChange}
      />
      <CustomDataPicker
        title='Period To'
        titleOnChange='periodTo'
        value={periodTo}
        onChange={handleOnInputChange}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          Responsibilities
        </span>
        <Textarea
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
          value={responsibilities}
          onChange={handleTextAreaChange}
        />
      </div>
      <div className={styles.buttonRemove}>
        <ButtonBlue
          titleNone
          title='Delete Experience'
          icon='/icons/trash.svg'
          iconProps={styles.buttonIcon}
          style={styles.buttonDeleteBlank}
          onClick={removeBlock}
        />
      </div>
    </div>
  )
}
