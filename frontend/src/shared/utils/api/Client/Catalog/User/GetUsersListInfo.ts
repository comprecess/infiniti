import { getAuthToken } from '../../../GetAuthToken'

export const getUsersListInfo = async (
  page: string,
  filters?: object,
  sort?: object,
) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          `${import.meta.env.VITE_CATALOG_API_USERSLIST_INFO}${page}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ filter: filters, ...sort }),
        },
      )

      const data = await response.json()

      return data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
