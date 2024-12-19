import { useEffect } from 'react'

import { ListInfoItem } from '../../../../features/Client/TalentDetailsPage/ListInfoItem/ListInfoItem'
import { TextInfoItem } from '../../../../features/Client/TalentDetailsPage/TextInfoItem/TextInfoItem'
import { TitleCard } from '../../../../features/Client/TalentDetailsPage/TitleCard/TitleCard'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import styles from './ViewBusinessModel.module.scss'

export const AdminViewBusinessModel = () => {
  useEffect(() => {
    document.title = 'infiniti | View Business Models'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.titleModel}>
          <TitlePage title='Финтех платформа для малого и среднего бизнеса' />
        </div>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.rowHalfContainer}>
              <img
                src='/test_1.jpg'
                alt='BusinessModelImg'
                className={styles.businessModelImg}
              />
              <div className={styles.aboutModel}>
                <TitleCard title='About Model' />
                <div className={styles.list}>
                  <TextInfoItem
                    title='Specialization'
                    text='test, test, test'
                  />
                  <ListInfoItem
                    title='Industries'
                    list={[{ id: 0, propId: 0, value: 'test' }]}
                  />
                  <ListInfoItem
                    title='Technologies'
                    list={[{ id: 0, propId: 0, value: 'test' }]}
                  />
                  <TextInfoItem title='Language' text='test, test, test' />
                  <TextInfoItem title='Location' text='test, test, test' />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <TitleCard title='Market Analysis' />
            content
          </div>
          <div className={styles.card}>
            <TitleCard title='Financial Model' />
            content
          </div>
          <div className={styles.card}>
            <TitleCard title='Current Investors' />
            content
          </div>
          <div className={styles.card}>
            <TitleCard title='Implementation Stages' />
            content
          </div>
          <div className={styles.card}>
            <TitleCard title='Partnership Options' />
            content
          </div>
        </div>
      </section>
    </div>
  )
}
