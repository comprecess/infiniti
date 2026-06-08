import { useEffect, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ProjectViewPageContext } from '../../../../../app/constants/constants'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import {
  getDealRoomOverview,
  getDealRoomFolderDocuments,
  getDealRoomAllDocuments,
  assignDocumentToFolder,
} from '../../../../../shared/utils/api/Admin/Projects/deal-room'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import styles from './DealRoomPage.module.scss'

/**
 * Deal Room Page — Categorized document view for Exit Deal projects.
 *
 * Reuses existing project file upload system.
 * Adds folder-based categorization via clx_shared_preferences metadata.
 *
 * Universal: same UI pattern works for:
 * - Exit Deal → Due Diligence Data Room
 * - Fundraising → Investor Data Room
 * - Acquisition → Target Company Documents
 */

interface FolderInfo {
  name: string
  count: number
}

interface DocumentWithFolder {
  document: {
    id: number
    name: string
    size: string
    ext: string
    created_at: string
    url?: string
  }
  folder: string | null
}

const FOLDER_ICONS: Record<string, string> = {
  financial: '●',
  legal: '●',
  operational: '●',
  commercial: '●',
  technical: '●',
  hr: '●',
  compliance: '●',
  marketing: '●',
  pitch: '●',
  cap_table: '●',
  product: '●',
  references: '●',
}

export const AdminProjectsDealRoomPage = () => {
  const context = useOutletContext<ProjectViewPageContext>()
  const showToast = useCustomToast()

  const [folders, setFolders] = useState<Record<string, FolderInfo>>({})
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [documents, setDocuments] = useState<DocumentWithFolder[]>([])
  const [allDocuments, setAllDocuments] = useState<DocumentWithFolder[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false)
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false)
  const [previewDoc, setPreviewDoc] = useState<{url: string; title: string; type: string} | null>(null)
  const [previewContent, setPreviewContent] = useState<string>('')
  const [previewLoading, setPreviewLoading] = useState(false)

  const loadOverview = useCallback(async () => {
    if (!context.idProject) return
    setLoading(true)

    const response = await getDealRoomOverview(context.idProject)
    if (response.status) {
      setFolders((response as any).data.folders || {})
    } else {
      showToast({
        title: 'Error',
        description: (response as any).message || 'Failed to load Deal Room',
        status: 'error',
      })
    }

    setLoading(false)
  }, [context.idProject])

  const loadFolderDocuments = useCallback(async (folderCode: string) => {
    if (!context.idProject) return
    setLoadingDocs(true)
    setSelectedFolder(folderCode)

    const response = await getDealRoomFolderDocuments(context.idProject, folderCode)
    if (response.status) {
      setDocuments((response as any).data || [])
    }

    setLoadingDocs(false)
  }, [context.idProject])

  const loadAllDocuments = useCallback(async () => {
    if (!context.idProject) return
    const response = await getDealRoomAllDocuments(context.idProject)
    if (response.status) {
      setAllDocuments((response as any).data || [])
    }
  }, [context.idProject])

  const handleAssign = async (documentId: number, folder: string) => {
    if (!context.idProject) return
    const result = await assignDocumentToFolder(context.idProject, documentId, folder)
    if (result.status) {
      showToast({
        title: 'Success',
        description: 'Document assigned to folder',
        status: 'success',
      })
      loadOverview()
      if (selectedFolder) loadFolderDocuments(selectedFolder)
      loadAllDocuments()
    }
  }

  useEffect(() => {
    loadOverview()
    loadAllDocuments()
  }, [loadOverview, loadAllDocuments])

  useEffect(() => {
    document.title = 'infiniti | Deal Room'
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner size='xl' />
      </div>
    )
  }

  const totalDocs = Object.values(folders).reduce((sum, f) => sum + f.count, 0)
  const uncategorized = allDocuments.filter(d => !d.folder)

  // Preview helpers
  const isPreviewable = (mimeType: string) => {
    if (!mimeType) return false
    const t = mimeType.toLowerCase()
    return t.includes('image') || t.includes('text') || t.includes('pdf') || ['jpg','jpeg','png','webp','gif','svg','txt','md','csv','markdown'].includes(t)
  }

  const isImageType = (mimeType: string) => {
    if (!mimeType) return false
    const t = mimeType.toLowerCase()
    return t.includes('image') || ['jpg','jpeg','png','webp','gif','svg'].includes(t)
  }

  const isTextType = (mimeType: string) => {
    if (!mimeType) return false
    const t = mimeType.toLowerCase()
    return t.includes('text') || ['txt','md','csv','markdown'].includes(t)
  }

  const handlePreview = async (doc: any) => {
    const docLink = doc.link || ''
    const fullUrl = docLink.startsWith('http') ? docLink : `${import.meta.env.VITE_MAIN_DOMAIN}${import.meta.env.VITE_GET_DOCUMENT}/${docLink}`
    const docType = doc.type || doc.ext || ''
    const docTitle = doc.title || doc.name || 'Document'

    if (docType.toLowerCase().includes('pdf')) {
      window.open(fullUrl, '_blank')
      return
    }
    if (isImageType(docType)) {
      setPreviewDoc({ url: fullUrl, title: docTitle, type: 'image' })
      return
    }
    if (isTextType(docType)) {
      setPreviewLoading(true)
      setPreviewDoc({ url: fullUrl, title: docTitle, type: 'text' })
      try {
        const res = await fetch(fullUrl)
        const text = await res.text()
        setPreviewContent(text)
      } catch {
        setPreviewContent('Unable to load file content.')
      }
      setPreviewLoading(false)
      return
    }
    window.open(fullUrl, '_blank')
  }

    return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Deal Room</h3>
          <span className={styles.subtitle}>
            {totalDocs} documents categorized • {uncategorized.length} uncategorized
          </span>
        </div>
        <button
          className={styles.btnAssign}
          onClick={() => {
            setShowAssignModal(!showAssignModal)
            if (!showAssignModal) loadAllDocuments()
          }}
        >
          {showAssignModal ? 'Close' : 'Manage Documents'}
        </button>
      </div>

      {/* Folder Grid */}
      <div className={styles.folderGrid}>
        {Object.entries(folders).map(([code, info]) => (
          <div
            key={code}
            className={`${styles.folderCard} ${selectedFolder === code ? styles.folderActive : ''}`}
            onClick={() => loadFolderDocuments(code)}
          >
            <div className={styles.folderIcon}>
              {FOLDER_ICONS[code] || '●'}
            </div>
            <div className={styles.folderInfo}>
              <span className={styles.folderName}>{info.name}</span>
              <span className={styles.folderCount}>{info.count} files</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Folder Documents */}
      {selectedFolder && (
        <div className={styles.documentsSection}>
          <h4 className={styles.sectionTitle}>
            {FOLDER_ICONS[selectedFolder] || '●'} {folders[selectedFolder]?.name}
          </h4>
          {loadingDocs ? (
            <LoadingSpinner size='sm' />
          ) : documents.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No documents in this folder yet.</p>
              <p className={styles.emptyHint}>
                Upload files in the Files tab, then assign them here.
              </p>
            </div>
          ) : (
            <div className={styles.documentsList}>
              {documents.map((item: any) => {
                const doc = item.document || item
                const docTitle = doc.title || doc.name || 'Untitled'
                const docType = doc.type || doc.ext || ''
                const docLink = doc.link || ''
                return (
                  <div key={doc.id} className={styles.documentItem}>
                    <div className={styles.docIcon}>
                      {getFileIcon(docType)}
                    </div>
                    <div className={styles.docInfo}>
                      <span className={styles.docName}>{docTitle}</span>
                      <span className={styles.docMeta}>
                        {docType.toUpperCase()}{doc.size ? ` \u2022 ${doc.size}` : ''}{doc.created_at ? ` \u2022 ${doc.created_at}` : ''}
                      </span>
                    </div>
                    <div className={styles.docActions}>
                      {isPreviewable(docType) && (
                        <button
                          className={styles.docPreviewBtn}
                          onClick={() => handlePreview(doc)}
                          title="Preview"
                        >
                          {'◎'}
                        </button>
                      )}
                      {docLink && (
                        <a
                          href={docLink.startsWith('http') ? docLink : `${import.meta.env.VITE_MAIN_DOMAIN}${import.meta.env.VITE_GET_DOCUMENT}/${docLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.docDownload}
                          title="Download"
                        >
                          ↓
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className={styles.assignSection}>
          <h4 className={styles.sectionTitle}>Assign Documents to Folders</h4>
          {uncategorized.length === 0 ? (
            <div className={styles.emptyState}>
              <p>All documents are categorized.</p>
            </div>
          ) : (
            <div className={styles.assignList}>
              {uncategorized.map((item) => {
                const doc = item.document as any
                return (
                  <div key={doc?.id} className={styles.assignItem}>
                    <div className={styles.docInfo}>
                      <span className={styles.docName}>{doc?.title || doc?.name || 'Untitled'}</span>
                    </div>
                    <select
                      className={styles.folderSelect}
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value && doc?.id) {
                          handleAssign(doc.id, e.target.value)
                        }
                      }}
                    >
                      <option value="" disabled>Assign to folder...</option>
                      {Object.entries(folders).map(([code, info]) => (
                        <option key={code} value={code}>{info.name}</option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      {/* Preview Modal */}
      {previewDoc && (
        <div className={styles.previewOverlay} onClick={() => { setPreviewDoc(null); setPreviewContent('') }}>
          <div className={styles.previewModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.previewHeader}>
              <span className={styles.previewTitle}>{previewDoc.title}</span>
              <button className={styles.previewClose} onClick={() => { setPreviewDoc(null); setPreviewContent('') }}>{String.fromCharCode(10005)}</button>
            </div>
            <div className={styles.previewBody}>
              {previewDoc.type === 'image' && (
                <img src={previewDoc.url} alt={previewDoc.title} className={styles.previewImage} />
              )}
              {previewDoc.type === 'text' && (
                previewLoading ? (
                  <div className={styles.previewLoading}>Loading...</div>
                ) : (
                  <pre className={styles.previewText}>{previewContent}</pre>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getFileIcon(ext: string): string {
  const icons: Record<string, string> = {
    pdf: 'PDF',
    doc: 'DOC',
    docx: 'DOC',
    xls: 'XLS',
    xlsx: 'XLS',
    ppt: 'PPT',
    pptx: 'PPT',
    jpg: 'IMG',
    jpeg: 'IMG',
    png: 'IMG',
    zip: 'ZIP',
    csv: 'CSV',
  }
  return icons[ext?.toLowerCase()] || '—'
}
