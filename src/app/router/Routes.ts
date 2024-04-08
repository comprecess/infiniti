export const Routes = {
  root: '/',
  auth: '/auth',
  notFound: '/404',
}

export const to = {
  root: () => Routes.root,
  auth: () => Routes.auth,
  notFound: () => Routes.notFound,
}
