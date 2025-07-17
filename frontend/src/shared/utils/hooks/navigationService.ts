type NavigationListener = (path: string) => void
const listeners = new Set<NavigationListener>()

export const subscribeNavigation = (listener: NavigationListener) => {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

export const navigateTo = (path: string) => {
  listeners.forEach(listener => listener(path))
}
