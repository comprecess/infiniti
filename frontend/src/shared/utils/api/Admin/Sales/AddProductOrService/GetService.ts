import { getAuthToken } from '../../../GetAuthToke'

export const getServiceInvoice = async (nameService: string) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_CREATE_NEW_INVOICE +
        '/service/' +
        nameService

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
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
