import { getAuthToken } from '../../../get-auth-token'

interface Response {
  status: boolean
  message: string
}

export const addBlankOffer = async (
  id: number,
  service: string,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_CREATE_NEW_OFFER +
        '/' +
        id +
        '/blank'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ service }),
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
