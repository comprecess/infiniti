import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './ViewTicketPage.module.scss'
import { getAdminTicket } from '../../../../shared/utils/api/Admin/Tickets/get-ticket'
import { putUpdateAdminTicket } from '../../../../shared/utils/api/Admin/Tickets/put-update-ticket'
import { postAdminTicketReply } from '../../../../shared/utils/api/Admin/Tickets/post-ticket-reply'
import { getAdminTicketsInputData } from '../../../../shared/utils/api/Admin/Tickets/get-tickets-input-data'
import { BackButton } from '../../../../shared/ui/BackButton/BackButton'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { TextEditor } from '../../../../shared/ui/TextEditor/TextEditor'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { CustomMiniButton } from '../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'

const STATUSES = ['Open', 'On Hold', 'Escalated', 'Closed']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

export const AdminViewTicketPage = () => {
  const id = useIdFromUrl('ticket')
  const navigate = useNavigate()

  const [ticket, setTicket] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [inputData, setInputData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'tasks'>('details')
  const [replyType, setReplyType] = useState<'Customer' | 'Internal'>('Customer')
  const [replyMessage, setReplyMessage] = useState('')
  const [replyEditorKey, setReplyEditorKey] = useState(0)

  // sidebar form state
  const [deptId, setDeptId] = useState(0)
  const [assignId, setAssignId] = useState(0)
  const [status, setStatus] = useState('Open')
  const [email, setEmail] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [noteKey, setNoteKey] = useState(0)

  // edit modal
  const [editModal, setEditModal] = useState(false)
  const [editBody, setEditBody] = useState('')

  // predefined modal
  const [predefinedModal, setPredefinedModal] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const MOCK_PREDEFINED = [
    { id: 1, title: 'Thank you for contacting us', message: '<p>Thank you for reaching out. We will get back to you shortly.</p>' },
    { id: 2, title: 'Issue resolved', message: '<p>We are happy to inform you that the issue has been resolved.</p>' },
    { id: 3, title: 'Additional information required', message: '<p>Could you please provide additional details about the issue?</p>' },
  ]

  const load = async () => {
    if (id === undefined || id === null) return
    setLoading(true)
    const [ticketRes, inputRes] = await Promise.all([
      getAdminTicket(id),
      inputData ? Promise.resolve({ status: true, data: inputData }) : getAdminTicketsInputData(),
    ])
    if (ticketRes.status) {
      const t = ticketRes.data.data
      setTicket(t)
      setReplies(t.replies ?? [])
      setDeptId(t.department?.id ?? 0)
      setAssignId(t.assigned_to?.id ?? 0)
      setStatus(t.status ?? 'Open')
      setEmail(t.email ?? '')
      setCc(t.cc ?? '')
      setBcc(t.bcc ?? '')
      setPhone(t.phone ?? '')
      setNote(t.note ?? '')
      setNoteKey(k => k + 1)
    }
    if (inputRes.status && !inputData) setInputData(inputRes.data)
    setLoading(false)
  }

  useEffect(() => {
    document.title = 'infiniti | Ticket'
    load()
  }, [id])

  const handleSave = async () => {
    if (!ticket) return
    setSaving(true)
    await putUpdateAdminTicket(ticket.id, { department_id: deptId, assigned_to: assignId, status, email, cc, bcc, phone, note })
    setSaving(false)
  }

  const handleSend = async () => {
    if (!ticket || !replyMessage) return
    setSending(true)
    const res = await postAdminTicketReply(ticket.id, { body: replyMessage, reply_type: replyType })
    if (res.status) {
      setReplies(prev => [...prev, res.data])
      setReplyMessage('')
      setReplyEditorKey(k => k + 1)
    }
    setSending(false)
  }

  const deptIdList = (inputData?.departments ?? []).map((d: any) => d.id)
  const deptNameList = (inputData?.departments ?? []).map((d: any) => d.name)
  const staffIdList = [0, ...(inputData?.staff ?? []).map((s: any) => s.id)]
  const staffNameList = ['None', ...(inputData?.staff ?? []).map((s: any) => s.name)]
  const statusIdList = STATUSES.map((_, i) => i + 1)
  const statusNameList = [...STATUSES]

  const priorityColor = (p: string) => ['High', 'Critical', 'Medium'].includes(p) ? styles.priorityRed : styles.priorityGreen

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : ''

  if (loading) return (
    <div className={styles.loadingWrapper}><LoadingSpinner size='xl' /></div>
  )

  if (!ticket) return (
    <div className={styles.loadingWrapper}><span>Ticket not found</span></div>
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <h2 className={styles.pageTitle}>{ticket.subject}</h2>
        <BackButton />
      </div>

      <div className={styles.layout}>
        {/* ── LEFT PANEL ── */}
        <div className={styles.sidebar}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === 'details' ? styles.tabActive : ''}`} onClick={() => setActiveTab('details')}>
              Details
            </button>
            <button className={`${styles.tab} ${activeTab === 'tasks' ? styles.tabActive : ''}`} onClick={() => setActiveTab('tasks')}>
              Tasks
            </button>
          </div>

          {activeTab === 'details' && (
            <div className={styles.details}>
              <div className={styles.metaRow}>
                <div>
                  Priority: <span className={`${styles.priorityBadge} ${priorityColor(ticket.urgency ?? ticket.priority)}`}>
                    {ticket.urgency ?? ticket.priority}
                  </span>
                </div>
                <div>Status: <span className={styles.statusText}>{ticket.status}</span></div>
              </div>

              <div className={styles.divider} />

              <p className={styles.metaLine}><strong>Ticket:</strong> {ticket.tid ?? ticket.code}</p>
              <p className={styles.metaLine}><strong>Customer:</strong> {ticket.client?.name ?? ticket.account}</p>

              <div className={styles.divider} />

              <div className={styles.actionButtons}>
                <ButtonBlue title='Add Reply' onClick={() => {}} style={styles.btnAddReply} />
                <CustomMiniButton style='cherry' icon='/icons/trash.svg' alt='Delete' tooltipTitle='Delete' onClick={() => {}} />
              </div>

              <div className={styles.divider} />

              <div className={styles.fields}>
                <CustomSelect
                  title='Department'
                  idList={deptIdList}
                  nameList={deptNameList}
                  value={deptId}
                  onChange={(_n, v) => setDeptId(Number(v))}
                />
                <CustomSelect
                  title='Assigned to'
                  idList={staffIdList}
                  nameList={staffNameList}
                  value={assignId}
                  onChange={(_n, v) => setAssignId(Number(v))}
                />
                <CustomSelect
                  title='Status'
                  idList={statusIdList}
                  nameList={statusNameList}
                  value={statusIdList[STATUSES.indexOf(status)] ?? 1}
                  onChange={(_n, v) => setStatus(STATUSES[statusIdList.indexOf(Number(v))] ?? 'Open')}
                />
                <CustomInput title='Email' type='text' id='email' name='email' value={email}
                  onChange={(_n, v) => setEmail(String(v))} />
                <CustomInput title='Cc' type='text' id='cc' name='cc' value={cc}
                  onChange={(_n, v) => setCc(String(v))} />
                <CustomInput title='Bcc' type='text' id='bcc' name='bcc' value={bcc}
                  onChange={(_n, v) => setBcc(String(v))} />
                <CustomInput title='Phone' type='text' id='phone' name='phone' value={phone}
                  onChange={(_n, v) => setPhone(String(v))} />

                <div className={styles.noteSection}>
                  <span className={styles.fieldLabel}>Note</span>
                  <TextEditor key={noteKey} fieldName='note' setValue={setNote} defaultValue={note} />
                </div>

                <ButtonBlue title={saving ? 'Saving...' : 'Save'} onClick={handleSave} />
              </div>

              <div className={styles.divider} />

              <div className={styles.prevConversations}>
                <span className={styles.prevTitle}>Previous Conversations</span>
                <span className={styles.prevEmpty}>No data to display.</span>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className={styles.tasks}>
              <CustomInput title='Task' type='text' id='task' name='task' value=''
                onChange={() => {}} />
              <ButtonBlue title='Save' onClick={() => {}} />
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={styles.timeline}>
          {/* Original message */}
          <div className={styles.timeLabel}>{formatDate(ticket.created_at)}</div>

          <div className={styles.timelineItem}>
            <div className={styles.avatar}>
              {(ticket.client?.name ?? ticket.account ?? '?')[0].toUpperCase()}
            </div>
            <div className={styles.messageCard}>
              <span className={styles.authorName}>{ticket.client?.name ?? ticket.account}</span>
              <div className={styles.messageBody} dangerouslySetInnerHTML={{ __html: ticket.message ?? ticket.subject }} />
              <div className={styles.messageActions}>
                <CustomMiniButton style='amber' icon='/icons/edit.svg' alt='Edit' tooltipTitle='Edit' onClick={() => { setEditBody(ticket.message ?? ticket.subject ?? ''); setEditModal(true) }} />
              </div>
            </div>
          </div>

          {/* Replies */}
          {replies.map((reply: any) => (
            <Fragment key={reply.id}>
              <div className={styles.timeLabel}>{formatDate(reply.created_at)}</div>
              <div className={styles.timelineItem}>
                <div className={`${styles.avatar} ${reply.author_info?.type === 'admin' ? styles.avatarAdmin : ''}`}>
                  {(reply.author_info?.name ?? '?')[0].toUpperCase()}
                </div>
                <div className={`${styles.messageCard} ${reply.reply_type === 'internal' ? styles.messageInternal : ''}`}>
                  <span className={styles.authorName}>{reply.author_info?.name}</span>
                  <div className={styles.messageBody} dangerouslySetInnerHTML={{ __html: reply.body }} />
                </div>
              </div>
            </Fragment>
          ))}

          {/* Add Reply */}
          <div className={styles.addReplyLabel}>Add Reply</div>

          <div className={styles.replySection}>
            <div className={styles.avatar}>A</div>
            <div className={styles.replyCard}>
              {/* Customer / Internal tabs */}
              <div className={styles.replyTabs}>
                <button
                  className={`${styles.replyTab} ${replyType === 'Customer' ? styles.replyTabActive : ''}`}
                  onClick={() => setReplyType('Customer')}
                >Customer</button>
                <button
                  className={`${styles.replyTab} ${replyType === 'Internal' ? styles.replyTabActive : ''}`}
                  onClick={() => setReplyType('Internal')}
                >Internal</button>
              </div>

              <div className={`${styles.editorWrap} ${replyType === 'Internal' ? styles.editorInternal : ''}`}>
                <TextEditor key={replyEditorKey} fieldName='reply' setValue={setReplyMessage} />
              </div>

              <div className={styles.replyFooter}>
                <div className={styles.replyLinks}>
                  <label className={styles.replyLink}>
                    <img src='/icons/paperClip.svg' alt='' className={styles.replyLinkIcon} />
                    Attach File
                    <input type='file' multiple hidden onChange={e => setAttachedFiles(Array.from(e.target.files ?? []))} />
                  </label>
                  <span className={styles.replyDivider}>|</span>
                  <span className={styles.replyLink} onClick={() => setPredefinedModal(true)}>
                    <img src='/icons/elements.svg' alt='' className={styles.replyLinkIcon} />
                    Predefined Reply
                  </span>
                </div>
                <ButtonBlue title={sending ? 'Sending...' : 'Submit'} onClick={handleSend} />
              </div>
              {attachedFiles.length > 0 && (
                <div className={styles.attachedFiles}>
                  {attachedFiles.map((f, i) => (
                    <div key={i} className={styles.attachedFile}>
                      <img src='/icons/paperClip.svg' alt='' className={styles.attachFileIcon} />
                      <span>{f.name}</span>
                      <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <CustomModalWindow maxWidth='580px' isOpen={editModal} onClose={() => setEditModal(false)}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>Edit</h4>
            <div className={styles.modalCross} onClick={() => setEditModal(false)}><CrossIcon /></div>
          </div>
          <TextEditor fieldName='edit' setValue={setEditBody} defaultValue={editBody} />
          <div className={styles.modalFooter}>
            <button className={styles.btnClose} onClick={() => setEditModal(false)}>Close</button>
            <ButtonBlue title='Save' onClick={() => setEditModal(false)} />
          </div>
        </div>
      </CustomModalWindow>

      {/* Predefined Replies Modal */}
      <CustomModalWindow maxWidth='480px' isOpen={predefinedModal} onClose={() => setPredefinedModal(false)}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>Predefined Replies</h4>
            <div className={styles.modalCross} onClick={() => setPredefinedModal(false)}><CrossIcon /></div>
          </div>
          <div className={styles.predefinedList}>
            {MOCK_PREDEFINED.map(r => (
              <div key={r.id} className={styles.predefinedItem}
                onClick={() => { setReplyMessage(r.message); setReplyEditorKey(k => k + 1); setPredefinedModal(false) }}>
                {r.title}
              </div>
            ))}
          </div>
        </div>
      </CustomModalWindow>
    </div>
  )
}
