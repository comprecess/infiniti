import { SettingsRoleFormData } from '../../../../../../app/constants/constants'
import { getAuthToken } from '../../../GetAuthToken'

export const postChangedRole = async (
  id: number,
  formData: {
    name: string
    access: SettingsRoleFormData[]
  },
) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SETTINGS_CREATE_ROLE +
        '/' +
        id

      const response = await fetch(url, {
        method: 'PUT',
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
      return false
    }
  } else {
    return false
  }
}
