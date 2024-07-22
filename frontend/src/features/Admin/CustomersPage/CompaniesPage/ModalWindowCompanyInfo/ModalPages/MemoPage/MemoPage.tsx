import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'

import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './MemoPage.module.scss'

export const MemoPage: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Textarea
        maxHeight='278px'
        focusBorderColor='#1b1e29'
        borderColor='#1b1e29'
        border='1px solid #1b1e29'
        _hover={{ borderColor: '#1b1e29' }}
        fontSize='14px'
        lineHeight='20px'
      />
      <ButtonBlue title='Save' style={styles.buttonBlue} />
    </div>
  )
}
