import { useEffect } from 'react'

export const ClientKnowledgeBasePage = () => {
  useEffect(() => {
    document.title = 'infiniti | Knowledge Base'
  }, [])

  return <div>Client Knowledge Base Page</div>
}
