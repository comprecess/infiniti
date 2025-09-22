import styles from './ModalWindowCompany.module.scss'
import { CompanyData } from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ClearStorageButton } from '../../../../../shared/ui/ClearStorageButton/ClearStorageButton'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CountryList } from '../../../../../widgets/ProfileChangeInfoCard/CountryList/CountryList'

interface ModalWindowCompanyProps {
  nameWindow: string
  modalCompany: boolean
  values?: CompanyData
  storageKey?: string
  isClearButton?: boolean
  companyData?: CompanyData
  inputData?: { code: string }
  handleOpenCloseModal: () => void
  functionCompany: () => void
  handleInputChange: (name: string, value: string | number) => void
}

export const ModalWindowCompany = ({
  nameWindow,
  modalCompany,
  isClearButton,
  values,
  inputData,
  companyData,
  storageKey,
  handleOpenCloseModal,
  functionCompany,
  handleInputChange,
}: ModalWindowCompanyProps) => {
  return (
    <CustomModalWindow
      maxWidth='800px'
      isOpen={modalCompany}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>{nameWindow}</h4>
          {storageKey && isClearButton && (
            <ClearStorageButton
              isClearButton={isClearButton}
              storageKey={storageKey}
            />
          )}
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.containers}>
          <div className={styles.leftContainer}>
            <CustomInput
              title='Company Name'
              type='text'
              id='name'
              name='name'
              value={values?.name || companyData?.name || ''}
              onChange={handleInputChange}
            />
            <CustomInput
              title='Code'
              type='text'
              id='code'
              name='code'
              value={values?.code || inputData?.code}
              onChange={handleInputChange}
            />
            <CustomInput
              title='Business Number'
              type='text'
              id='businessNumber'
              name='businessNumber'
              value={
                values?.businessNumber || companyData?.businessNumber || ''
              }
              onChange={handleInputChange}
            />
            <CustomInput
              title='URL'
              type='text'
              id='url'
              name='url'
              placeHolder='http://'
              value={values?.url || companyData?.url || ''}
              onChange={handleInputChange}
            />
            <CustomInput
              title='Email'
              type='email'
              id='email'
              name='email'
              value={values?.email || companyData?.email || ''}
              onChange={handleInputChange}
            />
            <CustomInput
              title='Phone'
              type='text'
              id='phone'
              name='phone'
              value={values?.phone || companyData?.phone || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.rightContainer}>
            <CustomInput
              title='Logo URL'
              type='text'
              id='logo'
              name='logo'
              value={values?.logo || companyData?.logo || ''}
              onChange={handleInputChange}
            />
            <CustomInput
              title='Address'
              type='text'
              id='address'
              name='address'
              value={values?.address || companyData?.address || ''}
              onChange={handleInputChange}
            />
            <CustomInput
              title='City'
              type='text'
              id='city'
              name='city'
              value={values?.city || companyData?.city || ''}
              onChange={handleInputChange}
            />
            <CustomInput
              title='State/Region'
              type='text'
              id='state'
              name='state'
              value={values?.state || companyData?.state || ''}
              onChange={handleInputChange}
            />
            <CustomInput
              title='ZIP/Postal Code'
              type='text'
              id='zip'
              name='zip'
              value={values?.zip || companyData?.zip || ''}
              onChange={handleInputChange}
            />
            <CountryList
              country={values?.country || ''}
              countryKey={companyData?.country}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <ButtonBlue
          title='Save'
          style={styles.buttonSave}
          onClick={functionCompany}
        />
      </div>
    </CustomModalWindow>
  )
}
