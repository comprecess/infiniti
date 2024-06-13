export const getPropertiesFiltering = async () => {
  try {
    const response = await fetch(
      import.meta.env.VITE_MAIN_DOMAIN +
        import.meta.env.VITE_CATALOG_API_PROPERTIES_FILTERING,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    const data = await response.json()

    return data
  } catch (error) {
    return false
  }
}
