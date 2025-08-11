import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from '@chakra-ui/react'

import { RolesAccess } from '../../../../../app/constants/constants'
import { EmailIcon } from '../../../../../shared/icons/EmailIcon'
import { FlagIcon } from '../../../../../shared/icons/FlagIcon'
import { MessageIcon } from '../../../../../shared/icons/MessageIcon'
import { PDFIcon } from '../../../../../shared/icons/PDFIcon'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styles from './Buttons.module.scss'

interface ButtonsProps {
  statusList: string[]
  blockEditButton: boolean
  roles?: { [key: string]: RolesAccess }
  editInvoice: () => void
  previewInvoice: () => void
  selectPDF: (name: string) => void
  selectStatus: (status: string) => void
  email: (template: string) => void
}

export const Buttons = ({
  statusList,
  blockEditButton,
  roles,
  editInvoice,
  previewInvoice,
  selectPDF,
  selectStatus,
  email,
}: ButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      <Menu isLazy>
        <Tooltip
          label='Send Email'
          openDelay={100}
          closeDelay={100}
          color='white'
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
        <Tooltip
          label='Send SMS'
          openDelay={100}
          closeDelay={100}
          color='white'
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
      {roles && roles.sales.view === 0 ? (
        <div style={{ display: 'none' }} />
      ) : (
        <Menu isLazy>
          <Tooltip
            label='View or Download PDF'
            openDelay={100}
            closeDelay={100}
            color='white'
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
      )}
      {roles && roles.sales.edit === 0 ? (
        <div style={{ display: 'none' }} />
      ) : (
        <Menu isLazy>
          <Tooltip
            label='Change Status'
            openDelay={100}
            closeDelay={100}
            color='white'
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
      )}
      {roles && roles.sales.edit === 0 ? (
        <div style={{ display: 'none' }} />
      ) : (
        <CustomMiniButton
          style='gray'
          icon='/icons/addWallet.svg'
          alt='Add Payment'
          tooltipTitle='Add Payment'
        />
      )}
      {roles && roles.sales.view === 0 ? (
        <div style={{ display: 'none' }} />
      ) : (
        <CustomMiniButton
          style='cherry'
          icon='/icons/fileWhite.svg'
          alt='Preview'
          tooltipTitle='Preview'
          onClick={previewInvoice}
        />
      )}
      {blockEditButton || (roles && roles.sales.edit === 0) ? (
        <div style={{ display: 'none' }} />
      ) : (
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
          onClick={editInvoice}
        />
      )}
      {roles && roles.sales.edit === 0 ? (
        <div style={{ display: 'none' }} />
      ) : (
        <CustomMiniButton
          style='gray'
          icon='/icons/paperClip.svg'
          alt='Attach a Document'
          tooltipTitle='Attach a Document'
        />
      )}
      {roles && roles.sales.create === 0 ? (
        <div style={{ display: 'none' }} />
      ) : (
        <CustomMiniButton
          style='blue'
          icon='/icons/clone.svg'
          alt='Clone'
          tooltipTitle='Clone'
        />
      )}
    </div>
  )
}
