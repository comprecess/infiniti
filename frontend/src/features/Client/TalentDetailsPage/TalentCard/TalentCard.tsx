import { FC, useEffect, useState } from 'react'

import { TalentData } from '../../../../app/constants/constants'
import { InfoIcon } from '../../../../shared/icons/InfoIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { TalentsLevel } from '../../../../shared/ui/TalentsLevel/TalentsLevel'
import { Item } from '../../../../widgets/TalentsCard/Footer/Item/Item'
import { ModalWindow } from '../ModalWindow/ModalWindow'
import styles from './TalentCard.module.scss'

type OrientationDivider = 'vertical' | 'horizontal'

interface TalentCardProps {
  talent: TalentData
}

export const TalentCard: FC<TalentCardProps> = ({ talent }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [modalWidth, setModalWidth] = useState<string>('800px')
  const [dividerOrientation, setDividerOrientation] =
    useState<OrientationDivider>('vertical')

  const handleOpenCloseModal = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768

      if (isMobileView) {
        setModalWidth('400px')
        setDividerOrientation('horizontal')
      } else {
        setModalWidth('800px')
        setDividerOrientation('vertical')
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.avatarName}>
          <img
            src={talent.img ? talent.img : '/profileWithoutAvatar.svg'}
            alt='Avatar'
            className={styles.avatar}
          />
          <span className={styles.name}>{talent.name}</span>
          <div className={styles.level}>
            <TalentsLevel title={talent.level} />
          </div>
        </div>
        <div className={styles.available}>
          <InfoIcon fill={styles.infoIcon} />
          <span className={styles.availableText}>
            Will be available: next week
          </span>
        </div>
        <div className={styles.rates}>
          <Item title={talent.priceDay} description='Daily rate (8h)' />
          <Item title={talent.priceHour} description='Hourly rate' />
        </div>
        <ButtonBlue title='Add to order' onClick={handleOpenCloseModal} />
        <div className={styles.taxes}>
          <img src='/icons/info.svg' alt='Info' />
          <span className={styles.taxesText}>Taxes included</span>
        </div>
        <ButtonBrand title='Show similar' />
      </div>
      <CustomModalWindow
        maxWidth={modalWidth}
        isOpen={isOpen}
        onClose={handleOpenCloseModal}
      >
        <ModalWindow
          dividerOrientation={dividerOrientation}
          talent={talent}
          onClose={handleOpenCloseModal}
        />
      </CustomModalWindow>
    </>
  )
}
