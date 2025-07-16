import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import styles from './Item.module.scss'

interface ItemProps {
  title: string
  content: string
}

export const Item = ({ title, content }: ItemProps) => {
  const safeHTML = sanitizeMessage(content)

  if (content === null || content === '' || content === '<p><br></p>') {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <div
        dangerouslySetInnerHTML={{ __html: safeHTML }}
        className={styles.content}
      />
    </div>
  )
}
