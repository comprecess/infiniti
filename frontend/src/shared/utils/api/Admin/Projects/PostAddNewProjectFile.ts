import { getAuthToken } from '../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const postAddNewProjectFile = async (
  id: number,
  form: FormData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
        import.meta.env.VITE_PROJECTS_API
      }/${id}/files`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: form,
      })

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
