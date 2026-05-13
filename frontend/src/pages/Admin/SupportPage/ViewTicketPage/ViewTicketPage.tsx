import { useEffect, useState } from 'react'

import styles from './ViewTicketPage.module.scss'
import { getAdminTicket } from '../../../../shared/utils/api/Admin/Tickets/get-ticket'
import { putUpdateAdminTicket } from '../../../../shared/utils/api/Admin/Tickets/put-update-ticket'
import { postAdminTicketReply } from '../../../../shared/utils/api/Admin/Tickets/post-ticket-reply'
import { getAdminTicketsInputData } from '../../../../shared/utils/api/Admin/Tickets/get-tickets-input-data'
import { InfoItem } from '../../../../features/Admin/CustomersPage/ViewPage/Pages/SummaryPage/InfoItem/InfoItem'
import { Message } from '../../../../features/Client/ViewTicketPage/Message/Message'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { BackButton } from '../../../../shared/ui/BackButton/BackButton'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { Status } from '../../../../shared/ui/Status/Status'
import { TextEditor } from '../../../../shared/ui/TextEditor/TextEditor'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'

const PRIORITY = ['Low', 'Medium', 'High', 'Critical']
const STATUS   = ['Open', 'Answered', 'Closed']

export const AdminViewTicketPage = () => {
  const id = useIdFromUrl('ticket')

  const [ticket, setTicket]       = useState<any>(null)
  const [inputData, setInputData] = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [sending, setSending]     = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [replyError, setReplyError] = useState<string | null>(null)

  // sidebar form state
  const [deptId, setDeptId]     = useState<number>(0)
  const [assignId, setAssignId] = useState<number>(0)
  const [statusVal, setStatus]  = useState<number>(0)
  const [priorityVal, setPriority] = useState<number>(0)
  const [email, setEmail]   = useState('')
  const [cc, setCc]         = useState('')
  const [bcc, setBcc]       = useState('')
  const [phone, setPhone]   = useState('')
  const [note, setNote]     = useState('')

  const loadTicket = async () => {
    if (id === undefined || id === null) return
    setLoading(true)
    const [ticketRes, inputRes] = await Promise.all([
      getAdminTicket(id),
      inputData ? Promise.resolve({ status: true, data: inputData }) : getAdminTicketsInputData(),
    ])
    if (ticketRes.status) {
      const t = ticketRes.data.data
      setTicket(t)
      // populate sidebar
      setDeptId(t.department?.id ?? 0)
      setAssignId(t.assigned_to?.id ?? 0)
      setStatus(STATUS.indexOf(t.status) + 1)
      setPriority(PRIORITY.indexOf(t.priority) + 1)
      setEmail(t.email ?? '')
      setCc(t.cc ?? '')
      setBcc(t.bcc ?? '')
      setPhone(t.phone ?? '')
      setNote(t.note ?? '')
    }
    if (inputRes.status && !inputData) setInputData(inputRes.data)
    setLoading(false)
  }

  useEffect(() => {
    document.title = 'infiniti | Ticket'
    loadTicket()
  }, [id])

  const handleSave = async () => {
    if (!ticket) return
    setSaving(true)
    setSaveError(null)
    const res = await putUpdateAdminTicket(ticket.id, {
      department_id: deptId   || null,
      assigned_to:   assignId || null,
      status:        STATUS[statusVal - 1],
      priority:      PRIORITY[priorityVal - 1],
      email, cc, bcc, phone, note,
    })
    setSaving(false)
    if (!res.status) setSaveError(res.message)
    else setTicket(res.data.data)
  }

  const handleSend = async (message: string, replyType?: string) => {
    if (!ticket) return
    setSending(true)
    setReplyError(null)
    const res = await postAdminTicketReply(
      ticket.id, message,
      (replyType === 'Internal' ? 'Internal' : 'Customer'),
    )
    setSending(false)
    if (res.status) loadTicket()
    else setReplyError(res.message)
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}><LoadingSpinner size='xl' /></div>
      </div>
    )
  }
  if (!ticket) {
    return <div className={styles.wrapper}><div className={styles.loading}>Ticket not found</div></div>
  }

  const departments: any[] = inputData?.department ?? []
  const staff: any[]       = inputData?.staff      ?? []

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.content}>
          <div className={styles.backButton}><BackButton /></div>
          <div className={styles.titleWrapper}>
            <div className={styles.title}><TitlePage title={ticket.subject} /></div>
            <Status title={ticket.status} status={ticket.status} />
          </div>
          <section className={styles.container}>
            {/* Sidebar */}
            <RecentCard style={styles.cardFirst}>
              <div className={styles.cardFirstContent}>
                <div className={styles.cardFirstHeader}>
                  <InfoItem title='Ticket'   value={ticket.code} />
                  <InfoItem title='Priority' value={ticket.priority} />
                  <InfoItem title='Customer' value={ticket.client?.name ?? '—'} />
                </div>
                <CustomDivider />
                <div className={styles.fields}>
                  <CustomSelect
                    title='Department'
                    titleOnChange='department'
                    placeholder='Select…'
                    idList={departments.map((d: any) => d.id)}
                    nameList={departments.map((d: any) => d.name)}
                    value={deptId}
                    onChange={(_, v) => setDeptId(v)}
                  />
                  <CustomSelect
                    title='Assigned to'
                    titleOnChange='assigned'
                    placeholder='Select…'
                    idList={staff.map((s: any) => s.id)}
                    nameList={staff.map((s: any) => s.name)}
                    value={assignId}
                    onChange={(_, v) => setAssignId(v)}
                  />
                  <CustomSelect
                    title='Status'
                    titleOnChange='status'
                    idList={STATUS.map((_, i) => i + 1)}
                    nameList={STATUS}
                    value={statusVal}
                    onChange={(_, v) => setStatus(v)}
                  />
                  <CustomSelect
                    title='Priority'
                    titleOnChange='priority'
                    idList={PRIORITY.map((_, i) => i + 1)}
                    nameList={PRIORITY}
                    value={priorityVal}
                    onChange={(_, v) => setPriority(v)}
                  />
                  <CustomInput title='Email' type='text' id='email' name='email'
                    value={email} onChange={(_n, v) => setEmail(String(v))} />
                  <CustomInput title='Cc'    type='text' id='cc'    name='cc'
                    value={cc}    onChange={(_n, v) => setCc(String(v))} />
                  <CustomInput title='Bcc'   type='text' id='bcc'   name='bcc'
                    value={bcc}   onChange={(_n, v) => setBcc(String(v))} />
                  <CustomInput title='Phone' type='text' id='phone' name='phone'
                    value={phone} onChange={(_n, v) => setPhone(String(v))} />
                  <div className={styles.containerItems}>
                    <span className={styles.containerItemsTitle}>Note</span>
                    <TextEditor fieldName='note' setValue={setNote} />
                  </div>
                  {saveError && <span className={styles.error}>{saveError}</span>}
                  <ButtonBlue
                    title={saving ? 'Saving…' : 'Save'}
                    style={styles.buttonSave}
                    onClick={handleSave}
                  />
                </div>
              </div>
            </RecentCard>

            {/* Messages thread */}
            <div className={styles.cardSecond}>
              <div className={styles.tickets}>
                {ticket.replies?.map((reply: any, index: number) => (
                  <Message
                    key={reply.id}
                    isAdmin
                    isWriteMessage={false}
                    isLast={index === ticket.replies.length - 1}
                    data={{
                      id: reply.id,
                      date: reply.created_at,
                      account: {
                        name: reply.author?.name ?? '',
                        img:  reply.author?.img  ?? null,
                      },
                      message: reply.message,
                    }}
                    status={ticket.status}
                    isNextWriteMessage={index === ticket.replies.length - 1}
                  />
                ))}
                <Message
                  key='write-message'
                  isAdmin
                  isWriteMessage
                  status={ticket.status}
                  onSend={handleSend}
                  sending={sending}
                  sendError={replyError}
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
