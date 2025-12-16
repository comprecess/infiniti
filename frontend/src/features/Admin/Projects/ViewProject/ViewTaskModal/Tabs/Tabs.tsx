import styles from './Tabs.module.scss'
import { Tab } from '../../../../Sales/InvoicesPage/Header/Tabs/Tab/Tab'

interface TabsListProps {
  id: number
  name: string
  send: string
}

const tabsList: TabsListProps[] = [
  { id: 0, name: 'Main', send: 'Main' },
  { id: 1, name: 'Time Spent', send: 'Time Spent' },
  { id: 2, name: 'Logs', send: 'Logs' },
]

interface TabsProps {
  isActiveTab: string
  isClientView: boolean
  setIsActiveTab: (name: string) => void
}

export const Tabs = ({ isActiveTab, isClientView, setIsActiveTab }: TabsProps) => {
  const filteredTabsList = isClientView ? tabsList.filter(tab => tab.send !== 'Logs') : tabsList

  return (
    <div className={styles.wrapper}>
      {filteredTabsList.map(item => {
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
