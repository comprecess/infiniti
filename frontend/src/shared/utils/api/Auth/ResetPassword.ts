interface ResetPasswordResponse {
  message: string
  status: boolean
}

export const resetPassword = async (
  email: string,
): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_AUTH_API_RESET_PASSWORD,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      },
    )

    const data: ResetPasswordResponse = await response.json()

    return data
  } catch (error) {
    return {
      message: 'Response Error',
      status: false,
    }
  }
}
