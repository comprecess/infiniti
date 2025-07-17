import { getAuthToken } from '../../get-auth-token'

interface Response {
  status: boolean
  message: string
}

export const updateProfileAvatar = async (
  file: FormData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_PROFILE_API_UPDATE_CLIENT_AVATAR
        }`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: file,
        },
      )

      const data = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
