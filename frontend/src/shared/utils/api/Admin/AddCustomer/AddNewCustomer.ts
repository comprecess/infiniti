import { authTokenString } from '../../../../../app/constants/constants'
import { PartialFieldsPostData } from '../../../../../features/Admin/CustomersPage/AddCustomer/Fields'
import { getCookies } from '../../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
  message: string
}

export const addNewCustomer = async (
  formData: PartialFieldsPostData,
): Promise<Response> => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_CUSTOMERS_ADD_NEW_CUSTOMER,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: JSON.stringify({ ...formData }),
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
