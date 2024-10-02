import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { FC } from 'react'

import { EmailIcon } from '../../../../../shared/icons/EmailIcon'
import { FlagIcon } from '../../../../../shared/icons/FlagIcon'
import { MessageIcon } from '../../../../../shared/icons/MessageIcon'
import { PDFIcon } from '../../../../../shared/icons/PDFIcon'
import styles from './Buttons.module.scss'

interface ButtonsProps {
  stageList: string[]
  blockEditButton: boolean
  previewOffer: () => void
}

export const Buttons: FC<ButtonsProps> = ({
  stageList,
  blockEditButton,
  previewOffer,
}) => {
  return (
    <div className={styles.wrapper}>
      <Menu isLazy>
        <MenuButton
          className={styles.menuButton}
          width='56px'
          height='36px'
          transition='all 0.2s'
          _hover={{ bg: 'mint.400' }}
          _expanded={{ bg: 'mint.400' }}
          borderRadius='8px'
          padding='12px'
          bg='mint.500'
          as={IconButton}
          icon={<EmailIcon style={styles.flagIcon} />}
        />
        <MenuList>
          <MenuItem onClick={() => {}}>Offer Created</MenuItem>
        </MenuList>
      </Menu>
      <Menu isLazy>
        <MenuButton
          className={styles.menuButton}
          width='56px'
          height='36px'
          transition='all 0.2s'
          _hover={{ bg: 'mint.400' }}
          _expanded={{ bg: 'mint.400' }}
          borderRadius='8px'
          padding='12px'
          bg='mint.500'
          as={IconButton}
          icon={<MessageIcon style={styles.flagIcon} />}
        />
        <MenuList>
          <MenuItem onClick={() => {}}>Offer Created</MenuItem>
          <MenuItem onClick={() => {}}>Offer Accepted</MenuItem>
          <MenuItem onClick={() => {}}>Offer Cancelled</MenuItem>
        </MenuList>
      </Menu>
      <Menu isLazy>
        <MenuButton
          className={styles.menuButton}
          width='56px'
          height='36px'
          transition='all 0.2s'
          _hover={{ bg: 'cherry.400' }}
          _expanded={{ bg: 'cherry.400' }}
          borderRadius='8px'
          padding='12px'
          bg='cherry.500'
          as={IconButton}
          icon={<PDFIcon style={styles.flagIcon} />}
        />
        <MenuList>
          <MenuItem onClick={() => {}}>View PDF</MenuItem>
          <MenuItem onClick={() => {}}>Download PDF</MenuItem>
        </MenuList>
      </Menu>
      <Menu isLazy>
        <MenuButton
          className={styles.menuButton}
          width='56px'
          height='36px'
          transition='all 0.2s'
          _hover={{ bg: 'brand.400' }}
          _expanded={{ bg: 'brand.400' }}
          borderRadius='8px'
          padding='12px'
          bg='brand.500'
          as={IconButton}
          icon={<FlagIcon style={styles.flagIcon} />}
        />
        <MenuList>
          {stageList &&
            stageList.map((stage, index) => {
              return (
                <MenuItem key={`${stage}-${index}`} onClick={() => {}}>
                  {stage}
                </MenuItem>
              )
            })}
        </MenuList>
      </Menu>
      <button className={styles.buttonPreview} onClick={previewOffer}>
        <img
          src='/icons/fileWhite.svg'
          alt='Preview'
          className={styles.icon}
        />
      </button>
      {!blockEditButton && (
        <button className={styles.buttonEdit}>
          <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
        </button>
      )}
      <button className={styles.buttonConvert}>
        <img
          src='/icons/fileMove.svg'
          alt='Convert'
          className={styles.icon}
        />
      </button>
    </div>
  )
}
