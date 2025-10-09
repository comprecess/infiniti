import { useNavigate } from 'react-router-dom'

import styles from './BackButton.module.scss'
import { ChevronDownIcon } from '../../icons/ChevronDownIcon'

interface BackButtonProps {
  onClick?: () => void
}

export const BackButton = ({ onClick }: BackButtonProps) => {
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(-1)
    }
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
