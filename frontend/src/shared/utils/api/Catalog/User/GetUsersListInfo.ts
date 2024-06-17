export const getUsersListInfo = async (page: string) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        `${import.meta.env.VITE_CATALOG_API_USERSLIST_INFO}${page}`,
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
