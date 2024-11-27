import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from '@chakra-ui/react'
import { FC } from 'react'

import { EmailIcon } from '../../../../../shared/icons/EmailIcon'
import { FlagIcon } from '../../../../../shared/icons/FlagIcon'
import { MessageIcon } from '../../../../../shared/icons/MessageIcon'
import { PDFIcon } from '../../../../../shared/icons/PDFIcon'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styles from './Buttons.module.scss'

interface ButtonsProps {
  stageList: string[]
  blockEditButton: boolean
  previewOffer: () => void
  editOffer: () => void
  email: (template: string) => void
  selectPDF: (name: string) => void
  convertToInvoice: () => void
  selectStage: (stage: string) => void
}

export const Buttons: FC<ButtonsProps> = ({
  stageList,
  blockEditButton,
  previewOffer,
  editOffer,
  email,
  selectPDF,
  convertToInvoice,
  selectStage,
}) => {
  return (
    <div className={styles.wrapper}>
      <Menu isLazy>
        <Tooltip
          label='Send Email'
          openDelay={100}
          closeDelay={100}
          bg='#010102'
          borderRadius='8px'
        >
          <MenuButton
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
        </Tooltip>
        <MenuList>
          <MenuItem onClick={() => email('offer-create')}>
            Offer Created
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu isLazy>
        <Tooltip
          label='Send SMS'
          openDelay={100}
          closeDelay={100}
          bg='#010102'
          borderRadius='8px'
        >
          <MenuButton
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
        </Tooltip>
        <MenuList>
          <MenuItem onClick={() => {}}>Offer Created</MenuItem>
          <MenuItem onClick={() => {}}>Offer Accepted</MenuItem>
          <MenuItem onClick={() => {}}>Offer Cancelled</MenuItem>
        </MenuList>
      </Menu>
      <Menu isLazy>
        <Tooltip
          label='View or Download PDF'
          openDelay={100}
          closeDelay={100}
          bg='#010102'
          borderRadius='8px'
        >
          <MenuButton
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
        </Tooltip>
        <MenuList>
          <MenuItem onClick={() => selectPDF('View PDF')}>
            View PDF
          </MenuItem>
          <MenuItem onClick={() => selectPDF('Download PDF')}>
            Download PDF
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu isLazy>
        <Tooltip
          label='Change Status'
          openDelay={100}
          closeDelay={100}
          bg='#010102'
          borderRadius='8px'
        >
          <MenuButton
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
        </Tooltip>
        <MenuList>
          {stageList &&
            stageList.map((stage, index) => {
              return (
                <MenuItem
                  key={`${stage}-${index}`}
                  onClick={() => selectStage(stage)}
                >
                  {stage}
                </MenuItem>
              )
            })}
        </MenuList>
      </Menu>
      <CustomMiniButton
        style='cherry'
        icon='/icons/fileWhite.svg'
        alt='Preview'
        tooltipTitle='Preview'
        onClick={previewOffer}
      />
      {!blockEditButton && (
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
          onClick={editOffer}
        />
      )}
      <CustomMiniButton
        style='blue'
        icon='/icons/fileMove.svg'
        alt='Convert to Invoice'
        tooltipTitle='Convert to Invoice'
        onClick={convertToInvoice}
      />
    </div>
  )
}
