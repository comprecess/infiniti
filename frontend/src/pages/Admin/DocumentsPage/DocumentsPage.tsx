import { useCallback, useEffect, useState } from 'react'

import {
  CustomersFilesData,
  PagesMetaData,
  RolesAccess,
} from '../../../app/constants/constants'
import { AddDocumentModal } from '../../../features/Admin/DocumentsPage/AddDocumentModal/AddDocumentModal'
import { RecentDocuments } from '../../../features/Admin/DocumentsPage/RecentDocuments/RecentDocuments'
import { PagesList } from '../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../shared/ui/Search/Search'
import { deleteDocument } from '../../../shared/utils/api/Admin/Documents/DeleteDocument'
import { postAddNewDocument } from '../../../shared/utils/api/Admin/Documents/PostAddNewDocument'
import { getCustomersFiles } from '../../../shared/utils/api/Admin/Files/GetCustomersFiles'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './DocumentsPage.module.scss'

export const AdminDocumentsPage = () => {
  const [data, setData] = useState<{
    files: CustomersFilesData[]
    meta: PagesMetaData
  } | null>(null)
  const [access, setAccess] = useState<RolesAccess | null>(null)

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(0)
  const [options, setOptions] = useState<string>('')

  const [addDocModal, setAddDocModal] = useState<boolean>(false)

  const showToast = useCustomToast()

  const handleSetAddDocModal = () => {
    setAddDocModal(state => !state)
  }

  const changeURL = (
    pageItem: number,
    searchItem: string,
    sortNameItem: string,
    sortTypeItem: number,
  ) => {
    let urlOptions = `?page=${pageItem}&sort[name]=${sortNameItem}&sort[type]=${sortTypeItem}&document=json`

    if (searchItem !== '') {
      urlOptions += `&filter[search]=${searchItem}`
    }

    setOptions(urlOptions)
  }

  const getFiles = async () => {
    if (!options) return

    const getResponse: {
      access: RolesAccess
      data: CustomersFilesData[]
      meta: PagesMetaData
    } = await getCustomersFiles(options)

    setAccess(getResponse.access)
    setData({ files: getResponse.data, meta: getResponse.meta })
  }

  const addNewDocument = async (formData: {
    title?: string
    file?: File
    global?: number
  }) => {
    const form = new FormData()

    if (formData.title) form.append('title', formData.title)
    if (formData.global !== undefined)
      form.append('global', formData.global.toString())
    if (formData.file) form.append('file', formData.file)

    const addResponse = await postAddNewDocument(form)

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added a Document',
        status: 'success',
      })
      handleSetAddDocModal()
      getFiles()
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  const deleteFile = async (idFile: number) => {
    const deleteResponse = await deleteDocument(idFile)

    if (deleteResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the File',
        status: 'success',
      })
      getFiles()
    } else {
      showToast({
        title: 'Error',
        description: deleteResponse.message,
        status: 'error',
      })
    }
  }

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  useEffect(() => {
    document.title = 'infiniti | Documents'
  }, [])

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    getFiles()
  }, [options])

  return (
    <>
      <div className={styles.wrapper}>
        <section className={styles.section}>
          {data && access ? (
            <RecentCard
              title='Documents'
              style={styles.recentFullScreen}
              Component={access.create ? ButtonBlue : undefined}
              HeaderComponent={Search}
              PagesComponent={
                data.files.length > 0 ? PagesList : undefined
              }
              pagesProps={
                data.files.length > 0
                  ? {
                    meta: data.meta,
                    nextPage: setPage,
                    size: 'sm',
                  }
                  : undefined
              }
              headerProps={{
                style: styles.search,
                onSearchChange: setSearch,
              }}
              componentProps={
                access.create
                  ? {
                    title: 'Add Document',
                    icon: '/icons/plus.svg',
                    titleNone: true,
                    style: styles.buttonPlus,
                    iconProps: styles.iconPlus,
                    onClick: handleSetAddDocModal,
                  }
                  : undefined
              }
            >
              <RecentDocuments
                files={data.files}
                changeSortName={changeSort}
                access={access}
                deleteFile={deleteFile}
              />
            </RecentCard>
          ) : (
            <LoadingSpinner size='xl' />
          )}
        </section>
      </div>
      <AddDocumentModal
        modalAddDoc={addDocModal}
        modalOpenClose={handleSetAddDocModal}
        handleButtonSave={addNewDocument}
      />
    </>
  )
}
