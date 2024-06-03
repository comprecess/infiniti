import { FC, useEffect } from 'react'

export const ClientKnowledgeBasePage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Knowledge Base'
  }, [])

  return <div>Client Knowledge Base Page</div>
}
