import styles from './TalentsLevel.module.scss'

interface TalentsLevelProps {
  title: string
}

const levelColors = {
  Lead: styles.statusLead,
  Senior: styles.statusSenior,
  Middle: styles.statusMiddle,
  Junior: styles.statusJunior,
}

export const TalentsLevel = ({ title }: TalentsLevelProps) => {
  let levelStyle = ''
  let levelIcon = ''

  switch (title) {
    case 'Lead':
      levelStyle = levelColors.Lead
      levelIcon = '/levels/lead.svg'
      break
    case 'Senior':
      levelStyle = levelColors.Senior
      levelIcon = '/levels/senior.svg'
      break
    case 'Middle':
      levelStyle = levelColors.Middle
      levelIcon = '/levels/middle.svg'
      break
    case 'Junior':
      levelStyle = levelColors.Junior
      levelIcon = '/levels/junior.svg'
      break
  }

  return (
    <div className={`${styles.wrapper} ${levelStyle}`}>
      <img src={levelIcon} alt='Icon' className={styles.icon} />
      <span className={styles.title}>{title}</span>
    </div>
  )
}
