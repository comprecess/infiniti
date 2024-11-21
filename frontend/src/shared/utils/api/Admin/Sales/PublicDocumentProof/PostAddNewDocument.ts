import { getAuthToken } from '../../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const postAddNewDocument = async (
  form: FormData,
  token: string,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_SALES_ADD_NEW_DOCUMENT_PROOF +
          token +
          '/pay/manualpayment',
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
