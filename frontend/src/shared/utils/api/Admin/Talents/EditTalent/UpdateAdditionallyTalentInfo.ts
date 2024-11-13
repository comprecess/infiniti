import { getAuthToken } from '../../../GetAuthToke'

interface Response {
  status: boolean
  message: string
}

export const updateAdditionallyTalentInfo = async (
  idTalent: number,
  updateData: {
    [key: string]: number
  },
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_TALENTS_UPDATE_TALENT_INFO +
        idTalent +
        '/update'

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...updateData }),
      })

      const data = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
