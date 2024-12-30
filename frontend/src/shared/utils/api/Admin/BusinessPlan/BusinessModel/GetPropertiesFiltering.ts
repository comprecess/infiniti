import { getAuthToken } from '../../../GetAuthToken'

export const getPropertiesFiltering = async (type?: string) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_BUSINESS_MODEL_GET_PROPERTIES_FILTERING +
          `${type ? type : ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
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
