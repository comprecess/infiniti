import { useEffect, useRef } from 'react'

import styles from './Item.module.scss'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'

interface ItemProps {
  title: string
  content: string
  forceShow?: boolean
}

/**
 * After the HTML is injected via dangerouslySetInnerHTML we wrap every <table>
 * in a scrollable div so wide tables swipe left/right independently without
 * shifting the whole page.  A right-edge fade-out hint tells the user the
 * table is wider than the screen.
 */
function wrapTables(container: HTMLDivElement) {
  const tables = container.querySelectorAll<HTMLTableElement>('table:not(.wrapped)')

  tables.forEach(table => {
    // Already wrapped — skip
    if (table.parentElement?.classList.contains('table-scroll-wrap')) return

    const wrapper = document.createElement('div')
    wrapper.className = 'table-scroll-wrap'

    table.parentNode!.insertBefore(wrapper, table)
    wrapper.appendChild(table)
    table.classList.add('wrapped')

    // Hide the fade hint once the user starts scrolling
    wrapper.addEventListener('scroll', () => {
      wrapper.classList.add('scrolled')
    }, { passive: true })
  })
}

export const Item = ({ title, content, forceShow }: ItemProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const safeHTML = sanitizeMessage(content)

  const isEmpty = content === null || content === '' || content === '<p><br></p>'

  // Run after every render in case content changes
  useEffect(() => {
    if (containerRef.current) {
      wrapTables(containerRef.current)
    }
  })

  if (!forceShow && isEmpty) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: safeHTML }}
        className='dangerouslySetInnerHTML'
      />
    </div>
  )
}
