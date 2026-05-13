import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './OpenNewTicketPage.module.scss'
import { Routes } from '../../../../app/router/routes'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import { Fields } from '../../../../features/Client/TicketsPage/Fields/Fields'
import { getClientTicketsInputData } from '../../../../shared/utils/api/Client/Tickets/get-tickets-input-data'
import { postCreateClientTicket } from '../../../../shared/utils/api/Client/Tickets/post-create-ticket'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'

export const ClientOpenNewTicketPage = () => {
  const navigate = useNavigate()
  const [inputData, setInputData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'infiniti | New Ticket'
    getClientTicketsInputData().then(res => {
      if (res.status) setInputData(res.data)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (formData: {
    subject: string
    department_id?: number | null
    priority?: string
    message: string
  }) => {
    setSubmitting(true)
    setError(null)
    const res = await postCreateClientTicket(formData)
    setSubmitting(false)
    if (res.status) {
      navigate(`/${Routes.clientPages}/${Routes.tickets}`)
    } else {
      setError(res.message)
    }
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard title='New Ticket' style={styles.recentFullScreen}>
          {loading ? (
            <div className={styles.loading}>
              <LoadingSpinner size='xl' />
            </div>
          ) : (
            <Fields
              inputData={inputData}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
            />
          )}
        </RecentCard>
      </section>
    </div>
  )
}
