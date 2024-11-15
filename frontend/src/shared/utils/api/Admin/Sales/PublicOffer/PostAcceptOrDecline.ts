interface Response {
  status: boolean
  message: string
}

export const postAcceptOrDecline = async (
  tokenOffer: string,
  stage: 'Accepted' | 'Decline',
  message?: string,
  authToken?: string | undefined,
): Promise<Response> => {
  try {
    const url =
      import.meta.env.VITE_MAIN_DOMAIN +
      import.meta.env.VITE_SALES_ACCEPT_DECLINE_OFFER +
      tokenOffer

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ stage, message }),
    })

    const data: Response = await response.json()

    return data
  } catch (error) {
    return { status: false, message: 'An error occurred' }
  }
}
