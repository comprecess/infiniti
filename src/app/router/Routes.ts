export const Routes = {
  root: '/',
  auth: 'auth',
  login: 'signin',
  register: 'register',
  forgotPassword: 'resetpassword',
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
