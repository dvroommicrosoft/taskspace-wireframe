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
  useRouterState,
} from '@tanstack/react-router'
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
  Expand,
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
  Pin,
  PinOff,
  Play,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
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
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const [agentPinned, setAgentPinned] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const touchStart = useRef<number | null>(null)

  const closeTransientDrawers = () => {
    setLeftOpen(false)
    if (!agentPinned) setRightOpen(false)
  }

  return (
    <div
      className={`workspace-shell ${agentPinned ? 'agent-is-pinned' : ''}`}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        const end = event.changedTouches[0]?.clientX
        if (start === null || end === undefined) return
        if (start < 24 && end - start > 52) setLeftOpen(true)
        if (start > window.innerWidth - 24 && start - end > 52)
          setRightOpen(true)
        touchStart.current = null
      }}
    >
      <button
        className="edge edge-left"
        aria-label="Open filters"
        onClick={() => setLeftOpen(true)}
        onMouseEnter={() => setLeftOpen(true)}
      >
        <span className="edge-active-mark" />
      </button>

      <AnimatePresence>
        {leftOpen && (
          <motion.aside
            className="floating-drawer filter-drawer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setLeftOpen(false)}
          >
            <div className="drawer-heading">
              <div>
                <span className="overline">Workspace</span>
                <strong>Taskspace</strong>
              </div>
              <button
                className="icon-button mobile-only"
                onClick={() => setLeftOpen(false)}
                aria-label="Close filters"
              >
                <X size={17} />
              </button>
            </div>

            <nav className="filter-list" aria-label="Task filters">
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
                    onClick={() => {
                      setFilter(id)
                      setLeftOpen(false)
                    }}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                    <small>{count}</small>
                  </button>
                )
              })}
            </nav>

            {location.pathname === '/' && (
              <div className="drawer-section">
                <span className="overline">Presentation</span>
                <SegmentedControl value={taskView} onChange={setTaskView} />
                <div className="drawer-subsection">
                  <span className="overline">Card size</span>
                  <CardSizeControl value={cardSize} onChange={setCardSize} />
                </div>
              </div>
            )}

            <div className="drawer-foot">
              <Sparkles size={15} />
              <span>Generated demo workspace</span>
            </div>
          </motion.aside>
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
        <span className="agent-pulse" />
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

function CardSizeControl({
  value,
  onChange,
}: {
  value: CardSize
  onChange: (value: CardSize) => void
}) {
  return (
    <div className="segmented">
      <button
        className={value === 'normal' ? 'selected' : ''}
        onClick={() => onChange('normal')}
      >
        <Minimize2 size={15} />
        Normal
      </button>
      <button
        className={value === 'large' ? 'selected' : ''}
        onClick={() => onChange('large')}
      >
        <Maximize2 size={15} />
        Large
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

  const explodeTask = () => {
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
        <div className="task-card-face task-front">
          <div className="task-card-bar">
            <button
              className="card-control explode"
              aria-label={`Open ${task.title}`}
              onClick={explodeTask}
            >
              <Expand size={15} />
            </button>
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
                onClick={() => sleepTask(task.id)}
              >
                <Moon size={15} />
              </button>
              <button
                className="card-control"
                aria-label={`Show agent for ${task.title}`}
                onClick={() => setFlipped(true)}
              >
                <RotateCcw size={15} />
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
              onClick={explodeTask}
            />
          )}
        </div>

        <div className="task-card-face task-back">
          <button
            className="flip-back"
            onClick={() => setFlipped(false)}
            aria-label="Return to task artifacts"
          >
            <RotateCcw size={15} />
            Artifacts
          </button>
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
      onClick={onClick}
      aria-label="Open task to view clipped artifacts"
    >
      <ChevronsUp size={14} />
      <span className="clipped-artifact-labels" ref={labelsRef}>
        {artifacts.slice(0, visibleCount).map((artifact) => (
          <span key={artifact.id}>{artifact.title}</span>
        ))}
        {hiddenCount > 0 && <strong>+{hiddenCount} more</strong>}
      </span>
      <Expand size={14} />
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
    >
      <header>
        <Icon size={14} />
        <strong>{artifact.title}</strong>
        <span>{timeAgo(artifact.updatedAt)}</span>
        <div className="artifact-controls">
          <button onClick={onToggle} aria-label={expanded ? 'Collapse' : 'Expand'}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <button onClick={onMaximize} aria-label="Maximize artifact">
            <Maximize2 size={13} />
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
        leading={
          <Link className="back-button" to="/" aria-label="Back to tasks">
            <ArrowLeft size={17} />
          </Link>
        }
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
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <header>
                    <div>
                      <ArtifactIcon kind={artifact.kind} />
                      <strong>{artifact.title}</strong>
                    </div>
                    <button
                      onClick={() =>
                        navigate({
                          to: '/tasks/$taskId/artifacts/$artifactId',
                          params: { taskId, artifactId: artifact.id },
                        })
                      }
                      aria-label={`Maximize ${artifact.title}`}
                    >
                      <Maximize2 size={15} />
                    </button>
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
  const { tasks } = useWorkspace()
  const task = tasks.find((item) => item.id === taskId)
  const artifact = task?.artifacts.find((item) => item.id === artifactId)

  if (!task || !artifact) return <NotFound label="Artifact not found" />

  return (
    <section className="single-artifact-mode">
      <header className="artifact-document-header">
        <Link
          className="back-button"
          to="/tasks/$taskId"
          params={{ taskId }}
          aria-label={`Back to ${task.title}`}
        >
          <ArrowLeft size={17} />
        </Link>
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
      <motion.div
        className={`artifact-document kind-${artifact.kind}`}
        initial={{ opacity: 0, scale: 0.992 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <ArtifactContent artifact={artifact} />
      </motion.div>
    </section>
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
