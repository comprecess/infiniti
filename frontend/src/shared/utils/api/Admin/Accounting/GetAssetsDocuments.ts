import { getAuthToken } from '../../GetAuthToken'

export const getAssetsDocuments = async (options: string) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_ACCOUNTING_GET_ASSETS_LIST +
        options

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data = await response.blob()

      return data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
