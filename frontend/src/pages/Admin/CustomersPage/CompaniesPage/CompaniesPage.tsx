import { useQuery, useQueryClient } from '@tanstack/react-query'
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
  const [filteredCompanies, setFilteredCompanies] = useState<
    CompaniesListProps[] | null
  >(null)

  const [selectedCompanyId, setSelectedCompanyId] = useState<
    number | null
  >(null)

  const [modalNewCompany, setModalNewCompany] = useState<boolean>(false)
  const [modalEditCompany, setModalEditCompany] = useState<boolean>(false)
  const [modalCompanyInfo, setModalCompanyInfo] = useState<boolean>(false)

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
  const queryClient = useQueryClient()

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

  const handleInputChange = (name: string, value: string | number) => {
    setCompanyData(prevState => ({
      ...prevState,
      [name]: value,
    }))
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

  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response: {
        access: RolesAccess
        data: CompaniesListProps[]
      } = await getCompaniesList()

      return response
    },
    staleTime: 5000,
  })

  const handleSearchChange = (searchItem: string) => {
    if (companiesData) {
      const filtered = companiesData.data.filter(company =>
        company.name.toLowerCase().includes(searchItem.toLowerCase()),
      )

      setFilteredCompanies(filtered)
    }
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
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      handleOpenCloseModalNewCompany()
    } else {
      showToast({
        title: 'Error',
        description: createResponse.message,
        status: 'error',
      })
    }
  }

  const deleteSelectedCompany = async (id: number) => {
    const deleteResponse = await deleteCompany(id)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the company',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      reloadSearchFilter()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
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
      queryClient.invalidateQueries({ queryKey: ['companies'] })
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

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {companiesData ? (
          <RecentCard
            title='Companies'
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            headerProps={{ searchChange: handleSearchChange }}
            Component={
              companiesData.access.create ? ButtonBlue : undefined
            }
            componentProps={
              companiesData.access.create
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
              access={companiesData.access}
              deleteCompany={deleteSelectedCompany}
              editCompany={loadCompanyInfoEdit}
              infoCompany={loadViewCompany}
              companiesList={
                filteredCompanies && filteredCompanies.length > 0
                  ? filteredCompanies
                  : companiesData.data
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
    </div>
  )
}
