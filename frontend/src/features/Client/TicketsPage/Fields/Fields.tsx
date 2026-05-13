import { useState } from 'react'

import styles from './Fields.module.scss'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../shared/ui/TextEditor/TextEditor'

interface FieldsProps {
  inputData: any
  onSubmit: (data: {
    subject: string
    department_id?: number | null
    priority?: string
    message: string
  }) => void
  submitting?: boolean
  error?: string | null
}

export const Fields = ({ inputData, onSubmit, submitting, error }: FieldsProps) => {
  const [subject, setSubject]         = useState('')
  const [departmentId, setDepartmentId] = useState<number | null>(null)
  const [priority, setPriority]       = useState('Medium')
  const [message, setMessage]         = useState('')

  const departments: any[]  = inputData?.department ?? []
  const priorities: string[] = inputData?.priority   ?? ['Low', 'Medium', 'High', 'Critical']

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) return
    onSubmit({ subject, department_id: departmentId, priority, message })
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Subject'
        type='text'
        id='subject'
        name='subject'
        value={subject}
        onChange={(_name, value) => setSubject(String(value))}
      />
      <div className={styles.selections}>
        <CustomSelect
          title='Department'
          titleOnChange='department'
          idList={departments.map((d: any) => d.id)}
          nameList={departments.map((d: any) => d.name)}
          onChange={(_, val) => setDepartmentId(val ? Number(val) : null)}
        />
        <CustomSelect
          title='Priority'
          titleOnChange='priority'
          idList={priorities}
          nameList={priorities}
          value={priority}
          onChange={(_, val) => setPriority(val as string)}
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Description</span>
        <TextEditor fieldName='description' setValue={val => setMessage(val)} />
      </div>
      {error && <span className={styles.error}>{error}</span>}
      <ButtonBlue
        title={submitting ? 'Submitting…' : 'Submit'}
        style={styles.buttonSave}
        onClick={handleSubmit}
      />
    </div>
  )
}
