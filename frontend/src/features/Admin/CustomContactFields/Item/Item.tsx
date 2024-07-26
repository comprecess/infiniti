import { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  id: number
  title: string
  description: string
  editField: (id: number) => void
  deleteField: (id: number) => void
}

export const Item: FC<ItemProps> = ({
  id,
  title,
  description,
  editField,
  deleteField,
}) => {
  const handleEditField = () => {
    editField(id)
  }

  const handleDeleteField = () => {
    deleteField(id)
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      {description && (
        <span className={styles.description}>{description}</span>
      )}
      <div className={styles.buttonsList}>
        <button className={styles.buttonEdit} onClick={handleEditField}>
          <img src='/icons/edit.svg' alt='Icon' className={styles.icon} />
          <span className={styles.textButton}>Edit</span>
        </button>
        <button
          className={styles.buttonDelete}
          onClick={handleDeleteField}
        >
          <img src='/icons/trash.svg' alt='Icon' className={styles.icon} />
          <span className={styles.textButton}>Delete</span>
        </button>
      </div>
    </div>
  )
}
