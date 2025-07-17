import { getAuthToken } from '../../get-auth-token'

export const postUserMessage = async (
  message: string,
  discussionId?: string,
  discussionModel?: string,
  chatModel?: string,
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
            message,
            chatModel,
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
