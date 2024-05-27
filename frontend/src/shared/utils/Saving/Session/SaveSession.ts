export const saveSession = (name: string, info: any) => {
  sessionStorage.setItem(name, JSON.stringify(info))
}
