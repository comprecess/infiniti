import { authTokenString } from '../../../../../../app/constants/constants'
import { PartialFormData } from '../../../../../../features/Admin/Sales/ViewInvoice/EmailPanel/EmailPanel'
import { getCookies } from '../../../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
  message: string
}

export const sendEmailOffer = async (
  idOffer: number,
  template: string,
  formData: PartialFormData,
): Promise<Response> => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
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
          Authorization: `Bearer ${authToken.cookie}`,
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
