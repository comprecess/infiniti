export const Routes = {
  root: '/',
  auth: 'auth',
  login: 'login',
  register: 'register',
  forgotPassword: 'forgotPassword',
  notFound: '404',
}

export const to = {
  root: () => Routes.root,
  auth: () => Routes.auth,
  login: () => Routes.login,
  register: () => Routes.register,
  forgotPassword: () => Routes.forgotPassword,
  notFound: () => Routes.notFound,
}
