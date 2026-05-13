import { useEffect, useState } from 'react'
import { CrossIcon } from '../../icons/CrossIcon'
import { ButtonBlue } from '../ButtonBlue/ButtonBlue'
import { CustomModalWindow } from '../CustomModalWindow/CustomModalWindow'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'
import { getEmailTemplates, EmailTemplate } from '../../utils/api/Admin/EmailTemplates/get-email-templates'
import { getRenderEmailTemplate } from '../../utils/api/Admin/EmailTemplates/get-render-email-template'
import styles from './ChooseTemplateModal.module.scss'

interface Props {
  isOpen: boolean
  onClose: () => void
  contactId?: number
  onSelect: (subject: string, body: string) => void
}

export const ChooseTemplateModal = ({ isOpen, onClose, contactId, onSelect }: Props) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState<number | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    getEmailTemplates().then(res => {
      if (res.status) setTemplates(res.data)
      setLoading(false)
    })
  }, [isOpen])

  const handleSelect = async (tpl: EmailTemplate) => {
    setApplying(tpl.id)
    const res = await getRenderEmailTemplate(tpl.id, contactId)
    setApplying(null)
    if (res.status && res.data) {
      onSelect(res.data.subject, res.data.body)
      onClose()
    }
  }

  return (
    <CustomModalWindow maxWidth='480px' isOpen={isOpen} onClose={onClose}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Choose from Template</h4>
          <div className={styles.cross} onClick={onClose}>
            <CrossIcon />
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        ) : templates.length === 0 ? (
          <p className={styles.empty}>No templates found. Add them in Settings → Email Templates.</p>
        ) : (
          <div className={styles.list}>
            {templates.map(tpl => (
              <div key={tpl.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{tpl.name}</span>
                  <span className={styles.itemSubject}>{tpl.subject}</span>
                </div>
                <ButtonBlue
                  title={applying === tpl.id ? '...' : 'Use'}
                  onClick={() => handleSelect(tpl)}
                  style={styles.useButton}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomModalWindow>
  )
}
