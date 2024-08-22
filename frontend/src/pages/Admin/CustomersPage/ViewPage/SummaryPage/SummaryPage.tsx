import { Textarea } from '@chakra-ui/react'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  SummaryPageUpdateInfo,
  ViewPageContext,
  ViewSummaryTypeData,
} from '../../../../../app/constants/constants'
import { AccountingItem } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/AccountingItem/AccountingItem'
import { AddFundModal } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/AddFundModal/AddFundModal'
import { InfoItem } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/InfoItem/InfoItem'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomSwitch } from '../../../../../shared/ui/CustomSwitch/CustomSwitch'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { updateAllInfo } from '../../../../../shared/utils/api/Admin/ViewContact/Summary/UpdateAllInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './SummaryPage.module.scss'

export interface PartialFieldsPostData
  extends Partial<SummaryPageUpdateInfo> {
  [key: string]: string | boolean | undefined | number | null
}

export const AdminContactSummaryPage: FC = () => {
  const [profileInfo, setProfileInfo] =
    useState<ViewSummaryTypeData | null>(null)
  const [updateInfo, setUpdateInfo] = useState<PartialFieldsPostData>({})

  const [addFundModal, setAddFundModal] = useState<boolean>(false)
  const [returnFundModal, setReturnFundModal] = useState<boolean>(false)

  const context = useOutletContext<ViewPageContext>()
  const showToast = useCustomToast()
  const timerRef = useRef<number | null>(null)

  const openCloseAddFundModal = () => {
    setAddFundModal(!addFundModal)
  }

  const openCloseReturnFundModal = () => {
    setReturnFundModal(!returnFundModal)
  }

  const getInfoProfile = useCallback(async () => {
    const getResponse = await getSelectedTypeInfo(
      context.idClient,
      'summary',
    )
    setProfileInfo(getResponse.data)
  }, [context.idClient])

  const updateData = useCallback(async () => {
    const updateResponse = await updateAllInfo(
      context.idClient,
      'summary',
      updateInfo,
    )

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed your information',
        status: 'success',
      })
      getInfoProfile()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }, [updateInfo])

  const changeToBooleanInt = (item: boolean): number => {
    return item === true ? 1 : 0
  }

  const onChangeInput = (
    name: string,
    value: string | boolean | undefined | number | null,
  ) => {
    if (typeof value === 'boolean') {
      value = changeToBooleanInt(value)
    }

    if (name === 'notes') {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = window.setTimeout(() => {
        setUpdateInfo(prev => ({
          ...prev,
          [name]: value as string,
        }))
      }, 2500)
    } else {
      setUpdateInfo(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const addInformationSeparately = async (name: string, value: string) => {
    const updateResponse = await updateAllInfo(
      context.idClient,
      'summary',
      { [name]: value },
    )

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed your information',
        status: 'success',
      })
      getInfoProfile()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChangeInput('notes', event.target.value)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Summary'
  }, [])

  useEffect(() => {
    getInfoProfile()
  }, [context.idClient])

  useEffect(() => {
    if (Object.keys(updateInfo).length > 0) {
      updateData()
    }
  }, [updateInfo, updateData])

  return (
    <div className={styles.wrapper}>
      {profileInfo ? (
        <RecentCard>
          <div className={styles.wrapperContainer}>
            <div className={styles.wrapperInfo}>
              <div className={styles.infoContainer}>
                <div>
                  <InfoItem
                    title='Full Name: '
                    value={profileInfo.account}
                  />
                  <InfoItem
                    title='Company Name:'
                    value={profileInfo.company}
                  />
                  <InfoItem title='Email:' value={profileInfo.email} />
                  <InfoItem title='Phone:' value={profileInfo.phone} />
                  <InfoItem title='Address:' value={profileInfo.address} />
                  <InfoItem title='City:' value={profileInfo.city} />
                  <InfoItem
                    title='State/Region:'
                    value={profileInfo.state}
                  />
                  <InfoItem
                    title='ZIP/Postal Code:'
                    value={profileInfo.zip}
                  />
                  <InfoItem title='Country:' value={profileInfo.country} />
                  <InfoItem title='Tags:' value={profileInfo.tags} />
                  <InfoItem title='Group:' value={profileInfo.group} />
                </div>
                <div className={styles.customFieldsWrapper}>
                  <div className={styles.customFieldsContainer}>
                    <div className={styles.primaryContact}>
                      <span className={styles.primaryContactText}>
                        Primary Contact?
                      </span>
                      <CustomSwitch
                        titleOnChange='primaryContact'
                        isChecked={
                          profileInfo.primaryContact === 0 ? false : true
                        }
                        onChange={onChangeInput}
                      />
                    </div>
                    <div>
                      {profileInfo.customFields.map(item => {
                        return (
                          <InfoItem
                            key={item.id}
                            title={item.name}
                            value={item.value}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <Textarea
                    maxHeight='250px'
                    maxWidth='400px'
                    defaultValue={profileInfo.notes}
                    placeholder='Contact Notes...'
                    focusBorderColor='#1b1e29'
                    borderColor='#1b1e29'
                    color='gray.400'
                    backgroundColor='brand.800'
                    border='1px solid #1b1e29'
                    _hover={{ borderColor: '#1b1e29' }}
                    fontSize='16px'
                    fontWeight='400'
                    lineHeight='24px'
                    onChange={handleTextAreaChange}
                  />
                </div>
              </div>
            </div>
            <div className={styles.balanceContainer}>
              <h5 className={styles.balanceText}>
                Balance:
                {' '}
                {profileInfo.balance}
              </h5>
              <div className={styles.balanceButtons}>
                <ButtonBlue
                  title='Add Fund'
                  style={styles.buttonBalance}
                  onClick={openCloseAddFundModal}
                />
                <ButtonBlue
                  title='Return Fund'
                  style={`${styles.buttonReturnFund} ${styles.buttonBalance}`}
                  onClick={openCloseReturnFundModal}
                />
              </div>
            </div>
            {profileInfo.autologin ? (
              <div className={styles.autoLoginWrapper}>
                <div className={styles.autoLoginURL}>
                  <span className={styles.titleAutoLogin}>
                    Auto Login URL
                  </span>
                  <div className={styles.wrapperAutoLoginLink}>
                    <span className={styles.autoLoginLink}>
                      {profileInfo.autologin}
                    </span>
                  </div>
                </div>
                <div className={styles.interactURL}>
                  <a
                    className={styles.loginCustomerText}
                    target='_blank'
                    href={profileInfo.autologin}
                    rel='noreferrer'
                  >
                    Login As Customer
                  </a>
                  <span className={styles.miniDivider}>|</span>
                  <span
                    className={styles.revokeCustomerText}
                    onClick={() =>
                      addInformationSeparately('autologin', '0')
                    }
                  >
                    Revoke Auto Login
                  </span>
                  <span className={styles.miniDivider}>|</span>
                  <span
                    className={styles.reGenerateCustomerText}
                    onClick={() =>
                      addInformationSeparately('autologin', '1')
                    }
                  >
                    Re Generate URL
                  </span>
                </div>
              </div>
            ) : (
              <span
                className={styles.createAutoLogin}
                onClick={() => addInformationSeparately('autologin', '1')}
              >
                Create Auto Login URL
              </span>
            )}
            <div className={styles.accountingSummaryWrapper}>
              <h5 className={styles.accountingTitle}>
                Accounting Summary
              </h5>
              <div className={styles.accountingList}>
                <AccountingItem
                  title='Total Income'
                  value={profileInfo.totalProfit}
                  color={styles.totalIncomeColor}
                />
                <AccountingItem
                  title='Total Expense'
                  value={profileInfo.totalExpense}
                  color={styles.totalExpenseColor}
                />
                <AccountingItem
                  title='Profit'
                  value={profileInfo.amount}
                  color={styles.profitColor}
                />
              </div>
            </div>
          </div>
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
      <AddFundModal
        title='Add Fund'
        name='addAmount'
        buttonTitle='Add'
        modalAddFund={addFundModal}
        handleOpenCloseModal={openCloseAddFundModal}
        onSendValue={addInformationSeparately}
      />
      <AddFundModal
        title='Return Fund'
        name='returnAmount'
        buttonTitle='Return'
        modalAddFund={returnFundModal}
        handleOpenCloseModal={openCloseReturnFundModal}
        onSendValue={addInformationSeparately}
      />
    </div>
  )
}
