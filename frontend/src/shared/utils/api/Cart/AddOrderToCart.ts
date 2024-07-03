import { authTokenString } from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'

export const addOrderToCart = async (
  catalogUser: number,
  amount: number,
  type: string,
): Promise<boolean> => {
  const authToken = getCookies(authTokenString)

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_CART_ADD_ORDER,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: JSON.stringify({ catalogUser, amount, type }),
        },
      )

      const data = await response.json()

      return data.status
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
