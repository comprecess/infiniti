import { getAuthToken } from '../../../get-auth-token'

export const getOfferEmailTemplate = async (
  idOffer: number,
  template: string,
) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_EMAIL_TEMPLATE +
        template +
        '/offer/' +
        idOffer

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data = await response.json()

      return data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
