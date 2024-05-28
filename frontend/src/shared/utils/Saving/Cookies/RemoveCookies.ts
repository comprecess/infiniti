import Cookies from 'js-cookie'

export const removeCookies = (name: string) => {
  if (Cookies.get(name)) {
    Cookies.remove(name)
  }
}
