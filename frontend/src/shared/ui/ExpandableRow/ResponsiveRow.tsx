import { useState } from 'react'

import styles from './ResponsiveRow.module.scss'

export interface ResponsiveField {
  label: string
  value: React.ReactNode
  className?: string
  onClick?: () => void
  valueClassName?: string
}

interface ResponsiveRowProps {
  visibleFields: ResponsiveField[]
  hiddenFields?: ResponsiveField[]
  /** Actions rendered outside the gradient mask — visible on both desktop and mobile */
  actions?: React.ReactNode
}

export const ResponsiveRow = ({ visibleFields, hiddenFields = [], actions }: ResponsiveRowProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollRow}>
        <div className={styles.rowMain}>
          {visibleFields.map((field, idx) => (
            <div key={idx} className={`${styles.cell} ${field.className || ''}`}>
              <span className={field.valueClassName} onClick={field.onClick}>
                {field.value}
              </span>
            </div>
          ))}
          {/* Actions sit outside the gradient mask on mobile */}
          {actions && (
            <div className={styles.actionsSlot}>
              {actions}
            </div>
          )}
          {hiddenFields.length > 0 && (
            <button
              className={`${styles.toggle} ${open ? styles.active : ''}`}
              onClick={() => setOpen(p => !p)}
            />
          )}
        </div>
      </div>
      {hiddenFields.length > 0 && (
        <div className={`${styles.panel} ${open ? styles.open : ''}`}>
          {hiddenFields.map((field, idx) => (
            <div key={idx} className={styles.row}>
              <span className={styles.label}>{field.label}</span>
              <span className={field.valueClassName || styles.value} onClick={field.onClick}>
                {field.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
