import { PartialFieldsNewUserData } from '../../../../../../../features/Admin/Settings/UsersPage/NewUser/Fields/Fields'
import { getAuthToken } from '../../../../GetAuthToke'

interface Response {
  status: boolean
  message: string
}

export const addNewUser = async (
  formData: PartialFieldsNewUserData | null,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SETTINGS_CREATE_NEW_USER

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...formData }),
      })

      const data = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
