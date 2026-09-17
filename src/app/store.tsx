import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { demoTasks, rootSession as initialRootSession } from '../data/demo-data'
import type {
  AgentSession,
  CardSize,
  ChatMessage,
  FilterId,
  Task,
  ViewMode,
} from '../types'

type DemoEvent = 'add' | 'activity' | 'artifact' | 'review' | 'archive' | 'wake'

interface WorkspaceContextValue {
  tasks: Task[]
  filter: FilterId
  taskView: ViewMode
  cardSize: CardSize
  artifactView: ViewMode
  rootSession: AgentSession
  setFilter: (filter: FilterId) => void
  setTaskView: (view: ViewMode) => void
  setCardSize: (size: CardSize) => void
  setArtifactView: (view: ViewMode) => void
  sleepTask: (taskId: string) => void
  sendMessage: (taskId: string | null, body: string) => void
  runDemoEvent: (event: DemoEvent) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

const scriptedReplies = [
  'I updated the most relevant artifact and moved this task to the top so the change is visible.',
  'The new evidence is incorporated. I marked the task ready for review.',
  'I found a clearer direction and refreshed the workspace state to reflect it.',
]

export function WorkspaceProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState(demoTasks)
  const [rootSession, setRootSession] = useState(initialRootSession)
  const [filter, setFilter] = useState<FilterId>('active')
  const [taskView, setTaskView] = useState<ViewMode>('cards')
  const [cardSize, setCardSize] = useState<CardSize>('normal')
  const [artifactView, setArtifactView] = useState<ViewMode>('cards')
  const replyIndex = useRef(0)

  const sleepTask = useCallback((taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, state: 'sleeping', unread: false, updatedAt: Date.now() }
          : task,
      ),
    )
  }, [])

  const sendMessage = useCallback((taskId: string | null, body: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      body,
      createdAt: Date.now(),
    }

    if (taskId === null) {
      setRootSession((session) => ({
        ...session,
        status: 'thinking',
        messages: [...session.messages, userMessage],
      }))
    } else {
      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                session: {
                  ...task.session,
                  status: 'thinking',
                  messages: [...task.session.messages, userMessage],
                },
              }
            : task,
        ),
      )
    }

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        body: scriptedReplies[replyIndex.current % scriptedReplies.length],
        createdAt: Date.now(),
      }
      replyIndex.current += 1

      if (taskId === null) {
        setRootSession((session) => ({
          ...session,
          status: 'waiting',
          messages: [...session.messages, reply],
        }))
        setTasks((current) => {
          const [first, ...rest] = current
          if (!first) return current
          return [
            { ...first, updatedAt: Date.now(), unread: true },
            ...rest,
          ]
        })
      } else {
        setTasks((current) => {
          const target = current.find((task) => task.id === taskId)
          if (!target) return current
          const updated = {
            ...target,
            state: 'review' as const,
            unread: true,
            updatedAt: Date.now(),
            session: {
              ...target.session,
              status: 'review' as const,
              messages: [...target.session.messages, reply],
            },
          }
          return [updated, ...current.filter((task) => task.id !== taskId)]
        })
      }
    }, 950)
  }, [])

  const runDemoEvent = useCallback((event: DemoEvent) => {
    setTasks((current) => {
      if (event === 'add') {
        const created: Task = {
          id: `accessibility-pass-${Date.now()}`,
          title: 'Review accessibility pass',
          summary: 'Validate focus, reduced motion, and edge navigation.',
          owner: 'You',
          state: 'working',
          updatedAt: Date.now(),
          unread: true,
          artifacts: [
            {
              id: `checklist-${Date.now()}`,
              title: 'Accessibility checklist.md',
              kind: 'markdown',
              updatedAt: Date.now(),
              content:
                '# Accessibility pass\n\n- Visible focus without persistent chrome\n- Reduced-motion fallback\n- Keyboard access to edge drawers',
            },
          ],
          session: {
            status: 'thinking',
            messages: [
              {
                id: `created-${Date.now()}`,
                role: 'agent',
                body: 'I started a focused accessibility review of the prototype.',
                createdAt: Date.now(),
              },
            ],
          },
        }
        return [created, ...current]
      }

      if (event === 'activity') {
        const target = current.at(-1)
        if (!target) return current
        return [
          {
            ...target,
            updatedAt: Date.now(),
            unread: true,
            state: target.state === 'sleeping' ? 'working' : target.state,
          },
          ...current.slice(0, -1),
        ]
      }

      if (event === 'artifact') {
        const [target, ...rest] = current
        if (!target) return current
        const newArtifact = {
          id: `agent-note-${Date.now()}`,
          title: 'Agent update.md',
          kind: 'markdown' as const,
          updatedAt: Date.now(),
          content:
            '# New direction\n\nThe agent added a concise update while preserving the task context.',
        }
        return [
          {
            ...target,
            updatedAt: Date.now(),
            unread: true,
            artifacts: [newArtifact, ...target.artifacts],
          },
          ...rest,
        ]
      }

      if (event === 'review') {
        const index = current.findIndex((task) => task.state === 'working')
        if (index < 0) return current
        const target = current[index]
        const updated = {
          ...target,
          state: 'review' as const,
          unread: true,
          updatedAt: Date.now(),
          session: { ...target.session, status: 'review' as const },
        }
        return [updated, ...current.filter((_, taskIndex) => taskIndex !== index)]
      }

      if (event === 'archive') {
        return current.length > 1 ? current.slice(0, -1) : current
      }

      const index = current.findIndex((task) => task.state === 'sleeping')
      if (index < 0) return current
      const target = current[index]
      return [
        {
          ...target,
          state: 'review',
          unread: true,
          updatedAt: Date.now(),
        },
        ...current.filter((_, taskIndex) => taskIndex !== index),
      ]
    })
  }, [])

  const value = useMemo(
    () => ({
      tasks,
      filter,
      taskView,
      cardSize,
      artifactView,
      rootSession,
      setFilter,
      setTaskView,
      setCardSize,
      setArtifactView,
      sleepTask,
      sendMessage,
      runDemoEvent,
    }),
    [
      tasks,
      filter,
      taskView,
      cardSize,
      artifactView,
      rootSession,
      sleepTask,
      sendMessage,
      runDemoEvent,
    ],
  )

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used inside WorkspaceProvider')
  }
  return context
}

export type { DemoEvent }
