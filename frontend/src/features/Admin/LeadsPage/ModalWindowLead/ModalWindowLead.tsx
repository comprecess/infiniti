import styles from './ModalWindowLead.module.scss'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'

const STATUSES = ['New', 'Open', 'In Progress', 'Open Deal', 'Unqualified', 'Attempted to Contact', 'Connected', 'Bad Timing']
const SOURCES = ['Website', 'Facebook', 'Advertisement', 'Partner', 'Employee Referral', 'Trade Show', 'Webinar', 'Other']

export interface LeadFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  title: string
  status: string
  source: string
  website: string
}

interface ModalWindowLeadProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  onSave: () => void
  formData: LeadFormData
  onChange: (name: string, value: string | number) => void
}

export const ModalWindowLead = ({
  isOpen,
  title = 'New Lead',
  onClose,
  onSave,
  formData,
  onChange,
}: ModalWindowLeadProps) => {
  return (
    <CustomModalWindow maxWidth='800px' isOpen={isOpen} onClose={onClose}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          <div className={styles.cross} onClick={onClose}>
            <CrossIcon />
          </div>
        </div>

        <div className={styles.containers}>
          <div className={styles.leftContainer}>
            <CustomInput
              title='First Name *'
              type='text'
              id='first_name'
              name='first_name'
              value={formData.first_name}
              onInputChange={false}
              onChange={onChange}
            />
            <CustomInput
              title='Last Name'
              type='text'
              id='last_name'
              name='last_name'
              value={formData.last_name}
              onInputChange={false}
              onChange={onChange}
            />
            <CustomInput
              title='Email'
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onInputChange={false}
              onChange={onChange}
            />
            <CustomInput
              title='Phone'
              type='text'
              id='phone'
              name='phone'
              value={formData.phone}
              onInputChange={false}
              onChange={onChange}
            />
          </div>

          <div className={styles.rightContainer}>
            <CustomInput
              title='Company'
              type='text'
              id='company'
              name='company'
              value={formData.company}
              onInputChange={false}
              onChange={onChange}
            />
            <CustomInput
              title='Title / Position'
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onInputChange={false}
              onChange={onChange}
            />
            <CustomInput
              title='Website'
              type='text'
              id='website'
              name='website'
              placeHolder='https://'
              value={formData.website}
              onInputChange={false}
              onChange={onChange}
            />

            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Status</label>
              <select
                className={styles.select}
                value={formData.status}
                onChange={e => onChange('status', e.target.value)}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Source</label>
              <select
                className={styles.select}
                value={formData.source}
                onChange={e => onChange('source', e.target.value)}
              >
                <option value=''>— Select Source —</option>
                {SOURCES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <ButtonBlue title='Save Lead' style={styles.buttonSave} onClick={onSave} />
      </div>
    </CustomModalWindow>
  )
}
