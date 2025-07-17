import { getAuthToken } from '../../../get-auth-token'

interface Response {
  status: boolean
  message: string
}

export const removeBlankInvoice = async (
  idInvoice: number,
  idBlank: number,
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
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
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
