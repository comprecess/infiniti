export const getInfoPublicInvoice = async (
  token: string,
  type: string,
) => {
  try {
    const url =
      import.meta.env.VITE_MAIN_DOMAIN +
      import.meta.env.VITE_SALES_GET_PUBLIC_INVOICE_INFO +
      token +
      type

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return data.data
  } catch (error) {
    return false
  }
}
