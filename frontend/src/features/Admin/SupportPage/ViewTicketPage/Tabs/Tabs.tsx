import styles from './Tabs.module.scss'
import { Tab } from '../../../Sales/InvoicesPage/Header/Tabs/Tab/Tab'

interface TabsListProps {
  id: number
  name: string
  send: string
}

const tabsList: TabsListProps[] = [
  { id: 0, name: 'Customer', send: 'Customer' },
  { id: 1, name: 'Internal', send: 'Internal' },
]

interface TabsProps {
  isActiveTab: string
  setIsActiveTab: (name: string) => void
}

export const Tabs = ({ isActiveTab, setIsActiveTab }: TabsProps) => {
  return (
    <div className={styles.wrapper}>
      {tabsList.map(item => {
        return (
          <Tab
            key={item.id}
            title={item.name}
            send={item.send}
            isActive={item.send === isActiveTab}
            setIsActiveTab={setIsActiveTab}
          />
        )
      })}
    </div>
  )
}
