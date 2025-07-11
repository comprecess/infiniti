import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'

import {
  ProjectsColumnData,
  ProjectsTasksData,
} from '../../app/constants/constants'
import { TaskColumn } from './TaskColumn/TaskColumn'
import { TaskItem } from './TaskColumn/TaskItem/TaskItem'
import styles from './TasksCard.module.scss'

interface TasksCardProps {
  data: ProjectsColumnData
}

interface ActiveTaskInfo {
  task: ProjectsTasksData
  fromColumn: string
}

export const TasksCard = ({ data }: TasksCardProps) => {
  const [columns, setColumns] = useState<ProjectsColumnData>(data)
  const [activeTask, setActiveTask] = useState<ActiveTaskInfo | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  )

  const onDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id.toString()
    for (const [columnKey, tasks] of Object.entries(columns)) {
      const task = tasks.find(t => t.id.toString() === activeId)
      if (task) {
        setActiveTask({ task, fromColumn: columnKey })
        break
      }
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!activeTask || !over) {
      setActiveTask(null)

      return
    }

    const activeId = active.id.toString()
    const overId = over.id.toString()

    const sourceColumn = activeTask.fromColumn
    const sourceTasks = [...columns[sourceColumn]]
    const activeIndex = sourceTasks.findIndex(
      t => t.id.toString() === activeId,
    )
    if (activeIndex === -1) return

    let targetColumn = sourceColumn
    let targetIndex = 0

    if (overId.startsWith('column-')) {
      targetColumn = overId.replace('column-', '')
      targetIndex = columns[targetColumn]?.length ?? 0
    } else {
      for (const [colKey, tasks] of Object.entries(columns)) {
        const idx = tasks.findIndex(t => t.id.toString() === overId)
        if (idx !== -1) {
          targetColumn = colKey
          targetIndex = idx
          break
        }
      }
    }

    const updatedTask = {
      ...activeTask.task,
      status: { ...activeTask.task.status, title: targetColumn },
    }

    const newColumns: ProjectsColumnData = { ...columns }
    newColumns[sourceColumn] = [...columns[sourceColumn]]
    newColumns[sourceColumn].splice(activeIndex, 1)

    const targetTasks = [...(newColumns[targetColumn] || [])]
    targetTasks.splice(targetIndex, 0, updatedTask)
    newColumns[targetColumn] = targetTasks

    setColumns(newColumns)
    setActiveTask(null)
  }

  useEffect(() => {
    const maxHeight = Math.max(
      ...Array.from(containerRef.current?.children || []).map(
        el => (el as HTMLElement).offsetHeight,
      ),
    )
    if (containerRef.current) {
      Array.from(containerRef.current.children).forEach(child => {
        // eslint-disable-next-line no-extra-semi
        ;(child as HTMLElement).style.minHeight = `${maxHeight}px`
      })
    }
  }, [columns])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div ref={containerRef} className={styles.wrapper}>
        {Object.entries(columns).map(([status, tasks]) => (
          <SortableContext
            key={status}
            items={tasks.map(t => t.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn
              columnId={`column-${status}`}
              title={status}
              tasks={tasks}
              activeTaskId={activeTask?.task.id.toString()}
            />
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskItem isSelected task={activeTask.task} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
