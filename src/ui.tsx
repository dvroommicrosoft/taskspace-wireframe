import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { Documint, darkTheme } from '@lostintangent/documint'
import { AnimatePresence, motion } from 'motion/react'
import {
  Activity,
  Archive,
  ArrowLeft,
  Bot,
  ChevronDown,
  ChevronRight,
  ChevronsUp,
  CircleDot,
  Clock3,
  Columns3,
  Eye,
  FileCode2,
  FileImage,
  FileText,
  Filter,
  GalleryVerticalEnd,
  Grid2X2,
  List,
  Maximize2,
  MessageSquare,
  Minimize2,
  Moon,
  MoreHorizontal,
  PanelRightClose,
  PanelRightOpen,
  PanelTop,
  Pin,
  PinOff,
  Play,
  Plus,
  Send,
  type LucideIcon,
  X,
  Zap,
} from 'lucide-react'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PropsWithChildren,
} from 'react'
import { useWorkspace, type DemoEvent } from './app/store'
import type {
  AgentSession,
  Artifact,
  CardSize,
  FilterId,
  Task,
  ViewMode,
} from './types'

const filters: Array<{
  id: FilterId
  label: string
  icon: LucideIcon
}> = [
  { id: 'active', label: 'My active tasks', icon: CircleDot },
  { id: 'review', label: 'Needs review', icon: Eye },
  { id: 'working', label: 'Agent working', icon: Activity },
  { id: 'sleeping', label: 'Sleeping', icon: Moon },
  { id: 'all', label: 'All tasks', icon: GalleryVerticalEnd },
]

const onDeckDocumintTheme = {
  ...darkTheme,
  accent: '#b6ff57',
  background: '#0b0c0e',
}

const demoEvents: Array<{
  id: DemoEvent
  label: string
  icon: LucideIcon
}> = [
  { id: 'add', label: 'Add a new task', icon: Plus },
  { id: 'activity', label: 'New activity', icon: Zap },
  { id: 'artifact', label: 'Add an artifact', icon: FileText },
  { id: 'review', label: 'Ready for review', icon: Eye },
  { id: 'wake', label: 'Wake sleeping task', icon: Clock3 },
  { id: 'archive', label: 'Archive last task', icon: Archive },
]

function timeAgo(timestamp: number) {
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60_000))
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

function stateLabel(state: Task['state']) {
  if (state === 'review') return 'Needs review'
  if (state === 'working') return 'Agent working'
  if (state === 'sleeping') return 'Sleeping'
  return 'Quiet'
}

export function WorkspaceShell({ children }: PropsWithChildren) {
  const {
    tasks,
    rootSession,
    filter,
    taskView,
    cardSize,
    setFilter,
    setTaskView,
    setCardSize,
  } = useWorkspace()
  const { runDemoEvent } = useWorkspace()
  const location = useRouterState({ select: (state) => state.location })
  const taskMatch = location.pathname.match(/^\/tasks\/([^/]+)/)
  const taskId = taskMatch?.[1] ?? null
  const task = tasks.find((item) => item.id === taskId)
  const session = task?.session ?? rootSession
  const [topOpen, setTopOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const [agentPinned, setAgentPinned] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const closeTransientDrawers = () => {
    setTopOpen(false)
    if (!agentPinned) setRightOpen(false)
  }

  return (
    <div
      className={`workspace-shell ${agentPinned ? 'agent-is-pinned' : ''}`}
      onTouchStart={(event) => {
        const touch = event.touches[0]
        touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        const touch = event.changedTouches[0]
        if (start === null || !touch) return
        if (start.y < 24 && touch.clientY - start.y > 52) setTopOpen(true)
        if (start.x > window.innerWidth - 24 && start.x - touch.clientX > 52)
          setRightOpen(true)
        touchStart.current = null
      }}
    >
      <button
        className={`edge edge-top filter-${filter}`}
        aria-label="Open task controls"
        onClick={() => setTopOpen(true)}
        onMouseEnter={() => setTopOpen(true)}
      />

      <AnimatePresence>
        {topOpen && (
          <motion.header
            className="floating-titlebar"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setTopOpen(false)}
          >
            <strong>On Deck</strong>
            <span className="titlebar-divider" />

            <nav className="titlebar-controls" aria-label="Task filters">
              {filters.map(({ id, label, icon: Icon }) => {
                const count = tasks.filter((item) => {
                  if (id === 'all') return true
                  if (id === 'active') return item.state !== 'sleeping'
                  return item.state === id
                }).length
                return (
                  <button
                    key={id}
                    className={filter === id ? 'selected' : ''}
                    aria-label={`${label}, ${count} tasks`}
                    onClick={() => {
                      setFilter(id)
                      setTopOpen(false)
                    }}
                  >
                    <Icon size={17} />
                  </button>
                )
              })}
            </nav>

            {location.pathname === '/' && (
              <div className="titlebar-presentation">
                <span className="titlebar-divider" />
                <div className="titlebar-controls" aria-label="Presentation">
                  <button
                    className={taskView === 'cards' ? 'selected' : ''}
                    aria-label="Card view"
                    onClick={() => setTaskView('cards')}
                  >
                    <Grid2X2 size={17} />
                  </button>
                  <button
                    className={taskView === 'table' ? 'selected' : ''}
                    aria-label="Table view"
                    onClick={() => setTaskView('table')}
                  >
                    <List size={17} />
                  </button>
                </div>
                <span className="titlebar-mini-divider" />
                <div className="titlebar-controls" aria-label="Card size">
                  <button
                    className={cardSize === 'normal' ? 'selected' : ''}
                    aria-label="Normal cards"
                    onClick={() => setCardSize('normal')}
                  >
                    <Columns3 size={17} />
                  </button>
                  <button
                    className={cardSize === 'large' ? 'selected' : ''}
                    aria-label="Large cards"
                    onClick={() => setCardSize('large')}
                  >
                    <Maximize2 size={17} />
                  </button>
                </div>
              </div>
            )}

            <span className="titlebar-spacer" />
            <button
              className="titlebar-close mobile-only"
              onClick={() => setTopOpen(false)}
              aria-label="Close task controls"
            >
              <X size={17} />
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      <main className="main-frame" onClick={closeTransientDrawers}>
        {children}
      </main>

      <button
        className={`edge edge-right agent-${session.status}`}
        aria-label="Open active agent session"
        onClick={() => setRightOpen(true)}
        onMouseEnter={() => setRightOpen(true)}
      >
        <AgentGutterTranscript session={session} />
      </button>

      <AnimatePresence>
        {(rightOpen || agentPinned) && (
          <motion.aside
            className={`floating-drawer agent-drawer ${
              agentPinned ? 'pinned' : ''
            }`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22 }}
            onMouseLeave={() => {
              if (!agentPinned) setRightOpen(false)
            }}
          >
            <AgentPanel
              taskId={task?.id ?? null}
              title={task?.title ?? 'Root workspace agent'}
              session={session}
              pinned={agentPinned}
              onPin={() => {
                setAgentPinned((current) => !current)
                setRightOpen(true)
              }}
              onClose={() => {
                setRightOpen(false)
                setAgentPinned(false)
              }}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="demo-control">
        <AnimatePresence>
          {demoOpen && (
            <motion.div
              className="demo-menu"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
            >
              <span className="overline">Scripted event</span>
              {demoEvents.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    runDemoEvent(id)
                    setDemoOpen(false)
                  }}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="demo-trigger"
          onClick={() => setDemoOpen((current) => !current)}
          aria-label="Open scripted demo events"
        >
          <Play size={14} fill="currentColor" />
          <span>Demo event</span>
        </button>
      </div>
    </div>
  )
}

function AgentGutterTranscript({ session }: { session: AgentSession }) {
  const scroller = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [session.messages, session.status])

  return (
    <span className="agent-gutter-shell" aria-hidden="true">
      <span className="agent-gutter-messages" ref={scroller}>
        {session.messages.map((item) => (
          <motion.span
            layout
            key={item.id}
            className={`gutter-message-row ${item.role}`}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="gutter-message-copy">
              <span className="gutter-message-role">
                {item.role === 'agent' ? 'Agent' : 'You'}
              </span>
              <span className="gutter-message-body">{item.body}</span>
            </span>
            <span className="gutter-message-marker" />
          </motion.span>
        ))}
        {session.status === 'thinking' && (
          <motion.span
            className="gutter-typing-marker"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
        {session.status !== 'thinking' && (
          <motion.span
            className="gutter-user-turn-marker"
            initial={{ opacity: 0, scaleY: 0.65 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </span>
    </span>
  )
}

function SegmentedControl({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (value: ViewMode) => void
}) {
  return (
    <div className="segmented">
      <button
        className={value === 'cards' ? 'selected' : ''}
        onClick={() => onChange('cards')}
      >
        <Grid2X2 size={15} />
        Cards
      </button>
      <button
        className={value === 'table' ? 'selected' : ''}
        onClick={() => onChange('table')}
      >
        <List size={15} />
        Table
      </button>
    </div>
  )
}

function AgentPanel({
  taskId,
  title,
  session,
  pinned,
  onPin,
  onClose,
}: {
  taskId: string | null
  title: string
  session: AgentSession
  pinned: boolean
  onPin: () => void
  onClose: () => void
}) {
  const { sendMessage } = useWorkspace()
  const [message, setMessage] = useState('')
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [session.messages, session.status])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const body = message.trim()
    if (!body) return
    sendMessage(taskId, body)
    setMessage('')
  }

  return (
    <div className="agent-panel">
      <header className="agent-header">
        <div className={`agent-orb ${session.status}`}>
          <Bot size={17} />
        </div>
        <div className="agent-title">
          <span className="overline">
            {taskId ? 'Task agent' : 'Root agent'}
          </span>
          <strong>{title}</strong>
        </div>
        <button
          className="icon-button desktop-only"
          onClick={onPin}
          aria-label={pinned ? 'Unpin agent panel' : 'Pin agent panel'}
        >
          {pinned ? <PinOff size={16} /> : <Pin size={16} />}
        </button>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close agent panel"
        >
          <X size={17} />
        </button>
      </header>

      <div className="agent-status-line">
        <span className={`status-dot ${session.status}`} />
        {session.status === 'thinking'
          ? 'Working now'
          : session.status === 'review'
            ? 'Waiting for your review'
            : 'Ready'}
      </div>

      <div className="message-list" ref={scroller}>
        {session.messages.map((item) => (
          <div key={item.id} className={`message ${item.role}`}>
            <span>{item.role === 'agent' ? 'Agent' : 'You'}</span>
            <p>{item.body}</p>
          </div>
        ))}
        {session.status === 'thinking' && (
          <motion.div
            className="typing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <i />
            <i />
            <i />
          </motion.div>
        )}
      </div>

      <form className="composer" onSubmit={submit}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Ask the active agent…"
          rows={2}
        />
        <button aria-label="Send message" disabled={!message.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

function filterTasks(tasks: Task[], filter: FilterId) {
  return tasks.filter((task) => {
    if (filter === 'all') return true
    if (filter === 'active') return task.state !== 'sleeping'
    return task.state === filter
  })
}

export function WorkspaceRoute() {
  const { tasks, filter, taskView, cardSize } = useWorkspace()
  const isMobile = useMediaQuery('(max-width: 860px)')
  const visibleTasks = useMemo(
    () => filterTasks(tasks, filter),
    [tasks, filter],
  )
  const effectiveView = isMobile ? 'table' : taskView

  return (
    <section className="mode-view task-mode">
      <AnimatePresence mode="wait">
        {visibleTasks.length === 0 ? (
          <EmptyState key="empty" filter={filter} />
        ) : (
          <motion.div
            key={effectiveView}
            className="collection-stage"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {effectiveView === 'cards' ? (
              <TaskGrid tasks={visibleTasks} cardSize={cardSize} />
            ) : (
              <TaskTable tasks={visibleTasks} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

function ModeHeader({
  eyebrow,
  title,
  meta,
  leading,
  trailing,
}: {
  eyebrow: string
  title: string
  meta?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <header className="mode-header">
      <div className="mode-heading">
        {leading}
        <div>
          <span className="overline">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        {meta && <span className="mode-meta">{meta}</span>}
      </div>
      {trailing}
    </header>
  )
}

function EmptyState({ filter }: { filter: FilterId }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Moon size={25} />
      <h2>Nothing is asking for attention</h2>
      <p>No tasks match the {filter} filter right now.</p>
    </motion.div>
  )
}

function TaskGrid({
  tasks,
  cardSize,
}: {
  tasks: Task[]
  cardSize: CardSize
}) {
  return (
    <motion.div
      className={`task-grid ${cardSize === 'large' ? 'large-cards' : ''}`}
      layout
    >
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

function TaskCard({ task }: { task: Task }) {
  const navigate = useNavigate()
  const { sleepTask } = useWorkspace()
  const [flipped, setFlipped] = useState(false)
  const [collapsedArtifacts, setCollapsedArtifacts] = useState<Set<string>>(
    () => new Set(),
  )
  const artifactStackRef = useRef<HTMLDivElement>(null)
  const [clippedArtifacts, setClippedArtifacts] = useState<Artifact[]>([])

  useEffect(() => {
    const stack = artifactStackRef.current
    if (!stack) return

    const updateClippedArtifacts = () => {
      const visibleBottom = stack.getBoundingClientRect().bottom - 42
      const clippedIds = Array.from(
        stack.querySelectorAll<HTMLElement>('[data-artifact-id]'),
      )
        .filter((preview) => {
          const header = preview.querySelector(':scope > header')
          return header && header.getBoundingClientRect().bottom > visibleBottom
        })
        .map((preview) => preview.dataset.artifactId)

      const next = task.artifacts.filter((artifact) =>
        clippedIds.includes(artifact.id),
      )
      setClippedArtifacts((current) => {
        if (
          current.length === next.length &&
          current.every((artifact, index) => artifact.id === next[index]?.id)
        ) {
          return current
        }
        return next
      })
    }

    const observer = new ResizeObserver(updateClippedArtifacts)
    observer.observe(stack)
    stack
      .querySelectorAll<HTMLElement>('[data-artifact-id]')
      .forEach((preview) => observer.observe(preview))
    updateClippedArtifacts()

    return () => {
      observer.disconnect()
    }
  }, [task.artifacts, collapsedArtifacts])

  const openTask = () => {
    navigate({ to: '/tasks/$taskId', params: { taskId: task.id } })
  }

  return (
    <motion.article
      layout
      className={`task-card ${flipped ? 'is-flipped' : ''}`}
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -12 }}
      transition={{
        layout: { type: 'spring', stiffness: 360, damping: 34 },
        opacity: { duration: 0.2 },
      }}
    >
      <motion.div
        className="task-card-inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
      >
        <div
          className="task-card-face task-front"
          role="button"
          tabIndex={0}
          aria-label={`Open ${task.title}`}
          onClick={openTask}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              openTask()
            }
          }}
        >
          <div className="task-card-bar">
            <div className="task-title-block">
              <span className={`status-dot ${task.session.status}`} />
              <h2>{task.title}</h2>
              <div className="task-card-status-flyout">
                <span className={`task-state state-${task.state}`}>
                  {stateLabel(task.state)}
                </span>
                <span>{timeAgo(task.updatedAt)}</span>
                {task.unread && <i className="unread-dot" />}
              </div>
            </div>
            <div className="card-controls">
              <button
                className="card-control"
                aria-label={`Sleep ${task.title}`}
                onClick={(event) => {
                  event.stopPropagation()
                  sleepTask(task.id)
                }}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <Moon size={15} />
              </button>
              <button
                className="card-control"
                aria-label={`Show agent for ${task.title}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setFlipped(true)
                }}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <MessageSquare size={15} />
              </button>
            </div>
          </div>

          <div className="artifact-stack" ref={artifactStackRef}>
            {task.artifacts.map((artifact) => (
              <ArtifactPreview
                key={artifact.id}
                artifact={artifact}
                expanded={!collapsedArtifacts.has(artifact.id)}
                onToggle={() => {
                  setCollapsedArtifacts((current) => {
                    const next = new Set(current)
                    if (next.has(artifact.id)) next.delete(artifact.id)
                    else next.add(artifact.id)
                    return next
                  })
                }}
                onMaximize={() =>
                  navigate({
                    to: '/tasks/$taskId/artifacts/$artifactId',
                    params: { taskId: task.id, artifactId: artifact.id },
                  })
                }
              />
            ))}
          </div>

          {clippedArtifacts.length > 0 && (
            <ClippedArtifactSummary
              artifacts={clippedArtifacts}
              onClick={openTask}
            />
          )}
        </div>

        <div className="task-card-face task-back">
          <div className="card-controls task-back-controls">
            <button
              className="card-control"
              aria-label={`Sleep ${task.title}`}
              onClick={(event) => {
                event.stopPropagation()
                sleepTask(task.id)
              }}
            >
              <Moon size={15} />
            </button>
            <button
              className="card-control"
              aria-label={`Show artifacts for ${task.title}`}
              onClick={() => setFlipped(false)}
            >
              <PanelTop size={15} />
            </button>
          </div>
          <CompactAgent task={task} />
        </div>
      </motion.div>
    </motion.article>
  )
}

function ClippedArtifactSummary({
  artifacts,
  onClick,
}: {
  artifacts: Artifact[]
  onClick: () => void
}) {
  const labelsRef = useRef<HTMLSpanElement>(null)
  const [visibleCount, setVisibleCount] = useState(artifacts.length)

  useLayoutEffect(() => {
    const labels = labelsRef.current
    if (!labels) return

    const updateVisibleCount = () => {
      const context = document.createElement('canvas').getContext('2d')
      if (!context) return

      const styles = window.getComputedStyle(labels)
      context.font = styles.font
      const gap = 8
      let nextCount = 0

      for (let count = artifacts.length; count >= 0; count -= 1) {
        const hiddenCount = artifacts.length - count
        const labelWidths = artifacts
          .slice(0, count)
          .map((artifact) => context.measureText(artifact.title).width)
        if (hiddenCount > 0) {
          labelWidths.push(context.measureText(`+${hiddenCount} more`).width)
        }
        const totalWidth =
          labelWidths.reduce((total, width) => total + width, 0) +
          Math.max(0, labelWidths.length - 1) * gap
        if (totalWidth <= labels.clientWidth) {
          nextCount = count
          break
        }
      }
      setVisibleCount(nextCount)
    }

    const observer = new ResizeObserver(updateVisibleCount)
    observer.observe(labels)
    updateVisibleCount()
    return () => observer.disconnect()
  }, [artifacts])

  const hiddenCount = artifacts.length - visibleCount

  return (
    <button
      className="clipped-artifact-summary"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      onKeyDown={(event) => event.stopPropagation()}
      aria-label="Open task to view clipped artifacts"
    >
      <ChevronsUp size={14} />
      <span className="clipped-artifact-labels" ref={labelsRef}>
        {artifacts.slice(0, visibleCount).map((artifact) => (
          <span key={artifact.id}>{artifact.title}</span>
        ))}
        {hiddenCount > 0 && <strong>+{hiddenCount} more</strong>}
      </span>
    </button>
  )
}

function CompactAgent({ task }: { task: Task }) {
  const { sendMessage } = useWorkspace()
  const [message, setMessage] = useState('')

  return (
    <div className="compact-agent">
      <div className="compact-agent-heading">
        <div className={`agent-orb ${task.session.status}`}>
          <Bot size={17} />
        </div>
        <div>
          <span className="overline">Task agent</span>
          <strong>{stateLabel(task.state)}</strong>
        </div>
      </div>
      <div className="compact-messages">
        {task.session.messages.slice(-4).map((item) => (
          <div className={`message ${item.role}`} key={item.id}>
            <span>{item.role === 'agent' ? 'Agent' : 'You'}</span>
            <p>{item.body}</p>
          </div>
        ))}
        {task.session.status === 'thinking' && (
          <div className="typing-indicator">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      <form
        className="compact-composer"
        onSubmit={(event) => {
          event.preventDefault()
          if (!message.trim()) return
          sendMessage(task.id, message.trim())
          setMessage('')
        }}
      >
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask agent…"
        />
        <button disabled={!message.trim()} aria-label="Send message">
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}

function ArtifactPreview({
  artifact,
  expanded,
  onToggle,
  onMaximize,
}: {
  artifact: Artifact
  expanded: boolean
  onToggle: () => void
  onMaximize: () => void
}) {
  const Icon =
    artifact.kind === 'markdown'
      ? FileText
      : artifact.kind === 'html'
        ? FileCode2
        : FileImage

  return (
    <motion.section
      layout
      data-artifact-id={artifact.id}
      className={`artifact-preview ${expanded ? 'open' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Maximize ${artifact.title}`}
      onClick={(event) => {
        event.stopPropagation()
        onMaximize()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          event.stopPropagation()
          onMaximize()
        }
      }}
    >
      <header>
        <Icon size={14} />
        <strong>{artifact.title}</strong>
        <span>{timeAgo(artifact.updatedAt)}</span>
        <div className="artifact-controls">
          <button
            onClick={(event) => {
              event.stopPropagation()
              onToggle()
            }}
            onKeyDown={(event) => event.stopPropagation()}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </header>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="artifact-preview-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <ArtifactContent artifact={artifact} compact />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

function ArtifactContent({
  artifact,
  compact = false,
}: {
  artifact: Artifact
  compact?: boolean
}) {
  if (artifact.kind === 'image') {
    return (
      <figure className={`image-artifact ${compact ? 'compact' : ''}`}>
        <img src={artifact.imageUrl} alt={artifact.content} />
        {!compact && <figcaption>{artifact.content}</figcaption>}
      </figure>
    )
  }

  if (artifact.kind === 'html') {
    return (
      <div
        className={`html-artifact ${compact ? 'compact' : ''}`}
        dangerouslySetInnerHTML={{ __html: artifact.content }}
      />
    )
  }

  return (
    <div className={`markdown-artifact ${compact ? 'compact' : ''}`}>
      {artifact.content.split('\n').map((line, index) => {
        if (line.startsWith('# ')) return <h1 key={index}>{line.slice(2)}</h1>
        if (line.startsWith('## '))
          return <h2 key={index}>{line.slice(3)}</h2>
        if (line.startsWith('- '))
          return <li key={index}>{renderInline(line.slice(2))}</li>
        if (/^\d\. /.test(line))
          return <li key={index}>{renderInline(line.slice(3))}</li>
        if (!line.trim()) return <br key={index} />
        return <p key={index}>{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(line: string) {
  const parts = line.split(/(\*\*.*?\*\*)/)
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  )
}

function TaskTable({ tasks }: { tasks: Task[] }) {
  const navigate = useNavigate()
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Task',
        cell: ({ row }) => (
          <div className="table-primary">
            <span className={`status-dot ${row.original.session.status}`} />
            <div>
              <strong>{row.original.title}</strong>
              <span>{row.original.summary}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'state',
        header: 'State',
        cell: ({ getValue }) => (
          <span className={`task-state state-${getValue<string>()}`}>
            {stateLabel(getValue<Task['state']>())}
          </span>
        ),
      },
      {
        accessorFn: (task) => task.artifacts.length,
        id: 'artifacts',
        header: 'Artifacts',
        cell: ({ getValue }) => `${getValue<number>()} files`,
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
      },
      {
        accessorKey: 'updatedAt',
        header: 'Activity',
        cell: ({ getValue }) => timeAgo(getValue<number>()),
      },
    ],
    [],
  )
  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <motion.div className="table-wrap" layout>
      <table className="task-table">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {table.getRowModel().rows.map((row) => (
              <motion.tr
                layout
                key={row.original.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -18 }}
                onClick={() =>
                  navigate({
                    to: '/tasks/$taskId',
                    params: { taskId: row.original.id },
                  })
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} data-label={String(cell.column.columnDef.header)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  )
}

export function TaskRoute() {
  const { taskId } = useParams({ from: '/tasks/$taskId' })
  const { tasks, artifactView, setArtifactView } = useWorkspace()
  const task = tasks.find((item) => item.id === taskId)
  const navigate = useNavigate()

  if (!task) return <NotFound label="Task not found" />

  return (
    <section className="mode-view artifact-mode">
      <ModeHeader
        eyebrow="Task"
        title={task.title}
        meta={`${task.artifacts.length} artifacts`}
        leading={<HistoryBackButton />}
        trailing={
          <div className="header-actions desktop-only">
            <SegmentedControl value={artifactView} onChange={setArtifactView} />
          </div>
        }
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={artifactView}
          className="collection-stage"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
        >
          {artifactView === 'cards' ? (
            <motion.div className="artifact-grid" layout>
              {task.artifacts.map((artifact) => (
                <motion.article
                  layout
                  className="artifact-card"
                  key={artifact.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Maximize ${artifact.title}`}
                  onClick={() =>
                    navigate({
                      to: '/tasks/$taskId/artifacts/$artifactId',
                      params: { taskId, artifactId: artifact.id },
                    })
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate({
                        to: '/tasks/$taskId/artifacts/$artifactId',
                        params: { taskId, artifactId: artifact.id },
                      })
                    }
                  }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <header>
                    <div>
                      <ArtifactIcon kind={artifact.kind} />
                      <strong>{artifact.title}</strong>
                    </div>
                  </header>
                  <div className="artifact-card-body">
                    <ArtifactContent artifact={artifact} />
                  </div>
                  <footer>
                    <span>{artifact.kind}</span>
                    <span>Updated {timeAgo(artifact.updatedAt)} ago</span>
                  </footer>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <ArtifactTable task={task} />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function ArtifactIcon({ kind }: { kind: Artifact['kind'] }) {
  if (kind === 'image') return <FileImage size={16} />
  if (kind === 'html') return <FileCode2 size={16} />
  return <FileText size={16} />
}

function ArtifactTable({ task }: { task: Task }) {
  const navigate = useNavigate()
  return (
    <div className="artifact-list">
      {task.artifacts.map((artifact) => (
        <motion.button
          layout
          key={artifact.id}
          onClick={() =>
            navigate({
              to: '/tasks/$taskId/artifacts/$artifactId',
              params: { taskId: task.id, artifactId: artifact.id },
            })
          }
        >
          <ArtifactIcon kind={artifact.kind} />
          <span>
            <strong>{artifact.title}</strong>
            <small>{artifact.content.replace(/[#*<>]/g, '').slice(0, 90)}</small>
          </span>
          <em>{timeAgo(artifact.updatedAt)}</em>
          <ChevronRight size={16} />
        </motion.button>
      ))}
    </div>
  )
}

export function ArtifactRoute() {
  const { taskId, artifactId } = useParams({
    from: '/tasks/$taskId/artifacts/$artifactId',
  })
  const { tasks, updateArtifactContent } = useWorkspace()
  const task = tasks.find((item) => item.id === taskId)
  const artifact = task?.artifacts.find((item) => item.id === artifactId)

  if (!task || !artifact) return <NotFound label="Artifact not found" />

  return (
    <section className="single-artifact-mode">
      <header className="artifact-document-header">
        <HistoryBackButton />
        <div>
          <span className="overline">{task.title}</span>
          <h1>{artifact.title}</h1>
        </div>
        <div className="artifact-document-meta">
          <ArtifactIcon kind={artifact.kind} />
          <span>{artifact.kind}</span>
          <span>{timeAgo(artifact.updatedAt)} ago</span>
        </div>
      </header>
      {artifact.kind === 'markdown' ? (
        <motion.div
          className="artifact-document kind-markdown documint-artifact"
          initial={{ opacity: 0, scale: 0.992 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <Documint
            className="documint-editor"
            content={artifact.content}
            onContentChanged={(content) =>
              updateArtifactContent(task.id, artifact.id, content)
            }
            theme={onDeckDocumintTheme}
          />
        </motion.div>
      ) : (
        <motion.div
          className={`artifact-document kind-${artifact.kind}`}
          initial={{ opacity: 0, scale: 0.992 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <ArtifactContent artifact={artifact} />
        </motion.div>
      )}
    </section>
  )
}

function HistoryBackButton() {
  const router = useRouter()

  return (
    <button
      className="back-button"
      onClick={() => router.history.back()}
      aria-label="Go back"
    >
      <ArrowLeft size={17} />
    </button>
  )
}

function NotFound({ label }: { label: string }) {
  return (
    <div className="not-found">
      <Minimize2 size={22} />
      <h1>{label}</h1>
      <Link to="/">Return to tasks</Link>
    </div>
  )
}
