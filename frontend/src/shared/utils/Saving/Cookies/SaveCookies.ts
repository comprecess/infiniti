import Cookies from 'js-cookie'

export const saveCookies = (
  name: string,
  token: string,
  countDay: number,
) => {
  if (Cookies.get(name)) {
    Cookies.remove(name)
  }

  Cookies.set(name, token, { expires: countDay })
}
