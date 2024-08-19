import { Textarea } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { ViewSummaryTypeData } from '../../../../../app/constants/constants'
import { AccountingItem } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/AccountingItem/AccountingItem'
import { InfoItem } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/InfoItem/InfoItem'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSwitch } from '../../../../../shared/ui/CustomSwitch/CustomSwitch'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './SummaryPage.module.scss'

export const AdminContactSummaryPage: FC = () => {
  const [profileInfo, setProfileInfo] = useState<ViewSummaryTypeData | null>(
    null,
  )

  const id = useOutletContext<number>()

  const getInfoProfile = async () => {
    const getResponse = await getSelectedTypeInfo(id, 'summary')

    setProfileInfo(getResponse.data)
  }

  const onChangeInput = (
    name: string,
    value: string | number | boolean | null | undefined,
  ) => {
    console.log(name, value)
  }

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChangeInput('nameText', event.target.value)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Summary'
  }, [])

  useEffect(() => {
    getInfoProfile()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {profileInfo ? (
        <RecentCard>
          <div className={styles.wrapperContainer}>
            <div className={styles.wrapperInfo}>
              <div className={styles.infoContainer}>
                <div>
                  <InfoItem title='Full Name: ' value={profileInfo.account} />
                  <InfoItem title='Company Name:' value={profileInfo.company} />
                  <InfoItem title='Email:' value={profileInfo.email} />
                  <InfoItem title='Phone:' value={profileInfo.phone} />
                  <InfoItem title='Address:' value={profileInfo.address} />
                  <InfoItem title='City:' value={profileInfo.city} />
                  <InfoItem title='State/Region:' value={profileInfo.state} />
                  <InfoItem title='ZIP/Postal Code:' value={profileInfo.zip} />
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
                Balance: {profileInfo.balance}
              </h5>
              <div className={styles.balanceButtons}>
                <ButtonBlue title='Add Fund' style={styles.buttonBalance} />
                <ButtonBlue
                  title='Return Fund'
                  style={`${styles.buttonReturnFund} ${styles.buttonBalance}`}
                />
              </div>
            </div>
            <div className={styles.autoLoginWrapper}>
              <CustomInput
                title='Auto Login URL'
                id='autoLogin'
                name='autoLogin'
                value={profileInfo.autologin || ''}
                type='text'
                onChange={onChangeInput}
              />
              <div className={styles.interactURL}>
                <span className={styles.loginCustomerText}>
                  Login As Customer
                </span>
                <span className={styles.miniDivider}>|</span>
                <span className={styles.revokeCustomerText}>
                  Revoke Auto Login
                </span>
                <span className={styles.miniDivider}>|</span>
                <span className={styles.reGenerateCustomerText}>
                  Re Generate URL
                </span>
              </div>
            </div>
            <div className={styles.accountingSummaryWrapper}>
              <h5 className={styles.accountingTitle}>Accounting Summary</h5>
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
    </div>
  )
}
