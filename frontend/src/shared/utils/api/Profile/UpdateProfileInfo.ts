import {
  authTokenString,
  UpdateProfileInfoProps,
} from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'

export const updateProfileInfo = async (
  props: Partial<UpdateProfileInfoProps>,
) => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_PROFILE_API_UPDATE_CLIENT_INFO
        }`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: JSON.stringify(props),
        },
      )

      if (!response.ok) {
        return false
      }

      const data = await response.json()

      return data.status
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
