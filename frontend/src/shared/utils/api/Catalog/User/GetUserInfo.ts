export const getUserInfo = async (id: number) => {
  try {
    const url = `${import.meta.env.VITE_MAIN_DOMAIN}${
      import.meta.env.VITE_CATALOG_API_USER_INFO
    }${id}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    const data = await response.json()

    return data
  } catch (error) {
    return false
  }
}
