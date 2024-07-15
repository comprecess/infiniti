import { FC, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

import { GroupsListProps } from '../../../../../app/constants/constants'
import { Item } from './Item/Item'
import styles from './RecentReorderGroups.module.scss'

const isMobileDevice = () => {
  return navigator.maxTouchPoints > 0 && 'orientation' in window
}

interface RecentReorderGroupsProps {
  groupsList: GroupsListProps[]
  ReRequestGetGroups: (listId: number[]) => void
}

export const RecentReorderGroups: FC<RecentReorderGroupsProps> = ({
  groupsList,
  ReRequestGetGroups,
}) => {
  const [idList, setIdList] = useState(groupsList.map(item => item.id))
  const [items, setItems] = useState(groupsList)

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updatedItems = [...items]
    const updatedIds = [...idList]

    const dragItem = updatedItems[dragIndex]
    updatedItems[dragIndex] = updatedItems[hoverIndex]
    updatedItems[hoverIndex] = dragItem

    const dragId = updatedIds[dragIndex]
    updatedIds[dragIndex] = updatedIds[hoverIndex]
    updatedIds[hoverIndex] = dragId

    setIdList(updatedIds)
    setItems(updatedItems)
  }

  const handleSort = () => {
    ReRequestGetGroups(idList)
  }

  return (
    <DndProvider backend={isMobileDevice() ? TouchBackend : HTML5Backend}>
      <div className={styles.wrapper}>
        <h5 className={styles.title}>
          Drag & drop the Items below for Repositioning. Click to Edit.
        </h5>
        <div className={styles.list}>
          {items.map((item, index) => (
            <Item
              key={item.id}
              index={index}
              name={item.name}
              moveItem={moveItem}
              sort={handleSort}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
}
