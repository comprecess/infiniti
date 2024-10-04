import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TalentData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { ChevronDownIcon } from '../../../../shared/icons/ChevronDownIcon'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { InfoIcon } from '../../../../shared/icons/InfoIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { Input } from '../../../../shared/ui/FromTo/Input/Input'
import { TalentsLevel } from '../../../../shared/ui/TalentsLevel/TalentsLevel'
import { addOrderToCart } from '../../../../shared/utils/api/Client/Cart/AddOrderToCart'
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
  const [item, setItem] = useState<string>('priceHour')
  const [unit, setUnit] = useState<string>('Hours (h)')
  const [total, setTotal] = useState<string>('0 €')
  const [amount, setAmount] = useState<number>(0)

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const formatNumberWithSpaces = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleItemClick = (selectedItem: string) => {
    if (selectedItem === 'priceHour') {
      setUnit('Hours (h)')
    } else if (selectedItem === 'priceDay') {
      setUnit('Days')
    }

    setItem(selectedItem)
  }

  const handleContinueSearch = useCallback(() => {
    navigate(`/${Routes.clientPages}/${Routes.talents}`)
  }, [navigate])

  const handleSetAmount = useCallback(() => {
    if (amount > 0) {
      let totalAmount = 0

      if (item === 'priceHour') {
        setUnit('Hours (h)')
        totalAmount = amount * parseInt(talent.priceHour)
      } else if (item === 'priceDay') {
        setUnit('Days')
        totalAmount = amount * parseInt(talent.priceDay)
      }

      setTotal(formatNumberWithSpaces(totalAmount) + ' €')
    } else {
      setTotal('0 €')
    }
  }, [amount, item])

  const handleAmountChange = useCallback((number: string) => {
    const amount = parseInt(number)

    setAmount(amount)
  }, [])

  const handleAddOrderToCart = async () => {
    if (amount > 0) {
      const addResponse = await addOrderToCart(talent.id, amount, item)

      if (addResponse.status) {
        showToast({
          title: 'Successfully',
          description: 'You have successfully added to cart',
          status: 'success',
        })
      } else {
        showToast({
          title: 'Error',
          description: addResponse.message,
          status: 'error',
        })
      }

      onClose()
    }
  }

  useEffect(() => {
    handleSetAmount()
  }, [item, amount, handleSetAmount])

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
            onChange={e => handleAmountChange(e.target.value)}
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
              {unit}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleItemClick('priceHour')}>
                Hours (h)
              </MenuItem>
              <MenuItem onClick={() => handleItemClick('priceDay')}>
                Days
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className={styles.total}>
          <span className={styles.totalTitle}>Total</span>
          <h4 className={styles.totalPrice}>{total}</h4>
        </div>
        <ButtonBlue title='Add to order' onClick={handleAddOrderToCart} />
        <ButtonBrand
          title='Continue search'
          onClick={handleContinueSearch}
        />
      </div>
    </div>
  )
}
