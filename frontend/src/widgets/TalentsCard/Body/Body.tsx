import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Body.module.scss'
import { Item } from './Item/Item'

interface BodyProps {
  industries: []
  keySkills: []
}

export const Body: FC<BodyProps> = ({ industries, keySkills }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <Item
        title={t('admin-catalog-talents-page-talent-card-skill-1')}
        tags={industries}
      />
      <Item
        title={t('admin-catalog-talents-page-talent-card-skill-2')}
        tags={keySkills}
      />
    </div>
  )
}
