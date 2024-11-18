import { getAuthToken } from '../../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const removeBlankOffer = async (
  idOffer: number,
  idBlank: number,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_CREATE_NEW_OFFER +
        '/' +
        idOffer +
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
