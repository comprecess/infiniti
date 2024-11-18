import { FieldProps } from '../../../../../pages/Admin/SettingsPage/CustomContactFieldsPage/CustomContactFieldsPage'
import { getAuthToken } from '../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const editField = async (
  id: number,
  fieldData: FieldProps,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_CUSTOM_FIELDS_EDIT_SELECTED_FIELD
        }${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ ...fieldData }),
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
