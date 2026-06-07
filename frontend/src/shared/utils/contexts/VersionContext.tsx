import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import { releases, ReleaseInfo } from '../../../app/data/releases'
import { ReleaseNotesModal } from '../../ui/ReleaseNotesModal/ReleaseNotesModal'

interface BuildInfo {
  commit: string
  commit_full: string
  branch: string
  message: string
  build_timestamp: string
  deploy_timestamp: string
}

interface VersionContextType {
  currentVersion: string
  buildCommit: string
  isUpdated: boolean
}

const VersionContext = createContext<VersionContextType | undefined>(undefined)

const STORAGE_KEY = 'infiniti_last_seen_version'

// eslint-disable-next-line react-refresh/only-export-components
export const useVersion = () => {
  const context = useContext(VersionContext)
  if (!context) throw new Error('useVersion must be used within VersionProvider')
  return context
}

export const VersionProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentRelease, setCurrentRelease] = useState<ReleaseInfo | null>(null)
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null)

  const currentVersion = releases.length > 0 ? releases[0].version : '0.0.0'

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem(STORAGE_KEY, currentVersion)
  }

  useEffect(() => {
    // Fetch build-info.json for deployment metadata
    fetch('/build-info.json')
      .then(res => res.json())
      .then((data: BuildInfo) => setBuildInfo(data))
      .catch(() => {
        // Non-critical: build-info.json may not exist in dev
      })
  }, [])

  useEffect(() => {
    const savedVersion = localStorage.getItem(STORAGE_KEY)

    if (!savedVersion) {
      // First visit ever — show release notes for current version
      const release = releases.find(r => r.version === currentVersion)
      if (release) {
        setCurrentRelease(release)
        setIsOpen(true)
      }
      localStorage.setItem(STORAGE_KEY, currentVersion)
      return
    }

    if (savedVersion !== currentVersion) {
      // Version changed since last visit — show new release notes
      const release = releases.find(r => r.version === currentVersion)
      if (release) {
        setCurrentRelease(release)
        setIsOpen(true)
      }
      // Note: we save to localStorage only on close, so if user refreshes
      // before closing, they'll see it again (intentional UX)
    }
  }, [currentVersion])

  return (
    <VersionContext.Provider value={{ currentVersion, buildCommit: buildInfo?.commit || '', isUpdated: isOpen }}>
      {children}
      <ReleaseNotesModal
        isOpen={isOpen}
        onClose={handleClose}
        release={currentRelease}
        buildCommit={buildInfo?.commit}
        buildTimestamp={buildInfo?.deploy_timestamp}
      />
    </VersionContext.Provider>
  )
}
