import { getAuthToken } from '../../../get-auth-token'

export const getInfoSelectedOffer = async (id: number, type?: string) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_VIEW_OFFER +
        id +
        type

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      return data.data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
