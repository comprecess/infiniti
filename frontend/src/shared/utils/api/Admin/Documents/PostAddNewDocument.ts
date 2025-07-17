import { getAuthToken } from '../../get-auth-token'

interface Response {
  status: boolean
  message: string
}

export const postAddNewDocument = async (
  form: FormData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_DOCUMENTS_ADD_NEW_FILE,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: form,
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
