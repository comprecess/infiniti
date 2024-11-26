export const postStripePayment = async (tokenInvoice: string) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_SALES_ADD_NEW_DOCUMENT_PROOF +
        tokenInvoice +
        '/pay/stripe',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    const data = await response.json()

    return data
  } catch (error) {
    return { status: false, message: 'An error occurred' }
  }
}
