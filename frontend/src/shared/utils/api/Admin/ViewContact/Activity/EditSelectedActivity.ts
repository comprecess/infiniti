import { getAuthToken } from '../../../get-auth-token'

interface Response {
  status: boolean
  message: string
}

export const editSelectedActivity = async (
  id: number,
  idType: number,
  viewType: string,
  icon: string,
  message: string,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_CUSTOMERS_VIEW_UPDATE_SELECTED_ELEMENT
        }${id}/view/${viewType}/${idType}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ icon, message }),
        },
      )

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
