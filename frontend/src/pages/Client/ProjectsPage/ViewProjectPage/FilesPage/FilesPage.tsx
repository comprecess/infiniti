import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './FilesPage.module.scss'
import {
  CustomersFilesData,
  PagesMetaData,
  ProjectViewPageContext,
} from '../../../../../app/constants/constants'
import { AddDocumentModal } from '../../../../../features/Admin/DocumentsPage/AddDocumentModal/AddDocumentModal'
import { RecentDocuments } from '../../../../../features/Admin/DocumentsPage/RecentDocuments/RecentDocuments'
import { PagesList } from '../../../../../features/Client/CatalogPage/TalentsList/PagesList/PagesList'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Search } from '../../../../../shared/ui/Search/Search'
import { deleteProjectFile } from '../../../../../shared/utils/api/Client/Projects/delete-project-file'
import { getProjectsFiles } from '../../../../../shared/utils/api/Client/Projects/get-project-files'
import { postAddNewProjectFile } from '../../../../../shared/utils/api/Client/Projects/post-create-new-file'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const ClientProjectsFilesPage = () => {
  const [data, setData] = useState<{
    files: CustomersFilesData[]
    meta: PagesMetaData
  } | null>(null)

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [sortName, setSortName] = useState<string>('id')
  const [sortType, setSortType] = useState<number>(1)
  const [options, setOptions] = useState<string>('')

  const [addDocModal, setAddDocModal] = useState<boolean>(false)

  const context = useOutletContext<ProjectViewPageContext>()

  const showToast = useCustomToast()

  const getFiles = async () => {
    if (!options || !context.idProject) return

    const response = await getProjectsFiles(context.idProject, options)

    if (!response.status) return

    setData({ files: response.data.data, meta: response.data.meta })
  }

  const deleteFile = async (idFile: number) => {
    if (!context.idProject) return

    const { status, message } = await deleteProjectFile(context.idProject, idFile)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the File',
        status: 'success',
      })
      getFiles()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleSetAddDocModal = () => {
    setAddDocModal(state => !state)
  }

  const addNewDocument = async (formData: { title?: string; file?: File; global?: number }) => {
    if (!context.idProject) return

    const form = new FormData()

    if (formData.title) form.append('title', formData.title)
    if (formData.global !== undefined) form.append('global', formData.global.toString())
    if (formData.file) form.append('file', formData.file)

    const { status, message } = await postAddNewProjectFile(context.idProject, form)

    if (status) {
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
        description: message,
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

  const changeSort = useCallback((sortNameItem: string, sortTypeItem: number) => {
    setSortName(sortNameItem)
    setSortType(sortTypeItem)
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
          {data ? (
            <RecentCard
              title='Project Files'
              style={styles.recentFullScreen}
              HeaderComponent={Search}
              PagesComponent={data.files.length > 0 ? PagesList : undefined}
              Component={ButtonBlue}
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
              componentProps={{
                title: 'Add Document',
                icon: '/icons/plus.svg',
                titleNone: true,
                style: styles.buttonPlus,
                iconProps: styles.iconPlus,
                onClick: handleSetAddDocModal,
              }}
            >
              <RecentDocuments
                files={data.files}
                changeSortName={changeSort}
                deleteFile={deleteFile}
                access={context.roles ? context.roles.documents : undefined}
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
