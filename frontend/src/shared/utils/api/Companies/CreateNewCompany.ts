import {
  authTokenString,
  CompanyData,
} from '../../../../app/constants/constants'
import { getCookies } from '../../Saving/Cookies/GetCookies'

interface Response {
  status: boolean
}

export const createNewCompany = async (
  companyData: Partial<CompanyData>,
): Promise<boolean> => {
  const authToken = getCookies(authTokenString)

  if (authToken.status) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_CUSTOMERS_CREATE_COMPANY,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.cookie}`,
          },
          body: JSON.stringify({ ...companyData }),
        },
      )

      const data: Response = await response.json()

      return data.status
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
