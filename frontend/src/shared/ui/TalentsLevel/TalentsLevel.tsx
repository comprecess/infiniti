import { FC } from 'react'

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

export const TalentsLevel: FC<TalentsLevelProps> = ({ title }) => {
  let levelStyle = ''
  let levelIcon = ''

  switch (title) {
    case 'Lead':
      levelStyle = levelColors.Lead
      levelIcon = '/levels/Lead.svg'
      break
    case 'Senior':
      levelStyle = levelColors.Senior
      levelIcon = '/levels/Senior.svg'
      break
    case 'Middle':
      levelStyle = levelColors.Middle
      levelIcon = '/levels/Middle.svg'
      break
    case 'Junior':
      levelStyle = levelColors.Junior
      levelIcon = '/levels/Junior.svg'
      break
  }

  return (
    <div className={`${styles.wrapper} ${levelStyle}`}>
      <img src={levelIcon} alt='Icon' className={styles.icon} />
      <span className={styles.title}>{title}</span>
    </div>
  )
}
