import { FC, useEffect, useState } from 'react'

import {
  CompaniesListProps,
  CompanyData,
} from '../../../../app/constants/constants'
import { ModalWindowCompany } from '../../../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompany/ModalWindowCompany'
import { RecentCompanies } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/RecentCompanies'
import { SearchAndButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/SearchAndButtons/SearchAndButtons'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { createNewCompany } from '../../../../shared/utils/api/Companies/CreateNewCompany'
import { deleteCompany } from '../../../../shared/utils/api/Companies/DeleteCompany'
import { editCompany } from '../../../../shared/utils/api/Companies/EditCompany'
import { getCompaniesList } from '../../../../shared/utils/api/Companies/GetCompanies'
import { getCompany } from '../../../../shared/utils/api/Companies/GetCompany'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CompaniesPage.module.scss'

export const AdminCompaniesPage: FC = () => {
  const [companies, setCompanies] = useState<CompaniesListProps[]>([])

  const [selectedCompanyId, setSelectedCompanyId] = useState<
    number | null
  >(null)

  const [modalNewCompany, setModalNewCompany] = useState<boolean>(false)
  const [modalEditCompany, setModalEditCompany] = useState<boolean>(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false)

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    logo: '',
    code: '',
    address: '',
    businessNumber: '',
    city: '',
    url: '',
    state: '',
    email: '',
    zip: '',
    phone: '',
    country: '',
  })

  const showToast = useCustomToast()

  const handleOpenCloseModalNewCompany = () => {
    setModalNewCompany(!modalNewCompany)
  }

  const handleOpenCloseModalEditCompany = () => {
    setModalEditCompany(!modalEditCompany)
  }

  const handleOpenConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen)
  }

  const confirmDeleteCompany = (id: number) => {
    setSelectedCompanyId(id)
    setIsConfirmationModalOpen(true)
  }

  const handleInputChange = (name: string, value: string | number) => {
    setCompanyData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const getCompanies = async () => {
    const companiesResponse = await getCompaniesList()

    setCompanies(companiesResponse)
  }

  const filterEmptyFields = (data: CompanyData): Partial<CompanyData> => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (
        key !== 'id' &&
        value !== '' &&
        value !== false &&
        value !== null
      ) {
        acc[key as keyof CompanyData] = value
      }

      return acc
    }, {} as Partial<CompanyData>)
  }

  const loadCompanyInfo = async (id: number) => {
    const companyResponse: CompanyData = await getCompany(id)

    const filteredData = filterEmptyFields(companyResponse)

    setCompanyData(prevState => ({
      ...prevState,
      ...filteredData,
    }))
    setSelectedCompanyId(id)
    handleOpenCloseModalEditCompany()
  }

  const createCompany = async () => {
    const filteredData = filterEmptyFields(companyData)
    const createResponse = await createNewCompany(filteredData)

    if (createResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new company',
        status: 'success',
      })
      getCompanies()
      handleOpenCloseModalNewCompany()
    } else {
      showToast({
        title: 'Error',
        description: 'Error when creating a company',
        status: 'error',
      })
    }
  }

  const deleteSelectedCompany = async () => {
    if (selectedCompanyId === null) return

    const deleteResponse = await deleteCompany(selectedCompanyId)

    if (deleteResponse) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the company',
        status: 'success',
      })
      getCompanies()
    } else {
      showToast({
        title: 'Error',
        description: 'Error when deleting company',
        status: 'error',
      })
    }

    handleOpenConfirmationModal()
  }

  const editSelectedCompany = async () => {
    if (selectedCompanyId === null) return

    const editResponse = await editCompany(selectedCompanyId, companyData)

    if (editResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed your company details',
        status: 'success',
      })
      getCompanies()
      handleOpenCloseModalEditCompany()
    } else {
      showToast({
        title: 'Error',
        description: editResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Companies'
  }, [])

  useEffect(() => {
    getCompanies()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {companies?.length > 0 ? (
          <RecentCard
            title='Companies'
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            Component={ButtonBlue}
            componentProps={{
              title: 'New Company',
              titleNone: true,
              icon: '/icons/plus.svg',
              iconProps: styles.icon,
              style: styles.blueButton,
              onClick: handleOpenCloseModalNewCompany,
            }}
          >
            <RecentCompanies
              companiesList={companies}
              deleteCompany={confirmDeleteCompany}
              editCompany={loadCompanyInfo}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
      <ModalWindowCompany
        nameWindow='New Company'
        modalCompany={modalNewCompany}
        handleOpenCloseModal={handleOpenCloseModalNewCompany}
        functionCompany={createCompany}
        handleInputChange={handleInputChange}
      />
      <ModalWindowCompany
        nameWindow='Edit Company'
        modalCompany={modalEditCompany}
        values={companyData}
        handleOpenCloseModal={handleOpenCloseModalEditCompany}
        functionCompany={editSelectedCompany}
        handleInputChange={handleInputChange}
      />
      <ConfirmationModal
        isOpened={isConfirmationModalOpen}
        handleOpenCloseModal={handleOpenConfirmationModal}
        agree={deleteSelectedCompany}
      />
    </div>
  )
}
