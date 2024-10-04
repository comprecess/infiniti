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
  statusList: string[]
  blockEditButton: boolean
  editInvoice: () => void
  previewInvoice: () => void
  selectPDF: (name: string) => void
  selectStatus: (status: string) => void
  email: (template: string) => void
}

export const Buttons: FC<ButtonsProps> = ({
  statusList,
  blockEditButton,
  editInvoice,
  previewInvoice,
  selectPDF,
  selectStatus,
  email,
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
          <MenuItem onClick={() => email('invoice-create')}>
            Invoice Created
          </MenuItem>
          <MenuItem onClick={() => email('reminder')}>
            Invoice Payment Reminder
          </MenuItem>
          <MenuItem onClick={() => email('overdue')}>
            Invoice Overdue Notice
          </MenuItem>
          <MenuItem onClick={() => email('confirm')}>
            Invoice Payment Confirmation
          </MenuItem>
          <MenuItem onClick={() => email('refund')}>
            Invoice Refund Confirmation
          </MenuItem>
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
          <MenuItem onClick={() => {}}>Invoice Created</MenuItem>
          <MenuItem onClick={() => {}}>Invoice Payment Reminder</MenuItem>
          <MenuItem onClick={() => {}}>Invoice Overdue Notice</MenuItem>
          <MenuItem onClick={() => {}}>
            Invoice Payment Confirmation
          </MenuItem>
          <MenuItem onClick={() => {}}>
            Invoice Refund Confirmation
          </MenuItem>
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
          <MenuItem onClick={() => selectPDF('View PDF')}>
            View PDF
          </MenuItem>
          <MenuItem onClick={() => selectPDF('Download PDF')}>
            Download PDF
          </MenuItem>
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
          {statusList.map((status, index) => {
            return (
              <MenuItem
                key={`${status}-${index}`}
                onClick={() => selectStatus(status)}
              >
                {status}
              </MenuItem>
            )
          })}
        </MenuList>
      </Menu>
      <button className={styles.buttonAddPayment}>
        <img
          src='/icons/addWallet.svg'
          alt='AddPayment'
          className={styles.icon}
        />
      </button>
      <button className={styles.buttonPreview} onClick={previewInvoice}>
        <img
          src='/icons/fileWhite.svg'
          alt='Preview'
          className={styles.icon}
        />
      </button>
      {!blockEditButton && (
        <button className={styles.buttonEdit} onClick={editInvoice}>
          <img src='/icons/edit.svg' alt='Edit' className={styles.icon} />
        </button>
      )}
      <button className={styles.buttonPaperClip}>
        <img
          src='/icons/paperClip.svg'
          alt='PaperClip'
          className={styles.icon}
        />
      </button>
      <button className={styles.buttonClone}>
        <img src='/icons/clone.svg' alt='Clone' className={styles.icon} />
      </button>
    </div>
  )
}
