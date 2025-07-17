import { getAuthToken } from '../../../get-auth-token'

interface Response {
  status: boolean
  message: string
}

export const updateMemo = async (
  id: number,
  type: string,
  memo: string,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_CUSTOMERS_MODAL_VIEW_UPDATE_MEMO_COMPANY
        }${id}/view/${type}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ memo }),
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
