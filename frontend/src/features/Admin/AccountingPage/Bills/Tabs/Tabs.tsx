import { Tab } from '../../../Sales/InvoicesPage/Header/Tabs/Tab/Tab'
import styles from './Tabs.module.scss'

interface TabsListProps {
  id: number
  name: string
  send: string
}

const tabsList: TabsListProps[] = [
  { id: 0, name: 'Summary', send: 'Summary' },
  { id: 1, name: 'All', send: 'All' },
  { id: 2, name: 'Add a Bill', send: 'Add a Bill' },
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
