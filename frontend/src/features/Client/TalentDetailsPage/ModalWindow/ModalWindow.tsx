import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { FC, useState } from 'react'

import { TalentData } from '../../../../app/constants/constants'
import { ChevronDownIcon } from '../../../../shared/icons/ChevronDownIcon'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { InfoIcon } from '../../../../shared/icons/InfoIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Input } from '../../../../shared/ui/FromTo/Input/Input'
import { TalentsLevel } from '../../../../shared/ui/TalentsLevel/TalentsLevel'
import { Item } from '../../../../widgets/TalentsCard/Footer/Item/Item'
import { TitleCard } from '../TitleCard/TitleCard'
import styles from './ModalWindow.module.scss'

interface ModalWindowProps {
  talent: TalentData
  dividerOrientation: 'horizontal' | 'vertical'
  onClose: () => void
}

export const ModalWindow: FC<ModalWindowProps> = ({
  talent,
  dividerOrientation,
  onClose,
}) => {
  const [item, setItem] = useState<string>('Hours (h)')

  const handleItemClick = (selectedItem: string) => {
    setItem(selectedItem)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.cross} onClick={onClose}>
        <CrossIcon />
      </div>
      <div className={styles.leftItem}>
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
        <div className={styles.taxes}>
          <img src='/icons/info.svg' alt='Info' />
          <span className={styles.taxesText}>Taxes included</span>
        </div>
      </div>
      <CustomDivider orientation={dividerOrientation} />
      <div className={styles.rightItem}>
        <div className={styles.title}>
          <TitleCard title='Add to order' />
          <span className={styles.description}>
            Select quantity of hours/days you needed
          </span>
        </div>
        <div className={styles.inputs}>
          <Input
            placeholder='up to 180'
            style={styles.input}
            tabIndex={-1}
          />
          <Menu isLazy>
            <MenuButton
              className={styles.menuButton}
              display='flex'
              width='100%'
              maxWidth='120px'
              height='48px'
              fontSize='medium'
              fontWeight='small'
              lineHeight='24px'
              transition='all 0.2s'
              _hover={{ bg: 'lightBrand.800' }}
              _expanded={{ bg: 'lightBrand.800' }}
              borderRadius='8px'
              padding='12px'
              color='gray.400'
              bg='brand.800'
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              {`${item}`}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleItemClick('Hours (h)')}>
                Hours (h)
              </MenuItem>
              <MenuItem onClick={() => handleItemClick('Days')}>
                Days
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className={styles.total}>
          <span className={styles.totalTitle}>Total</span>
          <h4 className={styles.totalPrice}>520 €</h4>
        </div>
        <ButtonBlue title='Proceed to checkout' />
        <ButtonBrand title='Continue search' />
      </div>
    </div>
  )
}
