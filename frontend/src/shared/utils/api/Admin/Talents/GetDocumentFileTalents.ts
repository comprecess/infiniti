import { getAuthToken } from '../../GetAuthToke'

export const getDocumentFileTalents = async (options: string) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_TALENTS_GET_DOCS +
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
