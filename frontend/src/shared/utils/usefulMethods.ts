import saveAs from 'file-saver'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const useIdFromUrl = (word: string): number | null => {
  const location = useLocation()

  return useMemo(() => {
    if (!word) return null

    const regex = new RegExp(`/${word}/(\\d+)(/|$)`)
    const match = location.pathname.match(regex)

    return match ? parseInt(match[1], 10) : null
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
