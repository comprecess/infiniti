import { Tooltip } from '@chakra-ui/react'
import { FC } from 'react'

import styles from './CustomMiniButton.module.scss'

interface CustomMiniButtonProps {
  title?: string
  style: 'cherry' | 'amber' | 'mint' | 'blue' | 'gray'
  icon: string
  alt: string
  tooltipTitle?: string
  onClick?: () => void
}

const buttonStyles = {
  cherry: styles.cherryWrapper,
  amber: styles.amberWrapper,
  mint: styles.mintWrapper,
  blue: styles.blueWrapper,
  gray: styles.grayWrapper,
}

export const CustomMiniButton: FC<CustomMiniButtonProps> = ({
  title,
  style,
  icon,
  alt,
  tooltipTitle,
  onClick,
}) => {
  const buttonClass = buttonStyles[style]

  return (
    <Tooltip
      label={tooltipTitle}
      openDelay={100}
      closeDelay={100}
      bg='#010102'
      borderRadius='8px'
    >
      <button className={buttonClass} onClick={onClick}>
        <img src={icon} alt={alt} className={styles.icon} />
        {title && <span className={styles.textButton}>{title}</span>}
      </button>
    </Tooltip>
  )
}
