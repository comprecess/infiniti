import { PartialFieldsPostData } from '../../../../../../features/Admin/TalentsPage/EditTalentPage/Fields/Fields'
import { getAuthToken } from '../../../GetAuthToke'

interface Response {
  status: boolean
  message: string
}

export const putUpdateTalentInfo = async (
  idTalent: number,
  formData: PartialFieldsPostData,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_TALENTS_UPDATE_TALENT_INFO
        }${idTalent}`,
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
