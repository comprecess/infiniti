export function loadStorage<T>(name: string): T | null {
  const data = localStorage.getItem(name)

  return data ? (JSON.parse(data) as T) : null
}
