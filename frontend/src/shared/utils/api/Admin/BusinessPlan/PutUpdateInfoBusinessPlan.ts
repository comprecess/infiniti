import { BusinessPlanNewPlanFormData } from '../../../../../app/constants/constants'
import { getAuthToken } from '../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const putUpdateInfoBusinessPlan = async (
  id: number,
  formData: Partial<BusinessPlanNewPlanFormData>,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_BUSINESS_PLAN_UPDATE_INFO
        }${id}`,
        {
          method: 'PUT',
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
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
