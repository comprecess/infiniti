export const Routes = {
  root: '/',
  auth: 'auth',
  signIn: 'signin',
  loginResident: 'loginresident',
  register: 'register',
  resetPassword: 'resetpassword',
  notFound: '404',
}

export const to = {
  root: () => Routes.root,
  auth: () => Routes.auth,
  signIn: () => Routes.signIn,
  loginResident: () => Routes.loginResident,
  register: () => Routes.register,
  resetPassword: () => Routes.resetPassword,
  notFound: () => Routes.notFound,
}
