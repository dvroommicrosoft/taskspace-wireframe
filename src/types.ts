export type ArtifactKind = 'markdown' | 'html' | 'image'
export type TaskState = 'working' | 'review' | 'idle' | 'sleeping' | 'archived'
export type FilterId = 'you' | 'mira' | 'theo' | 'inez' | 'sleeping'
export type ViewMode = 'cards' | 'table'
export type CardSize = 'normal' | 'large'

export interface Artifact {
  id: string
  title: string
  kind: ArtifactKind
  updatedAt: number
  content: string
  imageUrl?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  body: string
  createdAt: number
}

export interface AgentSession {
  status: 'thinking' | 'waiting' | 'review'
  messages: ChatMessage[]
}

export interface Task {
  id: string
  title: string
  summary: string
  owner: string
  state: TaskState
  updatedAt: number
  unread: boolean
  artifacts: Artifact[]
  session: AgentSession
}
