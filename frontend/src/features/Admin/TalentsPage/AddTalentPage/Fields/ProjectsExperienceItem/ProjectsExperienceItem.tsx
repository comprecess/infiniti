import { Textarea } from '@chakra-ui/react'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomMiniButton } from '../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styles from './ProjectsExperienceItem.module.scss'

interface ProjectsExperienceItemProps {
  onChange: (name: string, value: string | number) => void
  onRemove: () => void
}

export const ProjectsExperienceItem = ({
  onChange,
  onRemove,
}: ProjectsExperienceItemProps) => {
  const { t } = useTranslation()

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
        title={`${t('admin-project-experience-item-input-1')}`}
        type='string'
        id='name'
        name='name'
        onChange={handleOnInputChange}
      />
      <CustomInput
        title={`${t('admin-project-experience-item-input-2')}`}
        type='string'
        id='position'
        name='position'
        onChange={handleOnInputChange}
      />
      <CustomDataPicker
        title={`${t('admin-project-experience-item-input-3')}`}
        titleOnChange='periodFrom'
        onChange={handleOnInputChange}
      />
      <CustomDataPicker
        title={`${t('admin-project-experience-item-input-4')}`}
        titleOnChange='periodTo'
        onChange={handleOnInputChange}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-project-experience-item-input-5')}`}
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
        <CustomMiniButton
          icon='/icons/trash.svg'
          style='cherry'
          alt='Delete'
          tooltipTitle='Delete'
          onClick={onRemove}
        />
      </div>
    </div>
  )
}
