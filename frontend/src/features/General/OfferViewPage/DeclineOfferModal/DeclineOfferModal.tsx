import { Textarea } from '@chakra-ui/react'
import { useState } from 'react'

import styles from './DeclineOfferModal.module.scss'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'

interface DeclineOfferModalProps {
  modalDecline: boolean
  handleOpenCloseModal: () => void
  decline: (stage: 'Accepted' | 'Decline', message?: string) => void
}

export const DeclineOfferModal = ({
  modalDecline,
  handleOpenCloseModal,
  decline,
}: DeclineOfferModalProps) => {
  const [formData, setFormData] = useState<{
    message?: string
  }>({})

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleDecline = () => {
    decline('Decline', formData.message)
  }

  return (
    <CustomModalWindow
      maxWidth={'400px'}
      isOpen={modalDecline}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.input}>
        <div className={styles.header}>
          <h4 className={styles.title}>
            Why did you decide to decline the Offer?
          </h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.containerInputs}>
          <div className={styles.textAreaWrapper}>
            <span className={styles.textAreaTitle}>Message</span>
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
              onChange={e => {
                handleInputChange('message', e.target.value)
              }}
            />
          </div>
        </div>
        <div className={styles.containerButtons}>
          <ButtonBrand title='Cancel' onClick={handleOpenCloseModal} />
          <ButtonBlue
            title='Decline'
            style={styles.declineButton}
            onClick={handleDecline}
          />
        </div>
      </div>
    </CustomModalWindow>
  )
}
