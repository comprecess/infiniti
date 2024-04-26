export function sumAmountsAndFormat(carts: number[]): string {
  const filteredCarts = carts.map(item => (isNaN(item) ? 0 : item))

  if (filteredCarts.length === 0) {
    return '0 $'
  }

  const total: number = filteredCarts.reduce((acc, curr) => acc + curr, 0)

  const formattedTotal: string = total.toLocaleString()

  const stringWithoutSpaces = formattedTotal.replace(/\s/g, '')

  const formattedString = stringWithoutSpaces.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    '$1,',
  )

  return `${formattedString} $`
}
