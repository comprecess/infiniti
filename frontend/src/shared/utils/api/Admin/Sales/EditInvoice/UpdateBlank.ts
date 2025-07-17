import { SalesEditInvoiceBlankData } from '../../../../../../app/constants/constants'
import { getAuthToken } from '../../../get-auth-token'

interface Response {
  status: boolean
  message: string
}

export const updateBlankInvoice = async (
  idInvoice: number,
  idBlank: number,
  formData: SalesEditInvoiceBlankData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_CREATE_NEW_INVOICE +
        '/' +
        idInvoice +
        '/blank/' +
        idBlank

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...formData }),
      })

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
