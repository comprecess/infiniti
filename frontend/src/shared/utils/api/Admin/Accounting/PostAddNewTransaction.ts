import { AccountingDepositExpenseForm } from '../../../../../app/constants/constants'
import { getAuthToken } from '../../GetAuthToken'

interface Response {
  status: boolean
  message: string
}

export const postAddNewTransaction = async (
  api: string,
  formData: Partial<AccountingDepositExpenseForm>,
  type: 'Income' | 'Expense',
): Promise<Response> => {
  const authToken = getAuthToken()

  if (authToken) {
    const url = `${import.meta.env.VITE_MAIN_DOMAIN}${api}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...formData, type }),
      })

      const data: Response = await response.json()

      return data
    } catch (error) {
      return { status: false, message: 'An error occurred' }
    }
  } else {
    return { status: false, message: 'Authentication failed' }
  }
}
