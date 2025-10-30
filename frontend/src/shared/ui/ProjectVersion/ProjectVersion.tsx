import { useEffect, useState } from 'react'

import styles from './ProjectVersion.module.scss'

export const ProjectVersion = () => {
  const [cacheVersion, setCacheVersion] = useState<string>('')

  useEffect(() => {
    const updateCacheVersion = async () => {
      if ('caches' in window) {
        const keys = await caches.keys()
        const version = keys.find(key => key.startsWith('infiniti-')) || ''

        setCacheVersion(version)
      }
    }

    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        updateCacheVersion()
      }

      const onControllerChange = () => updateCacheVersion()
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
      }
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <span className={styles.text}>{`version: ${__APP_VERSION__}`}</span>
      {cacheVersion && <span className={styles.text}>{`cache: ${cacheVersion}`}</span>}
    </div>
  )
}
