import styles from './Item.module.scss'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'

interface ItemProps {
  title: string
  content: string
  forceShow?: boolean
}

export const Item = ({ title, content, forceShow }: ItemProps) => {
  const safeHTML = sanitizeMessage(content)

  const isEmpty = content === null || content === '' || content === '<p><br></p>'

  if (!forceShow && isEmpty) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <div dangerouslySetInnerHTML={{ __html: safeHTML }} className='dangerouslySetInnerHTML' />
    </div>
  )
}
