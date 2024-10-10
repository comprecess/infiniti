import { FC, useEffect, useState } from 'react'

import {
  CompaniesListProps,
  CompanyData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { ModalWindowCompany } from '../../../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompany/ModalWindowCompany'
import { ModalWindowCompanyInfo } from '../../../../features/Admin/CustomersPage/CompaniesPage/ModalWindowCompanyInfo/ModalWindowCompanyInfo'
import { RecentCompanies } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/RecentCompanies'
import { SearchAndButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/SearchAndButtons/SearchAndButtons'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { createNewCompany } from '../../../../shared/utils/api/Admin/Companies/CreateNewCompany'
import { deleteCompany } from '../../../../shared/utils/api/Admin/Companies/DeleteCompany'
import { editCompany } from '../../../../shared/utils/api/Admin/Companies/EditCompany'
import { getCompaniesList } from '../../../../shared/utils/api/Admin/Companies/GetCompanies'
import { getCompany } from '../../../../shared/utils/api/Admin/Companies/GetCompany'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CompaniesPage.module.scss'

export const AdminCompaniesPage: FC = () => {
  const [companies, setCompanies] = useState<CompaniesListProps[] | null>(
    null,
  )
  const [filteredCompanies, setFilteredCompanies] = useState<
  CompaniesListProps[] | null
  >(null)

  const [selectedCompanyId, setSelectedCompanyId] = useState<
  number | null
  >(null)

  const [modalNewCompany, setModalNewCompany] = useState<boolean>(false)
  const [modalEditCompany, setModalEditCompany] = useState<boolean>(false)
  const [modalCompanyInfo, setModalCompanyInfo] = useState<boolean>(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false)

  const [access, setAccess] = useState<RolesAccess | null>(null)

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

  const handleOpenCloseModalCompanyInfo = () => {
    if (modalCompanyInfo) {
      setSelectedCompanyId(null)
    }

    setModalCompanyInfo(!modalCompanyInfo)
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

  const handleSearchChange = (searchItem: string) => {
    if (companies === null) return

    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchItem.toLowerCase()),
    )
    setFilteredCompanies(filtered)
  }

  const reloadSearchFilter = () => {
    setFilteredCompanies(prevFilteredCompanies =>
      prevFilteredCompanies
        ? prevFilteredCompanies.filter(
          company => company.id !== selectedCompanyId,
        )
        : [],
    )
  }

  const getCompanies = async () => {
    const companiesResponse: {
      access: RolesAccess
      data: CompaniesListProps[]
    } = await getCompaniesList()

    setAccess(companiesResponse.access)
    setCompanies(companiesResponse.data)
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

    setCompanyData(prevState => ({
      ...prevState,
      ...companyResponse,
    }))
  }

  const loadCompanyInfoEdit = async (id: number) => {
    await loadCompanyInfo(id)
    setSelectedCompanyId(id)
    handleOpenCloseModalEditCompany()
  }

  const handleOpenEditInView = async (id: number) => {
    await loadCompanyInfoEdit(id)
  }

  const loadViewCompany = (id: number) => {
    setSelectedCompanyId(id)
    handleOpenCloseModalCompanyInfo()
  }

  const createCompany = async () => {
    const filteredData = filterEmptyFields(companyData)
    const createResponse = await createNewCompany(filteredData)

    if (createResponse.status) {
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
        description: createResponse.message,
        status: 'error',
      })
    }
  }

  const deleteSelectedCompany = async () => {
    if (selectedCompanyId === null) return

    const deleteResponse = await deleteCompany(selectedCompanyId)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the company',
        status: 'success',
      })
      getCompanies()
      reloadSearchFilter()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
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
        {companies && access ? (
          <RecentCard
            title='Companies'
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            headerProps={{ searchChange: handleSearchChange }}
            Component={access.create ? ButtonBlue : undefined}
            componentProps={
              access.create
                ? {
                  title: 'New Company',
                  titleNone: true,
                  icon: '/icons/plus.svg',
                  iconProps: styles.icon,
                  style: styles.blueButton,
                  onClick: handleOpenCloseModalNewCompany,
                }
                : undefined
            }
          >
            <RecentCompanies
              access={access}
              deleteCompany={confirmDeleteCompany}
              editCompany={loadCompanyInfoEdit}
              infoCompany={loadViewCompany}
              companiesList={
                filteredCompanies && filteredCompanies.length > 0
                  ? filteredCompanies
                  : companies
              }
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
      {selectedCompanyId && (
        <ModalWindowCompanyInfo
          id={selectedCompanyId}
          modalOpen={modalCompanyInfo}
          handleOpenCloseModal={handleOpenCloseModalCompanyInfo}
          openEditModal={handleOpenEditInView}
        />
      )}
      <ConfirmationModal
        isOpened={isConfirmationModalOpen}
        handleOpenCloseModal={handleOpenConfirmationModal}
        agree={deleteSelectedCompany}
      />
    </div>
  )
}
