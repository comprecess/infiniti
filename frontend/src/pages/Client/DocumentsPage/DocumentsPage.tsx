import { useEffect, useState } from 'react'

import styles from './DocumentsPage.module.scss'
import { ClientDocumentsData } from '../../../app/constants/constants'
import { Item } from '../../../features/Client/DocumentsPage/Item/Item'
import { LoadingShimmer } from '../../../shared/ui/LoadingShimmer/LoadingShimmer'
import { getDocumentsList } from '../../../shared/utils/api/Client/Documents/get-documents-list'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

export const ClientDocumentsPage = () => {
  const [documents, setDocuments] = useState<{ data: ClientDocumentsData[] } | null>(null)

  const getDocumentList = async () => {
    const response = await getDocumentsList()

    if (!response.status) return

    setDocuments(response.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Documents'

    getDocumentList()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {documents ? (
          <RecentCard title='Documents' style={styles.recentFullScreen}>
            {documents.data.length > 0 ? (
              <div className={styles.documents}>
                {documents.data.map((document, index) => (
                  <Item key={`${document.title}-${index}`} data={document} />
                ))}
              </div>
            ) : (
              <div className={styles.nothingFound}>
                <span className={styles.nothingFoundText}>Nothing Found</span>
              </div>
            )}
          </RecentCard>
        ) : (
          <div className={styles.loading}>
            <LoadingShimmer variant='list' rows={6} />
          </div>
        )}
      </section>
    </div>
  )
}
