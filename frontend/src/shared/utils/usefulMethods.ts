import saveAs from 'file-saver'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { getSession } from './Saving/Session/GetSession'
import { profileInfoString } from '../../app/constants/constants'

export const useIdFromUrl = (word: string): number | null => {
  const location = useLocation()

  return useMemo(() => {
    if (!word) return null

    const regex = new RegExp(`/${word}/(\\d+)(/|$)`)
    const match = location.pathname.match(regex)

    return match ? parseInt(match[1], 10) : null
  }, [location.pathname, word])
}

export const useTextFromUrl = (word: string): string | null => {
  const location = useLocation()

  return useMemo(() => {
    if (!word) return null

    const regex = new RegExp(`/${word}/([^/]+)`)
    const match = location.pathname.match(regex)

    return match ? match[1] : null
  }, [location.pathname, word])
}

type SupportedContentType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'text/plain'
  | 'text/html'

export const downloadDocument = async (
  file: unknown,
  documentName: string,
): Promise<{ status: boolean }> => {
  if (!(file instanceof Blob)) {
    return { status: false }
  }

  const contentType = file.type as SupportedContentType

  switch (contentType) {
    case 'application/pdf':
      saveAs(file, `${documentName}-Infiniti.pdf`)

      return { status: true }

    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      saveAs(file, `${documentName}-Infiniti.xlsx`)

      return { status: true }

    case 'text/plain':
      saveAs(file, `${documentName}-Infiniti.csv`)

      return { status: true }

    case 'text/html': {
      const htmlText = await file.text()
      await navigator.clipboard.writeText(htmlText)

      return { status: true }
    }

    default:
      return { status: false }
  }
}

export const getLocalDateTimeString = (): string => {
  const now = new Date()

  const pad = (n: number) => n.toString().padStart(2, '0')

  const year = now.getFullYear()
  const month = pad(now.getMonth() + 1)
  const day = pad(now.getDate())
  const hours = pad(now.getHours())
  const minutes = pad(now.getMinutes())

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export const generateStorageKey = (sectionPart: string): string => {
  const profileData = getSession(profileInfoString)

  const userPart = `user-${profileData.id}`

  return `infiniti-[${userPart}]-[${sectionPart}]`
}

export const downloadOrViewFile = async (
  blob: Blob,
  fileName: string,
  viewTarget: 'current' | 'new' = 'new',
  goBackAfterDownload: boolean = false,
): Promise<void> => {
  const canView =
    blob.type.startsWith('image/') ||
    blob.type === 'application/pdf' ||
    blob.type.startsWith('text/')

  const url = URL.createObjectURL(blob)

  let shouldGoBack = false

  if (canView) {
    if (viewTarget === 'new') {
      const newWindow = window.open(url, '_blank')

      if (!newWindow) {
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
      }

      shouldGoBack = true
    } else {
      window.location.href = url
    }
  } else {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()

    shouldGoBack = true
  }

  if (goBackAfterDownload && shouldGoBack) {
    setTimeout(() => {
      window.history.back()
    }, 300)
  }

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
