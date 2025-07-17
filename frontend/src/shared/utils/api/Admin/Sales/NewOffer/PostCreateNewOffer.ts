import { PartialFieldsNewOfferData } from '../../../../../../features/Admin/Sales/NewOfferPage/Fields/Fields'
import { PartialFieldsCartToOfferData } from '../../../../../../features/Admin/TalentsPage/CartToOfferPage/Fields/Fields'
import { getAuthToken } from '../../../get-auth-token'

interface Response {
  id: number
  status: boolean
  message: string
}

export const addNewOffer = async (
  formData: PartialFieldsNewOfferData | PartialFieldsCartToOfferData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_SALES_CREATE_NEW_OFFER,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ ...formData }),
        },
      )

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { id: 0, status: false, message: 'An error occurred' }
    }
  } else {
    return { id: 0, status: false, message: 'Authentication failed' }
  }
}
