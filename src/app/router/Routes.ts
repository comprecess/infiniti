export const Routes = {
  root: '/',
  auth: 'auth',
  login: 'login',
  register: 'register',
  passwordReset: 'passwordReset',
  notFound: '404',
}

export const to = {
  root: () => Routes.root,
  auth: () => Routes.auth,
  login: () => Routes.login,
  register: () => Routes.register,
  passwordReset: () => Routes.passwordReset,
  notFound: () => Routes.notFound,
}
