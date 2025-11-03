import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'

import pkg from '../../../../package.json'
import { versions } from '../../../app/data/versions'
import { CustomModalWindow } from '../../ui/CustomModalWindow/CustomModalWindow'

interface VersionContextType {
  currentVersion: string
  isUpdated: boolean
  changelog?: string
}

const VersionContext = createContext<VersionContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useVersion = () => {
  const context = useContext(VersionContext)

  if (!context) throw new Error('useVersion must be used within VersionProvider')

  return context
}

export const VersionProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)
  const [changelog, setChangelog] = useState<string | undefined>(undefined)

  const currentVersion = pkg.version

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const savedVersion = localStorage.getItem('version')

    if (!savedVersion) {
      localStorage.setItem('version', currentVersion)

      return
    }

    if (savedVersion !== currentVersion) {
      const versionInfo = versions.find(v => v.version === currentVersion)

      setChangelog(versionInfo?.description)
      setIsOpen(true)

      localStorage.setItem('version', currentVersion)
    }
  }, [currentVersion])

  return (
    <VersionContext.Provider value={{ currentVersion, isUpdated: isOpen, changelog }}>
      {children}
      <CustomModalWindow
        isOpen={isOpen}
        maxWidth='600px'
        borderRadius='16px'
        padding='24px'
        onClose={handleClose}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            {currentVersion}
          </h2>
          <div
            dangerouslySetInnerHTML={{ __html: changelog || '<p>No description of changes.</p>' }}
            className='dangerouslySetInnerHTML'
          />
        </div>
      </CustomModalWindow>
    </VersionContext.Provider>
  )
}
