import Cookies from 'js-cookie'

export const getCookies = (name: string) => {
  const cookieValue = Cookies.get(name)

  if (cookieValue) {
    return { status: true, cookie: cookieValue }
  } else {
    return { status: false }
  }
}
