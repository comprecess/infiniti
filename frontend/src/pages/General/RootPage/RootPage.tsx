import { FC, useEffect } from 'react'

export const RootPage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Root'
  }, [])

  return <div />
}
