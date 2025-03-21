import styles from './Tab.module.scss'

interface TabProps {
  title: string
  isActive: boolean
  send: string
  setIsActiveTab: (name: string) => void
}

export const Tab = ({
  title,
  isActive,
  send,
  setIsActiveTab,
}: TabProps) => {
  const handleOnClick = () => {
    setIsActiveTab(send)
  }

  return (
    <div
      className={isActive ? styles.wrapperActive : styles.wrapperDisable}
      onClick={handleOnClick}
    >
      <span
        className={isActive ? styles.titleActive : styles.titleDisable}
      >
        {title}
      </span>
    </div>
  )
}
