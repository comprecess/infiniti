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
import { deleteProjectFile } from '../../../../../shared/utils/api/Admin/Projects/delete-project-file'
import { getProjectsFiles } from '../../../../../shared/utils/api/Admin/Projects/get-project-files'
import { postAddNewProjectFile } from '../../../../../shared/utils/api/Admin/Projects/post-create-new-file'
import { assignDocumentToFolder } from '../../../../../shared/utils/api/Admin/Projects/deal-room'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'

export const AdminProjectsFilesPage = () => {
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

  // Determine if this project uses the exit_deal template (has Deal Room)
  const isExitDeal = context.templateCode === 'exit_deal'

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

  const addNewDocument = async (formData: { title?: string; file?: File; global?: number; dealRoomFolder?: string }) => {
    if (!context.idProject) return
    const form = new FormData()
    if (formData.title) form.append('title', formData.title)
    if (formData.global !== undefined) form.append('global', formData.global.toString())
    if (formData.file) form.append('file', formData.file)

    const response = await postAddNewProjectFile(context.idProject, form)

    if (response.status) {
      // If a Deal Room folder was selected and we got the document ID, assign it
      const docId = (response as any).id
      if (formData.dealRoomFolder && docId) {
        const assignResult = await assignDocumentToFolder(
          context.idProject,
          docId,
          formData.dealRoomFolder,
        )
        if (assignResult.status) {
          showToast({
            title: 'Successfully',
            description: `File uploaded and assigned to Deal Room → ${formData.dealRoomFolder}`,
            status: 'success',
          })
        } else {
          showToast({
            title: 'Uploaded',
            description: 'File uploaded, but category assignment failed. You can assign it manually in Deal Room.',
            status: 'warning',
          })
        }
      } else {
        showToast({
          title: 'Successfully',
          description: 'You have successfully added a File',
          status: 'success',
        })
      }
      handleSetAddDocModal()
      getFiles()
    } else {
      showToast({
        title: 'Error',
        description: (response as any).message || 'Upload failed',
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
              Component={
                context.roles && context.roles.documents.create === 0 ? undefined : ButtonBlue
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
                context.roles && context.roles.documents.create === 0
                  ? undefined
                  : {
                    title: 'Add Document',
                    icon: '/icons/plus.svg',
                    titleNone: true,
                    iconProps: styles.iconPlus,
                    onClick: handleSetAddDocModal,
                  }
              }
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
        showDealRoomCategory={isExitDeal}
      />
    </>
  )
}
