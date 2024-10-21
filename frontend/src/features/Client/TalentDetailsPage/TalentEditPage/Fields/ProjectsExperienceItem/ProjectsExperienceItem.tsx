import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'

import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import styles from './ProjectsExperienceItem.module.scss'

export const ProjectsExperienceItem: FC = () => {
  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Company'
        type='number'
        id='company'
        name='company'
        onChange={() => {}}
      />
      <CustomInput
        title='Position'
        type='number'
        id='position'
        name='position'
        onChange={() => {}}
      />
      <CustomInput
        title='Period'
        type='number'
        id='period'
        name='period'
        onChange={() => {}}
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
        />
      </div>
    </div>
  )
}
