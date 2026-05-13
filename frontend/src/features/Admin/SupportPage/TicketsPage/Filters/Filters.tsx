import { useState } from 'react'

import styles from './Filters.module.scss'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'

interface FiltersProps {
  inputData: any
  onApply: (filters: {
    status?: string
    department_id?: number
    assigned_to?: number
    client_id?: number
    search?: string
  }) => void
}

export const Filters = ({ inputData, onApply }: FiltersProps) => {
  const [status, setStatus]           = useState<number>(0)
  const [departmentId, setDepartmentId] = useState<number>(0)
  const [assignedTo, setAssignedTo]   = useState<number>(0)
  const [clientId, setClientId]       = useState<number>(0)
  const [search, setSearch]           = useState('')

  const departments: any[]  = inputData?.department ?? []
  const statuses: string[]  = inputData?.statuses   ?? ['Open', 'Answered', 'Closed']
  const staff: any[]        = inputData?.staff       ?? []
  const customers: any[]    = inputData?.customers   ?? []

  const handleApply = () => {
    onApply({
      status:        statuses[status - 1],
      department_id: departmentId || undefined,
      assigned_to:   assignedTo   || undefined,
      client_id:     clientId     || undefined,
      search:        search       || undefined,
    })
  }

  return (
    <div className={styles.wrapper}>
      <CustomSelect
        title='Status'
        titleOnChange='status'
        placeholder='All'
        idList={statuses.map((_, i) => i + 1)}
        nameList={statuses}
        value={status}
        onChange={(_, val) => setStatus(val)}
      />
      <CustomSelect
        title='Department'
        titleOnChange='department'
        placeholder='All'
        idList={departments.map((d: any) => d.id)}
        nameList={departments.map((d: any) => d.name)}
        value={departmentId}
        onChange={(_, val) => setDepartmentId(val)}
      />
      <CustomSelect
        title='Staff'
        titleOnChange='staff'
        placeholder='All'
        idList={staff.map((s: any) => s.id)}
        nameList={staff.map((s: any) => s.name)}
        value={assignedTo}
        onChange={(_, val) => setAssignedTo(val)}
      />
      <CustomSelect
        title='Customer'
        titleOnChange='customer'
        placeholder='All'
        idList={customers.map((c: any) => c.id)}
        nameList={customers.map((c: any) => c.name)}
        value={clientId}
        onChange={(_, val) => setClientId(val)}
      />
      <CustomInput
        title='Search'
        type='text'
        id='search'
        name='search'
        value={search}
        onChange={(_name, value) => setSearch(String(value))}
      />
      <ButtonBlue title='Apply' style={styles.buttonSubmit} onClick={handleApply} />
    </div>
  )
}
