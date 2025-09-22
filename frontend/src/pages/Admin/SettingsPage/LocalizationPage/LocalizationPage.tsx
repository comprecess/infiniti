import { useTranslation } from 'react-i18next'

import styles from './LocalizationPage.module.scss'
import { LanguageSelector } from '../../../../shared/ui/LanguageSelector/LanguageSelector'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminLocalizationPage = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <RecentCard
          style={styles.recentFullScreen}
          title={t('admin-settings-localization-page-title')}
        >
          <div className={styles.fields}>
            <LanguageSelector />
          </div>
        </RecentCard>
      </section>
    </div>
  )
}
