import { FC, PropsWithChildren, useState } from 'react'

import { ChevronExpandMoreVert } from './ChevronExpandMoreVert/ChevronExpandMoreVert'
import styles from './RecentCard.module.scss'
import { UpdateExpandMoreVert } from './RefreshExpandMoreVert/UpdateExpandMoreVert'

interface RecentCardProps {
  title?: string
  style?: string
  refreshIcon?: boolean
  ordinaryIcons?: boolean
  Component?: React.FC<any>
  componentProps?: any
}

export const RecentCard: FC<PropsWithChildren<RecentCardProps>> = ({
  title,
  style,
  refreshIcon = false,
  ordinaryIcons = false,
  Component,
  componentProps,
  children,
}) => {
  const [openContent, setOpenContent] = useState<boolean>(false)

  const handleChevronClick = () => {
    setOpenContent(!openContent)
  }

  return (
    <div className={`${styles.wrapper} ${style}`}>
      <div className={styles.items}>
        {title ? <h6 className={styles.title}>{title}</h6> : null}
        <div>
          {Component ? <Component {...componentProps} /> : null}
          {refreshIcon ? <UpdateExpandMoreVert /> : null}
          {ordinaryIcons ? (
            <ChevronExpandMoreVert
              openContent={openContent}
              handleChevronClick={handleChevronClick}
            />
          ) : null}
        </div>
      </div>
      <div className={!openContent ? styles.content : styles.childNone}>
        {children}
      </div>
    </div>
  )
}
