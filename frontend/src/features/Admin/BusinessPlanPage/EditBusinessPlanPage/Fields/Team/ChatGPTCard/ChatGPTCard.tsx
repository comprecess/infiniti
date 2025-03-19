import { ChatGPTIcon } from '../../../../../../../shared/icons/ChatGPTIcon'
import { Icon } from '../../../../../../../shared/ui/Icon/Icon'
import styles from './ChatGPTCard.module.scss'

interface ChatGPTCardProps {
  addNewTalentChatGPT: () => void
}

export const ChatGPTCard = ({ addNewTalentChatGPT }: ChatGPTCardProps) => {
  return (
    <div className={styles.wrapper} onClick={addNewTalentChatGPT}>
      <div className={styles.circle}>
        <Icon
          hover={false}
          icon={<ChatGPTIcon style={styles.icon} />}
          style={styles.wrapperIcon}
        />
      </div>
    </div>
  )
}
