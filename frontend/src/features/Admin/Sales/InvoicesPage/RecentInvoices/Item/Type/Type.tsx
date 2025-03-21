import styles from './Type.module.scss'

const typeColors = {
  OneTime: styles.statusOneTime,
  Recurring: styles.statusRecurring,
}

interface TypeProps {
  type: number
}

export const Type = ({ type }: TypeProps) => {
  let typeStyle = ''

  switch (type) {
    case 0:
      typeStyle = typeColors.OneTime
      break
    case 1:
      typeStyle = typeColors.Recurring
      break
  }

  return (
    <div className={`${styles.wrapper} ${typeStyle}`}>
      <span className={styles.title}>
        {type === 0 ? 'Onetime' : 'Recurring'}
      </span>
    </div>
  )
}
