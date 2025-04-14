import { getAuthToken } from '../../GetAuthToken'

export const getDatesTalentBusy = async (
  meetingId: number,
  meetingName: 'individual',
  timeZone: string,
) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_GET_TALENTS_DATES_BUSY +
        `${meetingName}/${meetingId}?timezone=${timeZone}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data = await response.json()

      return data
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}
