import { getAuthToken } from '../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const postCreateNewMeeting = async (
  meetingName: 'cart' | 'individual' | 'business-plan',
  date: string,
  timezone: string,
  meetingId?: number,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_CREATE_MEETING +
          (meetingId ? `${meetingName}/${meetingId}` : `${meetingName}`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ date, timezone }),
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
