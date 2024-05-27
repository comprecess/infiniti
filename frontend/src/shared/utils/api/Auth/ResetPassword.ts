interface ResetPasswordResponse {
  token: string
}

export const resetPassword = async (email: string): Promise<string> => {
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

    if (!response.ok) {
      console.error('Response error:', response)
      throw new Error('Failed to reset password')
    }

    const data: ResetPasswordResponse = await response.json()

    return data.token
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}
