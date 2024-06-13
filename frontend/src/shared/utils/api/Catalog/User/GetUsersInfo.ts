export const getUsersInfo = async () => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_CATALOG_API_USERS_INFO,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({}),
      },
    )

    const data = await response.json()

    return data
  } catch (error) {
    return false
  }
}
