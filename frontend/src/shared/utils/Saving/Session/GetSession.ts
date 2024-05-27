export const getSession = (name: string) => {
  const info = sessionStorage.getItem(name)

  if (info === null) return null

  return JSON.parse(info)
}
