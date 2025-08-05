import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

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
import { deleteCompany } from '../../../../shared/utils/api/Admin/Companies/delete-company'
import { getCompaniesList } from '../../../../shared/utils/api/Admin/Companies/get-companies-list'
import { getCompany } from '../../../../shared/utils/api/Admin/Companies/get-company'
import { getCompanyInputData } from '../../../../shared/utils/api/Admin/Companies/get-company-input-data'
import { postCreateNewCompany } from '../../../../shared/utils/api/Admin/Companies/post-create-new-company'
import { putUpdateCompanyInfo } from '../../../../shared/utils/api/Admin/Companies/put-update-company-info'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CompaniesPage.module.scss'

export const AdminCompaniesPage = () => {
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
  const [inputData, setInputData] = useState<{ code: string } | null>(null)

  const { roles } = useOutletContext<{
    roles?: { [key: string]: RolesAccess }
  }>()

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

  const getInputData = async () => {
    const response = await getCompanyInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await getCompaniesList()

      if (!response.status) return

      return response.data as {
        access: RolesAccess
        data: CompaniesListProps[]
      }
    },
    placeholderData: previousData => previousData,
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
    const response = await getCompany(id)

    if (!response.status) return

    setCompanyData(prevState => ({
      ...prevState,
      ...response.data,
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
    const response = await postCreateNewCompany(filteredData)

    if (response.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new company',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      getInputData()
      handleOpenCloseModalNewCompany()
    } else {
      showToast({
        title: 'Error',
        description: response.message,
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

    const editResponse = await putUpdateCompanyInfo(
      selectedCompanyId,
      companyData,
    )

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
    getInputData()

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
      {inputData && (
        <ModalWindowCompany
          nameWindow='New Company'
          inputData={inputData}
          modalCompany={modalNewCompany}
          handleOpenCloseModal={handleOpenCloseModalNewCompany}
          functionCompany={createCompany}
          handleInputChange={handleInputChange}
        />
      )}
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
          roles={roles}
          id={selectedCompanyId}
          modalOpen={modalCompanyInfo}
          handleOpenCloseModal={handleOpenCloseModalCompanyInfo}
          openEditModal={handleOpenEditInView}
        />
      )}
    </div>
  )
}
