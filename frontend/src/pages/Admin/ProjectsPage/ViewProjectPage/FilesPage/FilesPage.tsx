import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  CustomersFilesData,
  PagesMetaData,
  ProjectViewPageContext,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { AddDocumentModal } from '../../../../../features/Admin/DocumentsPage/AddDocumentModal/AddDocumentModal'
import { RecentDocuments } from '../../../../../features/Admin/DocumentsPage/RecentDocuments/RecentDocuments'
import { PagesList } from '../../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../../shared/ui/Search/Search'
import { deleteDocument } from '../../../../../shared/utils/api/Admin/Documents/DeleteDocument'
import { getProjectsFiles } from '../../../../../shared/utils/api/Admin/Projects/GetProjectsFiles'
import { postAddNewProjectFile } from '../../../../../shared/utils/api/Admin/Projects/PostAddNewProjectFile'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './FilesPage.module.scss'

export const AdminProjectsFilesPage = () => {
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

  const context = useOutletContext<ProjectViewPageContext>()

  const showToast = useCustomToast()

  const getFiles = async () => {
    if (!options || !context.idProject) return

    const getResponse: {
      access: RolesAccess
      data: CustomersFilesData[]
      meta: PagesMetaData
    } = await getProjectsFiles(context.idProject, options)

    setAccess(getResponse.access)
    setData({ files: getResponse.data, meta: getResponse.meta })
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

  const handleSetAddDocModal = () => {
    setAddDocModal(state => !state)
  }

  const addNewDocument = async (formData: {
    title?: string
    file?: File
    global?: number
  }) => {
    if (!context.idProject) return

    const form = new FormData()

    if (formData.title) form.append('title', formData.title)
    if (formData.global !== undefined)
      form.append('global', formData.global.toString())
    if (formData.file) form.append('file', formData.file)

    const addResponse = await postAddNewProjectFile(
      context.idProject,
      form,
    )

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added a File',
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

  const changeSort = useCallback(
    (sortNameItem: string, sortTypeItem: number) => {
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  const searchOnChange = useCallback((searchItem: string) => {
    setSearch(searchItem)
  }, [])

  const pageOnChange = useCallback((pageItem: number) => {
    setPage(pageItem)
  }, [])

  useEffect(() => {
    getFiles()
  }, [options, context.idProject])

  useEffect(() => {
    changeURL(page, search, sortName, sortType)
  }, [page, search, sortName, sortType])

  useEffect(() => {
    document.title = 'infiniti | Project Files'
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        <section className={styles.section}>
          {data && access ? (
            <RecentCard
              title='Project Files'
              style={styles.recentFullScreen}
              Component={access.create ? ButtonBlue : undefined}
              HeaderComponent={Search}
              PagesComponent={PagesList}
              pagesProps={{
                meta: data.meta,
                nextPage: pageOnChange,
                size: 'sm',
              }}
              headerProps={{
                style: styles.search,
                onSearchChange: searchOnChange,
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
