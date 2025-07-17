import { getAuthToken } from '../../get-auth-token'

interface Response {
  success: boolean
  token: string
  message: string
}

export const getConvertToInvoice = async (): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_CART_CONVERT_TO_INVOICE,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { success: false, token: '', message: '' }
    }
  } else {
    return { success: false, token: '', message: '' }
  }
}
