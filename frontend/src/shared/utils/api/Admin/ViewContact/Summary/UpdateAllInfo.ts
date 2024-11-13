import { PartialFieldsPostData } from '../../../../../../pages/Admin/CustomersPage/ViewPage/SummaryPage/SummaryPage'
import { getAuthToken } from '../../../GetAuthToke'

interface Response {
  status: boolean
  message: string
}

export const updateAllInfo = async (
  id: number,
  viewType: string,
  info: PartialFieldsPostData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_CUSTOMERS_VIEW_ADD_NEW_ELEMENT
        }${id}/view/${viewType}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ ...info }),
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
