import { PartialFieldsPostData } from '../../../../../../features/Admin/Sales/NewInvoice/Fields/Fields'
import { getAuthToken } from '../../../get-auth-token'

interface Response {
  id: number
  status: boolean
  message: string
}

export const addNewInvoice = async (
  api: string,
  formData: PartialFieldsPostData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url = `${import.meta.env.VITE_MAIN_DOMAIN}${api}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...formData }),
      })

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { id: 0, status: false, message: 'An error occurred' }
    }
  } else {
    return { id: 0, status: false, message: 'Authentication failed' }
  }
}
