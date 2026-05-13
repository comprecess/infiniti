import { useEffect, useState } from 'react'

import styles from './PredefinedRepliesPage.module.scss'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { TextEditor } from '../../../../shared/ui/TextEditor/TextEditor'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

const MOCK_REPLIES = [
  { id: 1, title: 'Thank you for contacting us', message: '<p>Thank you for reaching out. We have received your ticket and will get back to you shortly.</p>' },
  { id: 2, title: 'Issue resolved', message: '<p>We are happy to inform you that the issue has been resolved. Please let us know if you need further assistance.</p>' },
  { id: 3, title: 'Additional information required', message: '<p>To better assist you, could you please provide additional details about the issue?</p>' },
]

export const AdminPredefinedRepliesPage = () => {
  const [replies, setReplies] = useState(MOCK_REPLIES)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { document.title = 'infiniti | Predefined Replies' }, [])

  const openAdd = () => {
    setEditingId(null)
    setTitle('')
    setMessage('')
    setIsModalOpen(true)
  }

  const openEdit = (reply: any) => {
    setEditingId(reply.id)
    setTitle(reply.title)
    setMessage(reply.message)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!title) return
    if (editingId) {
      setReplies(prev => prev.map(r => r.id === editingId ? { ...r, title, message } : r))
    } else {
      setReplies(prev => [...prev, { id: Date.now(), title, message }])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setReplies(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <TitlePage title='Predefined Replies' />
        <ButtonBlue title='Add Reply' icon='/icons/plus.svg' onClick={openAdd} />
      </div>

      <RecentCard title='Canned Responses' style={styles.card}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Title</span>
            <span className={styles.actionsHeader}>Manage</span>
          </div>
          {replies.length === 0 ? (
            <div className={styles.empty}>No predefined replies found</div>
          ) : replies.map(reply => (
            <div key={reply.id} className={styles.tableRow}>
              <span className={styles.title}>{reply.title}</span>
              <div className={styles.actions}>
                <ButtonBlue title='Edit' onClick={() => openEdit(reply)} style={styles.btnEdit} />
                <button className={styles.btnDelete} onClick={() => handleDelete(reply.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </RecentCard>

      <CustomModalWindow maxWidth='560px' isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>{editingId ? 'Edit Reply' : 'Add Predefined Reply'}</h4>
            <div className={styles.cross} onClick={() => setIsModalOpen(false)}><CrossIcon /></div>
          </div>
          <div className={styles.modalBody}>
            <CustomInput title='Title' type='text' id='title' name='title' value={title}
              onChange={(_n, v) => setTitle(String(v))} />
            <div className={styles.editorWrapper}>
              <span className={styles.fieldLabel}>Message</span>
              <TextEditor key={editingId ?? 'new'} fieldName='message' setValue={setMessage} defaultValue={message} />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <ButtonBlue title='Save' onClick={handleSave} />
          </div>
        </div>
      </CustomModalWindow>
    </div>
  )
}
