import { SalesNewInvoicePriceCalcProps } from '../../../../../../app/constants/constants'
import { getAuthToken } from '../../../GetAuthToke'

export const postOfferPriceCalc = async (blank: {
  blankList: {
    serviceId?: number
    id?: number
    service: 'calc' | 'serviceProduct'
    amount: number
    price: number
    tax: number
    discount: number
    discountType: 'percent' | 'fixed'
  }[]
}): Promise<SalesNewInvoicePriceCalcProps> => {
  const authToken = getAuthToken()

  if (authToken) {
    try {
      const response = await fetch(
        import.meta.env.VITE_MAIN_DOMAIN +
          import.meta.env.VITE_SALES_NEW_INVOICES_PRICE_CALC,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ ...blank }),
        },
      )

      const data: SalesNewInvoicePriceCalcProps = await response.json()

      return data
    } catch (error) {
      return {
        data: null,
        result: null,
        status: false,
        message: 'An error occurred',
      }
    }
  } else {
    return {
      data: null,
      result: null,
      status: false,
      message: 'Authentication failed',
    }
  }
}
