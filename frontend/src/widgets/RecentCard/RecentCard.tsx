import { FC, PropsWithChildren, useState } from 'react'

import { ChevronExpandMoreVert } from './ChevronExpandMoreVert/ChevronExpandMoreVert'
import styles from './RecentCard.module.scss'
import { UpdateExpandMoreVert } from './RefreshExpandMoreVert/UpdateExpandMoreVert'

interface RecentCardProps {
  title?: string
  style?: string
  refreshIcon?: boolean
  ordinaryIcons?: boolean
  HeaderComponent?: React.FC<any>
  PagesComponent?: React.FC<any>
  Component?: React.FC<any>
  componentProps?: any
  headerProps?: any
  pagesProps?: any
}

export const RecentCard: FC<PropsWithChildren<RecentCardProps>> = ({
  title,
  style,
  refreshIcon = false,
  ordinaryIcons = false,
  HeaderComponent,
  PagesComponent,
  Component,
  componentProps,
  headerProps,
  pagesProps,
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
      {HeaderComponent ? (
        <div className={styles.header}>
          <HeaderComponent {...headerProps} />
        </div>
      ) : null}
      <div className={!openContent ? styles.content : styles.childNone}>
        {children}
      </div>
      {PagesComponent ? (
        <div className={styles.pages}>
          <PagesComponent {...pagesProps} />
        </div>
      ) : null}
    </div>
  )
}
