import { Textarea } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  SummaryPageUpdateInfo,
  ViewPageContext,
  ViewSummaryTypeData,
} from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { AccountingItem } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/AccountingItem/AccountingItem'
import { AddFundModal } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/AddFundModal/AddFundModal'
import { InfoItem } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/InfoItem/InfoItem'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomSwitch } from '../../../../../shared/ui/CustomSwitch/CustomSwitch'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/get-selected-type-info'
import { updateAllInfo } from '../../../../../shared/utils/api/Admin/ViewContact/Summary/put-update-full-info'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './SummaryPage.module.scss'

const extractTokenFromUrl = (url: string): string | null => {
  const regex = /\/autologin\/([^/]+)$/
  const match = url.match(regex)

  return match ? match[1] : null
}

const generateAutoLoginUrl = (autologin: string | null) => {
  const domain = import.meta.env.VITE_MAIN_DOMAIN
  const token = extractTokenFromUrl(autologin || '')

  return `${domain}/${Routes.public}/${Routes.auto}/${Routes.login}/${token}`
}

export interface PartialFieldsPostData
  extends Partial<SummaryPageUpdateInfo> {
  [key: string]: string | boolean | undefined | number | null
}

export const AdminContactSummaryPage = () => {
  const [updateInfo, setUpdateInfo] = useState<PartialFieldsPostData>({})

  const [addFundModal, setAddFundModal] = useState<boolean>(false)
  const [returnFundModal, setReturnFundModal] = useState<boolean>(false)

  const context = useOutletContext<ViewPageContext>()
  const showToast = useCustomToast()
  const timerRef = useRef<number | null>(null)
  const queryClient = useQueryClient()

  const openCloseAddFundModal = () => {
    setAddFundModal(!addFundModal)
  }

  const openCloseReturnFundModal = () => {
    setReturnFundModal(!returnFundModal)
  }

  const { data: profileInfo } = useQuery({
    queryKey: ['profile', context.idClient],
    queryFn: async () => {
      const response = await getSelectedTypeInfo(
        context.idClient,
        'summary',
      )

      if (!response.status) return

      return response.data as { data: ViewSummaryTypeData }
    },
    placeholderData: previousData => previousData,
  })

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
      queryClient.invalidateQueries({ queryKey: ['profile'] })
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
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  const handleTextAreaChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChangeInput('notes', event.target.value)
  }

  const navigateToAutoLogin = (autologin: string) => {
    window.open(autologin, '_blank')
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Summary'
  }, [])

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
                    title='Full Name'
                    value={profileInfo.data.account}
                  />
                  <InfoItem
                    title='Company Name'
                    value={profileInfo.data.company}
                  />
                  <InfoItem title='Email' value={profileInfo.data.email} />
                  <InfoItem title='Phone' value={profileInfo.data.phone} />
                  <InfoItem
                    title='Address'
                    value={profileInfo.data.address}
                  />
                  <InfoItem title='City' value={profileInfo.data.city} />
                  <InfoItem
                    title='State/Region'
                    value={profileInfo.data.state}
                  />
                  <InfoItem
                    title='ZIP/Postal Code'
                    value={profileInfo.data.zip}
                  />
                  <InfoItem
                    title='Country'
                    value={profileInfo.data.country}
                  />
                  <InfoItem title='Tags' value={profileInfo.data.tags} />
                  <InfoItem title='Group' value={profileInfo.data.group} />
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
                          profileInfo.data.primaryContact === 0
                            ? false
                            : true
                        }
                        onChange={onChangeInput}
                      />
                    </div>
                    <div>
                      {profileInfo.data.customFields.map(item => {
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
                  {context.roles && context.roles.customers.edit === 0 ? (
                    <div style={{ display: 'none' }} />
                  ) : (
                    <Textarea
                      maxHeight='250px'
                      maxWidth='400px'
                      defaultValue={profileInfo.data.notes}
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
                  )}
                </div>
              </div>
            </div>
            <div className={styles.balanceContainer}>
              <h5 className={styles.balanceText}>
                {`Balance: ${profileInfo.data.balance}`}
              </h5>
              {context.roles && context.roles.customers.edit === 0 ? (
                <div style={{ display: 'none' }} />
              ) : (
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
              )}
            </div>
            {profileInfo.data.autologin !== null ? (
              <div className={styles.autoLoginWrapper}>
                <div className={styles.autoLoginURL}>
                  <span className={styles.titleAutoLogin}>
                    Auto Login URL
                  </span>
                  <div className={styles.wrapperAutoLoginLink}>
                    <span className={styles.autoLoginLink}>
                      {generateAutoLoginUrl(profileInfo.data.autologin)}
                    </span>
                  </div>
                </div>
                <div className={styles.interactURL}>
                  <span
                    className={styles.loginCustomerText}
                    onClick={() =>
                      navigateToAutoLogin(
                        generateAutoLoginUrl(profileInfo.data.autologin),
                      )
                    }
                  >
                    Login As Customer
                  </span>
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
                  value={profileInfo.data.totalProfit}
                  color={styles.totalIncomeColor}
                />
                <AccountingItem
                  title='Total Expense'
                  value={profileInfo.data.totalExpense}
                  color={styles.totalExpenseColor}
                />
                <AccountingItem
                  title='Profit'
                  value={profileInfo.data.amount}
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
