import { authTokenString } from '../../../../../../app/constants/constants'
import { getCookies } from '../../../../Saving/Cookies/GetCookies'

export const getInvoicesDocuments = async (options: string) => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_INVOICES_LIST +
        options

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken.cookie}`,
        },
      })

      const data = await response.blob()

      return data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
