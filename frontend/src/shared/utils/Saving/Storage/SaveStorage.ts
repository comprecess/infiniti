export const saveStorage = (name: string, info: any) => {
  localStorage.setItem(name, JSON.stringify(info))
}
