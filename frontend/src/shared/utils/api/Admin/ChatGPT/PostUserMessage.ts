import { getAuthToken } from '../../GetAuthToken'

export const postUserMessage = async (
  chatModel: string,
  message: string,
  discussionId?: string,
  discussionModel?: string,
) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_CHATGPT_POST_USER_MESSAGE,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            chatModel,
            message,
            discussionId,
            discussionModel,
          }),
        },
      )

      const data = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
