import { useEffect, useState } from 'react'

import styles from './DepartmentsPage.module.scss'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

const MOCK_DEPARTMENTS = [
  { id: 1, dname: 'Billing', email: 'billing@infiniti.stream', hidden: false },
  { id: 2, dname: 'Technical', email: 'tech@infiniti.stream', hidden: false },
  { id: 3, dname: 'Sales', email: 'sales@infiniti.stream', hidden: true },
]

const emptyForm = { dname: '', email: '', host: '', port: '', password: '', encryption: 'tls', hidden: false, delete_after_import: false }

export const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  useEffect(() => { document.title = 'infiniti | Departments' }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setIsModalOpen(true)
  }

  const openEdit = (dep: any) => {
    setEditingId(dep.id)
    setForm({ dname: dep.dname, email: dep.email, host: dep.host ?? '', port: dep.port ?? '', password: '', encryption: dep.encryption ?? 'tls', hidden: dep.hidden, delete_after_import: dep.delete_after_import ?? false })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!form.dname) return
    if (editingId) {
      setDepartments(prev => prev.map(d => d.id === editingId ? { ...d, ...form } : d))
    } else {
      setDepartments(prev => [...prev, { id: Date.now(), ...form }])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setDepartments(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <TitlePage title='Departments' />
        <ButtonBlue title='Add Department' icon='/icons/plus.svg' onClick={openAdd} />
      </div>

      <RecentCard title='Support Ticket Departments' style={styles.card}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Department Name</span>
            <span>Email</span>
            <span>Status</span>
            <span className={styles.actions}>Manage</span>
          </div>
          {departments.length === 0 ? (
            <div className={styles.empty}>No departments found</div>
          ) : departments.map(dep => (
            <div key={dep.id} className={styles.tableRow}>
              <span className={styles.name}>{dep.dname}</span>
              <span className={styles.email}>{dep.email}</span>
              <span>
                <span className={dep.hidden ? styles.badgeInactive : styles.badgeActive}>
                  {dep.hidden ? 'Inactive' : 'Active'}
                </span>
              </span>
              <div className={styles.actions}>
                <ButtonBlue title='Edit' onClick={() => openEdit(dep)} style={styles.btnEdit} />
                <button className={styles.btnDelete} onClick={() => handleDelete(dep.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </RecentCard>

      <CustomModalWindow maxWidth='540px' isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>{editingId ? 'Edit Department' : 'Add New Department'}</h4>
            <div className={styles.cross} onClick={() => setIsModalOpen(false)}><CrossIcon /></div>
          </div>
          <div className={styles.modalBody}>
            <CustomInput title='Department Name' type='text' id='dname' name='dname' value={form.dname}
              onChange={(_n, v) => setForm(f => ({ ...f, dname: String(v) }))} />
            <CustomInput title='Email' type='text' id='email' name='email' value={form.email}
              onChange={(_n, v) => setForm(f => ({ ...f, email: String(v) }))} />
            <CustomInput title='IMAP Host' type='text' id='host' name='host' value={form.host}
              onChange={(_n, v) => setForm(f => ({ ...f, host: String(v) }))} />
            <CustomInput title='IMAP Port' type='text' id='port' name='port' value={form.port}
              onChange={(_n, v) => setForm(f => ({ ...f, port: String(v) }))} />
            <CustomInput title='Password' type='password' id='password' name='password' value={form.password}
              onChange={(_n, v) => setForm(f => ({ ...f, password: String(v) }))} />
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Encryption</span>
              <div className={styles.radioGroup}>
                {['tls', 'ssl', 'none'].map(enc => (
                  <label key={enc} className={styles.radioLabel}>
                    <input type='radio' name='encryption' value={enc}
                      checked={form.encryption === enc}
                      onChange={() => setForm(f => ({ ...f, encryption: enc }))} />
                    {enc.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type='checkbox' checked={form.hidden}
                  onChange={e => setForm(f => ({ ...f, hidden: e.target.checked }))} />
                Hide from client
              </label>
              <label className={styles.checkboxLabel}>
                <input type='checkbox' checked={form.delete_after_import}
                  onChange={e => setForm(f => ({ ...f, delete_after_import: e.target.checked }))} />
                Delete mail after import
              </label>
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
