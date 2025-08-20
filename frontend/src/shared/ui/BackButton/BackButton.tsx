import { useNavigate } from 'react-router-dom'

import { ChevronDownIcon } from '../../icons/ChevronDownIcon'
import styles from './BackButton.module.scss'

export const BackButton = () => {
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    navigate(-1)
  }

  return (
    <div className={styles.wrapper} onClick={handleNavigateBack}>
      <div className={styles.container}>
        <ChevronDownIcon style={styles.icon} />
        <span className={styles.text}>Back</span>
      </div>
    </div>
  )
}
