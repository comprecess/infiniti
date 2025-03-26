import { getAuthToken } from '../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const putUpdateInfoBusinessPlan = async (
  id: number,
  formData: any,
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    const form = new FormData()

    Object.keys(formData).forEach(key => {
      const value = formData[key]

      if (Array.isArray(value)) {
        value.forEach(item => {
          form.append(`${key}[]`, item)
        })
      } else if (value !== undefined && value !== null) {
        form.append(key, value)
      }
    })

    try {
      const response = await fetch(
        `${import.meta.env.VITE_MAIN_DOMAIN}${
          import.meta.env.VITE_BUSINESS_PLAN_UPDATE_INFO
        }${id}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: form,
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
