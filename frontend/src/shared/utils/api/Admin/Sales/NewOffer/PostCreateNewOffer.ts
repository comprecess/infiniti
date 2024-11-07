import { authTokenString } from '../../../../../../app/constants/constants'
import { PartialFieldsNewOfferData } from '../../../../../../features/Admin/Sales/NewOfferPage/Fields/Fields'
import { PartialFieldsCartToOfferData } from '../../../../../../features/Admin/TalentsPage/CartToOfferPage/Fields/Fields'
import { getCookies } from '../../../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
  message: string
}

export const addNewOffer = async (
  formData: PartialFieldsNewOfferData | PartialFieldsCartToOfferData,
): Promise<Response> => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_SALES_CREATE_NEW_OFFER,
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
