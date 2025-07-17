import { PartialFormData } from '../../../../../../features/Admin/Sales/ViewInvoice/EmailPanel/EmailPanel'
import { getAuthToken } from '../../../get-auth-token'

interface Response {
  status: boolean
  message: string
}

export const sendEmailOffer = async (
  idOffer: number,
  template: string,
  formData: PartialFormData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_EMAIL_TEMPLATE +
        template +
        '/offer/' +
        idOffer

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
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
