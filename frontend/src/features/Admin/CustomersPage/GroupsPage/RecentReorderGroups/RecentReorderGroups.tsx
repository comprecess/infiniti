import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'

import { GroupsListProps } from '../../../../../app/constants/constants'
import { Item } from './Item/Item'
import styles from './RecentReorderGroups.module.scss'

interface RecentReorderGroupsProps {
  groupsList: GroupsListProps[]
  ReRequestGetGroups: (listId: number[]) => void
}

export const RecentReorderGroups = ({
  groupsList,
  ReRequestGetGroups,
}: RecentReorderGroupsProps) => {
  const [items, setItems] = useState(groupsList)
  const [activeId, setActiveId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      ReRequestGetGroups(newItems.map(i => i.id))
    }
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={e => setActiveId(e.active.id as number)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className={styles.wrapper}>
        <h5 className={styles.title}>
          Drag & drop the Items below for Repositioning. Click to Edit.
        </h5>
        <SortableContext
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.list}>
            {items.map((item, index) => (
              <Item
                key={item.id}
                id={item.id}
                index={index}
                name={item.name}
              />
            ))}
          </div>
        </SortableContext>
      </div>
      <DragOverlay>
        {activeId ? (
          <Item
            isOverlay
            id={activeId}
            index={items.findIndex(i => i.id === activeId)}
            name={items.find(i => i.id === activeId)?.name || ''}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
