import { getAuthToken } from '../../GetAuthToken'

export const getAccountingInputData = async (
  type?: 'Income' | 'Expense',
) => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      let url =
        import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_ACCOUNTING_GET_INPUT_DATA

      if (type) {
        url += `?type=${type}`
      }

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
