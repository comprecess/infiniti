import { TextInfoItem } from '../../TextInfoItem/TextInfoItem'
import styles from './Item.module.scss'

interface ItemProps {
  position: string
  period: string
  name: string
  responsibilities: string
}

export const Item = ({
  position,
  period,
  name,
  responsibilities,
}: ItemProps) => {
  return (
    <>
      <h5 className={styles.miniTitle}>{name}</h5>
      <div className={styles.list}>
        <TextInfoItem title={'Position'} text={position} />
        <TextInfoItem title={'Period'} text={period} />
        <TextInfoItem title={'Responsibilities'} text={responsibilities} />
      </div>
    </>
  )
}
