import {
  authTokenString,
  CompanyData,
} from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
  message: string
}

export const editCompany = async (
  id: number,
  companyData: Partial<CompanyData>,
): Promise<Response> => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_CUSTOMERS_EDIT_COMPANY
        }${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: JSON.stringify({ ...companyData }),
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
