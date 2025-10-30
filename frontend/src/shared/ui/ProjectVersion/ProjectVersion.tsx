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

    // Защищаемся: navigator.serviceWorker может быть undefined
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      updateCacheVersion()
    }

    const onControllerChange = () => updateCacheVersion()

    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    }

    return () => {
      if (navigator.serviceWorker) {
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
