import { getAuthToken } from '../../../get-auth-token'

export const getPage = async (id: number, type: string) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_CUSTOMERS_MODAL_VIEW_GET_PAGE_COMPANY +
        id +
        '/view/' +
        type

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
