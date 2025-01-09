import { getAuthToken } from '../../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const putAddBusinessModelPicture = async (
  id: number,
  formData: FormData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_BUSINESS_MODEL_ADD_PICTURE_BUSINESS_MODEL
        }${id}/update`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
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
