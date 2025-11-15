/* eslint-disable no-console */

import { useEffect, useState, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'

import styles from './TasksPage.module.scss'
import {
  ProjectsColumnData,
  ProjectsTasksData,
  ProjectsTasksFormData,
  ProjectsTasksInputData,
  ProjectViewPageContext,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { CreateTaskModal } from '../../../../../features/Admin/Projects/ViewProject/CreateTaskModal/CreateTaskModal'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteProjectTask } from '../../../../../shared/utils/api/Admin/Projects/delete-project-task'
import { getProjectTasks } from '../../../../../shared/utils/api/Admin/Projects/get-project-tasks'
import { getProjectsTasksInputData } from '../../../../../shared/utils/api/Admin/Projects/get-projects-tasks-input-data'
import { patchProjectEditTask } from '../../../../../shared/utils/api/Admin/Projects/patch-project-edit-task'
import { patchUpdateTaskPosition } from '../../../../../shared/utils/api/Admin/Projects/patch-update-task-position'
import { postCreateNewTask } from '../../../../../shared/utils/api/Admin/Projects/post-create-new-task'
import { useAppWebSocket } from '../../../../../shared/utils/providers/WebSocketProvider'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import { TasksCard } from '../../../../../widgets/TasksCard/TasksCard'

export const AdminProjectsTasksPage = () => {
  const [tasksList, setTasksList] = useState<ProjectsColumnData | null>(null)
  const [access, setAccess] = useState<RolesAccess | null>(null)
  const [inputData, setInputData] = useState<ProjectsTasksInputData | null>(null)
  const [isCreated, setIsCreated] = useState<boolean>(false)
  const [clientsCount, setClientsCount] = useState<number | null>(null)

  const context = useOutletContext<ProjectViewPageContext>()
  const showToast = useCustomToast()

  const { isConnected, isAuth, on, send } = useAppWebSocket()

  const handleSetIsCreated = () => setIsCreated(prev => !prev)

  const sendMessage = useCallback(
    (msg: any) => {
      if (!isConnected || !isAuth) return
      send(msg)
    },
    [isConnected, isAuth, send],
  )

  const joinRoom = useCallback(() => {
    if (!isConnected || !isAuth) return

    sendMessage({ c: 'room', data: { in: `task:${context.idProject}` } })

    console.log(`🟢 Joined room Project:${context.idProject}`)
  }, [isConnected, isAuth, sendMessage])

  const leaveRoom = useCallback(() => {
    if (!isConnected || !isAuth) return

    try {
      sendMessage({ c: 'room', data: { out: `task:${context.idProject}` } })
      setClientsCount(null)
      console.log(`🔴 Left room Project:${context.idProject}`)
    } catch (err) {
      console.warn('WebSocket send failed on leave room:', err)
    }
  }, [isConnected, isAuth, sendMessage])

  const getTasks = async () => {
    if (!context.idProject) return

    const response = await getProjectTasks(context.idProject)

    if (!response.status) return

    setTasksList(response.data.data)
    setAccess(response.data.access)
  }

  const getTasksInputData = async () => {
    if (!context.idProject) return

    const response = await getProjectsTasksInputData(context.idProject)

    if (!response.status) return

    setInputData(response.data)
  }

  const createNewTask = async (form: Partial<ProjectsTasksFormData>) => {
    if (!context.idProject) return

    const { status, message } = await postCreateNewTask(context.idProject, form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a Task',
        status: 'success',
      })
      handleSetIsCreated()
      sendMessage({
        c: 'task',
        data: { action: 'create', form },
        room: `task:${context.idProject}`,
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const editTask = async (idTask: number, form: Partial<ProjectsTasksFormData>) => {
    if (!context.idProject) return

    const { status, message } = await patchProjectEditTask(context.idProject, idTask, form)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the Task',
        status: 'success',
      })
      sendMessage({
        c: 'task',
        data: { action: 'edit', idTask, form },
        room: `task:${context.idProject}`,
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const deleteSelectedTask = async (idTask: number) => {
    if (!context.idProject) return

    const { status, message } = await deleteProjectTask(context.idProject, idTask)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted the Task',
        status: 'success',
      })
      sendMessage({
        c: 'task',
        data: { action: 'delete', idTask },
        room: `task:${context.idProject}`,
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const updateTaskPosition = async (taskId: number, newIndex: number, columnTitle: string) => {
    if (!context.idProject) return

    const { status, message } = await patchUpdateTaskPosition(
      context.idProject,
      taskId,
      newIndex,
      columnTitle,
    )

    if (status) {
      sendMessage({
        c: 'task',
        data: { action: 'move', taskId, newIndex, columnTitle },
        room: `task:${context.idProject}`,
      })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    on('room', (data: any) => {
      if (data.code === 200) {
        setClientsCount(data.data.inRoom)
      }
    })

    on('task', (data: any) => {
      console.log('📩 Task event:', data)

      if (!data.data) return

      const { action } = data.data

      if (!action) return

      setTasksList(prev => {
        if (!prev) return prev

        const newColumns = { ...prev }

        switch (action) {
          case 'create': {
            if (data.data.task) {
              const column = newColumns[data.data.task.column] || []
              newColumns[data.data.task.column] = [...column, data.data.task]
            }
            break
          }

          case 'edit': {
            Object.keys(newColumns).forEach(col => {
              newColumns[col] = newColumns[col].map(task =>
                task.id === data.data.task.id ? { ...task, ...data.data.task } : task,
              )
            })
            break
          }

          case 'delete': {
            Object.keys(newColumns).forEach(col => {
              newColumns[col] = newColumns[col].filter(task => task.id !== data.data.taskId)
            })
            break
          }

          case 'move': {
            let movedTask: ProjectsTasksData | undefined

            Object.keys(newColumns).forEach(col => {
              newColumns[col] = newColumns[col].filter(task => {
                if (task.id === data.data.taskId) {
                  movedTask = task

                  return false
                }

                return true
              })
            })

            if (movedTask) {
              const targetCol = newColumns[data.data.columnTitle] || []

              targetCol.splice(data.data.newIndex, 0, movedTask)
              newColumns[data.data.columnTitle] = targetCol
            }
            break
          }

          default:
            break
        }

        return newColumns
      })
    })
  }, [on])

  useEffect(() => {
    if (isConnected && isAuth) {
      joinRoom()
    }

    return () => {
      leaveRoom()
    }
  }, [isConnected, isAuth, joinRoom, leaveRoom])

  useEffect(() => {
    if (!context.idProject) return

    getTasks()
    getTasksInputData()
  }, [context.idProject])

  useEffect(() => {
    document.title = 'infiniti | Project Tasks'
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        <section className={styles.section}>
          {access && tasksList && inputData ? (
            <RecentCard
              style={styles.recentFullScreen}
              Component={access.create === 1 ? ButtonBlue : undefined}
              title={`${clientsCount !== null ? `Online: ${clientsCount}` : 'Connection...'}`}
              componentProps={
                access.create === 1
                  ? {
                      titleNone: true,
                      title: 'New Task',
                      icon: '/icons/plus.svg',
                      style: styles.buttonNewTask,
                      onClick: handleSetIsCreated,
                    }
                  : undefined
              }
            >
              <TasksCard
                access={access}
                data={tasksList}
                updateTaskPosition={updateTaskPosition}
                editSelectedTask={editTask}
                deleteSelectedTask={deleteSelectedTask}
                inputData={inputData}
              />
            </RecentCard>
          ) : (
            <LoadingSpinner size='xl' />
          )}
        </section>
      </div>
      {isCreated && inputData && (
        <CreateTaskModal
          modalOpen={isCreated}
          inputData={inputData}
          createTask={createNewTask}
          handleOpenCloseModal={handleSetIsCreated}
        />
      )}
    </>
  )
}
