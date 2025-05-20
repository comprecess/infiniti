import { getAuthToken } from '../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const postRecordInitialBalance = async (
  id: number,
  form: {
    balance: { amount: string; currency: number }[]
  },
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_ACCOUNTING_ADD_RECORD_INITIAL_BALANCE +
          `${id}/equity`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ ...form }),
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
