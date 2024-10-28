import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'

import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import styles from './ProjectsExperienceItem.module.scss'

interface ProjectsExperienceItemProps {
  onChange: (name: string, value: string | number) => void
  onRemove: () => void
}

export const ProjectsExperienceItem: FC<ProjectsExperienceItemProps> = ({
  onChange,
  onRemove,
}) => {
  const handleOnInputChange = (name: string, value: string | number) => {
    onChange(name, value)
  }

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChange('responsibilities', event.target.value)
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Company'
        type='string'
        id='name'
        name='name'
        onChange={handleOnInputChange}
      />
      <CustomInput
        title='Position'
        type='string'
        id='position'
        name='position'
        onChange={handleOnInputChange}
      />
      <CustomDataPicker
        title='Period From'
        titleOnChange='periodFrom'
        onChange={handleOnInputChange}
      />
      <CustomDataPicker
        title='Period To'
        titleOnChange='periodTo'
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
          onClick={onRemove}
        />
      </div>
    </div>
  )
}
