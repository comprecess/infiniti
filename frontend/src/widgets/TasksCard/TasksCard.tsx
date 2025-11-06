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
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { TaskColumn } from './TaskColumn/TaskColumn'
import { TaskItem } from './TaskColumn/TaskItem/TaskItem'
import styles from './TasksCard.module.scss'
import {
  ProjectsColumnData,
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
  RolesAccess,
} from '../../app/constants/constants'

interface TasksCardProps {
  access: RolesAccess
  data: ProjectsColumnData
  inputData: ProjectsTasksInputData
  updateTaskPosition: (taskId: number, newIndex: number, columnTitle: string) => void
  editSelectedTask: (idTask: number, form: Partial<ProjectsTasksFormData>) => void
  deleteSelectedTask: (idTask: number) => void
}

interface ActiveTaskInfo {
  task: ProjectsTasksData
  fromColumn: string
}

export const TasksCard = ({
  access,
  data,
  inputData,
  editSelectedTask,
  updateTaskPosition,
  deleteSelectedTask,
}: TasksCardProps) => {
  const [columns, setColumns] = useState<ProjectsColumnData>(data)
  const [activeTask, setActiveTask] = useState<ActiveTaskInfo | null>(null)

  const [visibleCount, setVisibleCount] = useState<number>(10)

  const [searchParams, setSearchParams] = useSearchParams()

  const filterStatus = searchParams.get('filter') || 'Main'
  const taskIdFromUrl = searchParams.get('task')
  const containerRef = useRef<HTMLDivElement>(null)

  const updateQueryParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(location.search)

    newParams.set(key, String(value))

    setSearchParams(newParams, { replace: true })
  }

  const updateFilterStatus = (newStatus: string) => updateQueryParam('filter', newStatus)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
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

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!activeTask || !over) {
      setActiveTask(null)

      return
    }

    const activeId = active.id.toString()
    const overId = over.id.toString()

    const sourceColumn = activeTask.fromColumn
    const sourceTasks = [...columns[sourceColumn]]
    const activeIndex = sourceTasks.findIndex(t => t.id.toString() === activeId)
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

    updateTaskPosition(updatedTask.id, targetIndex, targetColumn)
  }

  useEffect(() => {
    const children = containerRef.current?.children

    if (!children) return

    Array.from(children).forEach(child => {
      // eslint-disable-next-line no-extra-semi
      ;(child as HTMLElement).style.height = 'auto'
    })

    const maxHeight = Math.max(...Array.from(children).map(el => (el as HTMLElement).offsetHeight))

    Array.from(children).forEach(child => {
      // eslint-disable-next-line no-extra-semi
      ;(child as HTMLElement).style.height = `${maxHeight}px`
    })
  }, [columns, visibleCount])

  useEffect(() => {
    setColumns(data)
  }, [data])

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div ref={containerRef} className={styles.wrapper}>
        {Object.entries(columns).map(([status, tasks]) => (
          <SortableContext
            key={status}
            items={tasks.map(t => t.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn
              access={access}
              filterStatus={filterStatus}
              visibleCount={visibleCount}
              taskIdFromUrl={taskIdFromUrl}
              inputData={inputData}
              isDragging={!!activeTask}
              columnId={`column-${status}`}
              title={status}
              tasks={tasks}
              searchParams={searchParams}
              activeTaskId={activeTask?.task.id.toString()}
              setSearchParams={setSearchParams}
              updateFilterStatus={updateFilterStatus}
              setVisibleCount={setVisibleCount}
              editSelectedTask={editSelectedTask}
              deleteSelectedTask={deleteSelectedTask}
            />
          </SortableContext>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskItem
            isSelected
            isDragging
            filterStatus=''
            updateFilterStatus={updateFilterStatus}
            task={activeTask.task}
            editSelectedTask={() => {}}
            deleteSelectedTask={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
