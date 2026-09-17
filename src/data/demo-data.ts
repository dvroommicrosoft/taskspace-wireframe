import type { AgentSession, Task } from '../types'

const now = Date.now()
const minutes = (value: number) => now - value * 60_000

export const rootSession: AgentSession = {
  status: 'waiting',
  messages: [
    {
      id: 'root-1',
      role: 'agent',
      body: 'I am watching nine active workstreams across thirty-six total tasks. Several need review; the rest are sleeping until new activity arrives.',
      createdAt: minutes(42),
    },
    {
      id: 'root-2',
      role: 'user',
      body: 'Keep the launch work moving and surface anything blocked.',
      createdAt: minutes(39),
    },
    {
      id: 'root-3',
      role: 'agent',
      body: 'Understood. I will reorder the workspace when new activity arrives.',
      createdAt: minutes(38),
    },
  ],
}

const generatedTaskSpecs: Array<{
  id: string
  title: string
  summary: string
  owner: string
  state: Task['state']
  minutesAgo: number
  artifactTitle: string
  artifactContent: string
}> = [
  {
    id: 'empty-state-language',
    title: 'Refine empty-state language',
    summary: 'Make quiet moments feel intentional rather than unfinished.',
    owner: 'Nico',
    state: 'review',
    minutesAgo: 126,
    artifactTitle: 'Empty states.md',
    artifactContent:
      '# Empty states\n\nA quiet workspace is a successful state. Explain what changed, then keep the path back to active work nearby.',
  },
  {
    id: 'activity-model',
    title: 'Map activity signals',
    summary: 'Define which events deserve attention and reordering.',
    owner: 'You',
    state: 'working',
    minutesAgo: 137,
    artifactTitle: 'Activity model.md',
    artifactContent:
      '# Activity model\n\nReorder only when an event changes what the user should look at next. Passive progress remains at the edge.',
  },
  {
    id: 'review-handoff',
    title: 'Prototype review handoff',
    summary: 'Reduce the distance between agent completion and human judgment.',
    owner: 'Ari',
    state: 'idle',
    minutesAgo: 149,
    artifactTitle: 'Handoff notes.md',
    artifactContent:
      '# Review handoff\n\nKeep the changed artifact visible, summarize the decision, and put the agent one gesture away.',
  },
  {
    id: 'filter-vocabulary',
    title: 'Simplify filter vocabulary',
    summary: 'Use filters that describe attention, not database state.',
    owner: 'Maya',
    state: 'review',
    minutesAgo: 164,
    artifactTitle: 'Filter labels.md',
    artifactContent:
      '# Filter labels\n\nPrefer **Needs review** and **Agent working** over implementation-oriented status names.',
  },
  {
    id: 'card-density',
    title: 'Tune card density',
    summary: 'Balance artifact readability with broad workspace awareness.',
    owner: 'You',
    state: 'working',
    minutesAgo: 178,
    artifactTitle: 'Density study.md',
    artifactContent:
      '# Density study\n\nFive cards across at laptop width preserves the mobile-screen proportion while keeping titles scannable.',
  },
  {
    id: 'session-pinning',
    title: 'Test session pinning',
    summary: 'Clarify when agent chat overlays versus resizes content.',
    owner: 'Lena',
    state: 'idle',
    minutesAgo: 191,
    artifactTitle: 'Pin behavior.md',
    artifactContent:
      '# Pin behavior\n\nHover is temporary. Pinning is a deliberate workspace change and should resize content without hiding it.',
  },
  {
    id: 'motion-language',
    title: 'Define motion language',
    summary: 'Make movement explain mutations without becoming decoration.',
    owner: 'Maya',
    state: 'review',
    minutesAgo: 206,
    artifactTitle: 'Motion principles.md',
    artifactContent:
      '# Motion principles\n\nUse springs for object continuity. Use short easing for controls. Never animate without showing cause or destination.',
  },
  {
    id: 'artifact-ordering',
    title: 'Validate artifact ordering',
    summary: 'Keep the most relevant evidence nearest the task title.',
    owner: 'You',
    state: 'working',
    minutesAgo: 223,
    artifactTitle: 'Ordering rules.md',
    artifactContent:
      '# Ordering rules\n\nRecent updates rise first. Expanded state remains local to the card and does not affect global ordering.',
  },
  {
    id: 'root-agent-scope',
    title: 'Clarify root agent scope',
    summary: 'Separate workspace coordination from task-specific work.',
    owner: 'Nico',
    state: 'idle',
    minutesAgo: 241,
    artifactTitle: 'Root session.md',
    artifactContent:
      '# Root session\n\nThe root agent coordinates priorities and cross-task changes. It does not replace the task agent.',
  },
  {
    id: 'keyboard-navigation',
    title: 'Sketch keyboard navigation',
    summary: 'Move through cards, artifacts, and edge panels without extra chrome.',
    owner: 'Ari',
    state: 'review',
    minutesAgo: 265,
    artifactTitle: 'Keyboard map.md',
    artifactContent:
      '# Keyboard map\n\nArrow keys move spatially. Enter changes mode. Escape restores the previous mode or closes a temporary drawer.',
  },
  {
    id: 'artifact-loading',
    title: 'Design artifact loading',
    summary: 'Keep task context stable while heavier previews arrive.',
    owner: 'You',
    state: 'working',
    minutesAgo: 288,
    artifactTitle: 'Loading states.md',
    artifactContent:
      '# Loading states\n\nReserve the artifact footprint and reveal content in place. Do not shift neighboring cards for network progress.',
  },
  {
    id: 'archive-flow',
    title: 'Explore archive flow',
    summary: 'Remove completed work without making it feel lost.',
    owner: 'Lena',
    state: 'idle',
    minutesAgo: 314,
    artifactTitle: 'Archive flow.md',
    artifactContent:
      '# Archive flow\n\nAnimate the task out of the active field, then leave a brief reversible trace in the workspace agent.',
  },
  {
    id: 'notification-thresholds',
    title: 'Set notification thresholds',
    summary: 'Separate meaningful changes from passive agent progress.',
    owner: 'Nico',
    state: 'idle',
    minutesAgo: 342,
    artifactTitle: 'Notification rules.md',
    artifactContent:
      '# Notification rules\n\nNotify only when a decision, blocker, or completed result requires human attention.',
  },
  {
    id: 'task-grouping',
    title: 'Explore task grouping',
    summary: 'Test lightweight ways to reveal related workstreams.',
    owner: 'Maya',
    state: 'review',
    minutesAgo: 369,
    artifactTitle: 'Grouping study.md',
    artifactContent:
      '# Grouping study\n\nRelationships should appear when useful without turning the workspace into a folder tree.',
  },
  {
    id: 'agent-presence',
    title: 'Tune agent presence',
    summary: 'Keep active sessions perceptible without demanding attention.',
    owner: 'You',
    state: 'working',
    minutesAgo: 395,
    artifactTitle: 'Presence states.md',
    artifactContent:
      '# Presence states\n\nUse motion and edge signals for active work. Reserve persistent panels for deliberate conversation.',
  },
  {
    id: 'artifact-comparison',
    title: 'Prototype artifact comparison',
    summary: 'Compare revisions without leaving the current task context.',
    owner: 'Ari',
    state: 'idle',
    minutesAgo: 421,
    artifactTitle: 'Comparison model.md',
    artifactContent:
      '# Comparison model\n\nReveal differences inline and keep the current artifact as the stable spatial anchor.',
  },
  {
    id: 'review-queue',
    title: 'Clarify review queue',
    summary: 'Distinguish waiting decisions from merely recent activity.',
    owner: 'Lena',
    state: 'review',
    minutesAgo: 448,
    artifactTitle: 'Review signals.md',
    artifactContent:
      '# Review signals\n\nA task enters review only when a person can make a concrete decision or accept a result.',
  },
  {
    id: 'task-creation',
    title: 'Sketch task creation',
    summary: 'Start new work without introducing a persistent compose surface.',
    owner: 'You',
    state: 'working',
    minutesAgo: 476,
    artifactTitle: 'Creation flow.md',
    artifactContent:
      '# Creation flow\n\nUse a temporary command surface that disappears once the task has enough context to begin.',
  },
  {
    id: 'cross-task-links',
    title: 'Map cross-task links',
    summary: 'Show dependencies only when they affect the next action.',
    owner: 'Nico',
    state: 'idle',
    minutesAgo: 503,
    artifactTitle: 'Dependency map.md',
    artifactContent:
      '# Dependency map\n\nKeep dependencies latent until they block progress, change priority, or explain a mutation.',
  },
  {
    id: 'session-history',
    title: 'Condense session history',
    summary: 'Make long agent conversations easy to re-enter.',
    owner: 'Maya',
    state: 'review',
    minutesAgo: 531,
    artifactTitle: 'History summary.md',
    artifactContent:
      '# History summary\n\nPreserve decisions, open questions, and changed artifacts instead of presenting every message equally.',
  },
  {
    id: 'artifact-errors',
    title: 'Design artifact errors',
    summary: 'Keep failed previews understandable and recoverable.',
    owner: 'Ari',
    state: 'working',
    minutesAgo: 558,
    artifactTitle: 'Error states.md',
    artifactContent:
      '# Error states\n\nKeep the artifact frame stable, explain what failed, and offer the smallest useful recovery action.',
  },
  {
    id: 'filter-composition',
    title: 'Test filter composition',
    summary: 'Combine attention filters without exposing query mechanics.',
    owner: 'You',
    state: 'idle',
    minutesAgo: 586,
    artifactTitle: 'Filter combinations.md',
    artifactContent:
      '# Filter combinations\n\nPrefer a few understandable saved views over a general-purpose query builder.',
  },
  {
    id: 'completion-state',
    title: 'Define completion state',
    summary: 'Make finished work feel settled but still retrievable.',
    owner: 'Lena',
    state: 'review',
    minutesAgo: 613,
    artifactTitle: 'Completion behavior.md',
    artifactContent:
      '# Completion behavior\n\nCompleted tasks leave the active field after a short confirmation and remain available through history.',
  },
  {
    id: 'agent-escalation',
    title: 'Prototype agent escalation',
    summary: 'Surface blocked work without turning every pause into an alert.',
    owner: 'Nico',
    state: 'working',
    minutesAgo: 641,
    artifactTitle: 'Escalation rules.md',
    artifactContent:
      '# Escalation rules\n\nEscalate when the agent cannot proceed without information, permission, or a human judgment.',
  },
  {
    id: 'task-search',
    title: 'Explore task search',
    summary: 'Find older work while keeping filters as the primary navigation.',
    owner: 'Maya',
    state: 'idle',
    minutesAgo: 668,
    artifactTitle: 'Search model.md',
    artifactContent:
      '# Search model\n\nSearch is a temporary lens across all tasks, not another permanent mode in the workspace.',
  },
  {
    id: 'artifact-actions',
    title: 'Simplify artifact actions',
    summary: 'Reduce controls to expansion, focus, and direct manipulation.',
    owner: 'You',
    state: 'review',
    minutesAgo: 696,
    artifactTitle: 'Artifact controls.md',
    artifactContent:
      '# Artifact controls\n\nPlace actions at the artifact they affect and reveal them only when intent is nearby.',
  },
  {
    id: 'workspace-return',
    title: 'Clarify workspace return',
    summary: 'Preserve orientation when moving back from focused modes.',
    owner: 'Ari',
    state: 'working',
    minutesAgo: 723,
    artifactTitle: 'Return behavior.md',
    artifactContent:
      '# Return behavior\n\nReturn to the same task position, expanded artifact, and nearby context whenever possible.',
  },
  {
    id: 'density-breakpoints',
    title: 'Tune density breakpoints',
    summary: 'Adapt card count without changing the interaction vocabulary.',
    owner: 'Lena',
    state: 'idle',
    minutesAgo: 751,
    artifactTitle: 'Breakpoint notes.md',
    artifactContent:
      '# Breakpoint notes\n\nChange the number of visible cards before reducing text or control legibility.',
  },
  {
    id: 'activity-timestamps',
    title: 'Refine activity timestamps',
    summary: 'Communicate freshness without adding visual noise.',
    owner: 'Nico',
    state: 'review',
    minutesAgo: 778,
    artifactTitle: 'Time labels.md',
    artifactContent:
      '# Time labels\n\nUse relative time for scanning and reveal exact timestamps only when the user asks for detail.',
  },
  {
    id: 'workspace-onboarding',
    title: 'Draft workspace onboarding',
    summary: 'Teach the edge model through use instead of an introductory tour.',
    owner: 'You',
    state: 'working',
    minutesAgo: 806,
    artifactTitle: 'Onboarding cues.md',
    artifactContent:
      '# Onboarding cues\n\nUse subtle motion and contextual hints to reveal filters, agent sessions, and focus transitions.',
  },
]

function makeGeneratedTask(
  spec: (typeof generatedTaskSpecs)[number],
): Task {
  const updatedAt = minutes(spec.minutesAgo)
  const sessionStatus =
    spec.state === 'working'
      ? 'thinking'
      : spec.state === 'review'
        ? 'review'
        : 'waiting'

  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    owner: spec.owner,
    state: spec.state,
    updatedAt,
    unread: spec.state === 'review',
    artifacts: [
      {
        id: `${spec.id}-notes`,
        title: spec.artifactTitle,
        kind: 'markdown',
        updatedAt,
        content: spec.artifactContent,
      },
      {
        id: `${spec.id}-preview`,
        title: 'Direction preview.html',
        kind: 'html',
        updatedAt: updatedAt - 18 * 60_000,
        content: `<div class="mini-page"><span class="eyebrow">Exploration</span><h2>${spec.title}</h2><p>${spec.summary}</p><div class="mini-stat"><b>02</b><span>directions compared</span></div></div>`,
      },
    ],
    session: {
      status: sessionStatus,
      messages: [
        {
          id: `${spec.id}-message`,
          role: 'agent',
          body:
            spec.state === 'working'
              ? `I am actively working on ${spec.title.toLowerCase()}.`
              : `The latest direction for ${spec.title.toLowerCase()} is ready to inspect.`,
          createdAt: updatedAt,
        },
      ],
    },
  }
}

const allDemoTasks: Task[] = [
  {
    id: 'launch-narrative',
    title: 'Shape the launch narrative',
    summary: 'Turn product evidence into a concise launch story.',
    owner: 'You',
    state: 'review',
    updatedAt: minutes(4),
    unread: true,
    artifacts: [
      {
        id: 'launch-brief',
        title: 'Launch brief.md',
        kind: 'markdown',
        updatedAt: minutes(4),
        content:
          '# Launch brief\n\nThe workspace should feel less like a queue and more like a living surface for focused work.\n\n## Core message\n\n**See the work, not the machinery.** Agents remain present at the edge until they are needed.',
      },
      {
        id: 'message-map',
        title: 'Message map.html',
        kind: 'html',
        updatedAt: minutes(18),
        content:
          '<div class="mini-page"><span class="eyebrow">Positioning</span><h2>From task list to active workspace</h2><p>Artifacts stay visible while agents work beside them.</p><div class="mini-stat"><b>3×</b><span>less navigation</span></div></div>',
      },
      {
        id: 'hero-study',
        title: 'Hero study.png',
        kind: 'image',
        updatedAt: minutes(61),
        content: 'Dark product composition showing focused task cards.',
        imageUrl:
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    session: {
      status: 'review',
      messages: [
        {
          id: 'launch-1',
          role: 'agent',
          body: 'The revised brief is ready. I tightened the opening and connected the card metaphor to agent activity.',
          createdAt: minutes(6),
        },
        {
          id: 'launch-2',
          role: 'user',
          body: 'Show me the strongest version first.',
          createdAt: minutes(5),
        },
      ],
    },
  },
  {
    id: 'onboarding-study',
    title: 'Synthesize onboarding study',
    summary: 'Identify moments where new users lose confidence.',
    owner: 'You',
    state: 'working',
    updatedAt: minutes(12),
    unread: false,
    artifacts: [
      {
        id: 'research-notes',
        title: 'Research synthesis.md',
        kind: 'markdown',
        updatedAt: minutes(12),
        content:
          '# Emerging pattern\n\nPeople understand what the agent is doing, but not always **where the result went**.\n\n- Preserve spatial context\n- Animate meaningful movement\n- Keep the active artifact visible',
      },
      {
        id: 'journey-map',
        title: 'Journey map.html',
        kind: 'html',
        updatedAt: minutes(46),
        content:
          '<div class="journey"><span>Prompt</span><i></i><span>Work</span><i></i><span class="hot">Result</span><i></i><span>Review</span></div>',
      },
    ],
    session: {
      status: 'thinking',
      messages: [
        {
          id: 'onboarding-1',
          role: 'agent',
          body: 'I am clustering twelve interview notes around visibility, trust, and handoff.',
          createdAt: minutes(12),
        },
      ],
    },
  },
  {
    id: 'design-system-audit',
    title: 'Audit interaction patterns',
    summary: 'Find the minimum control vocabulary for the new shell.',
    owner: 'Maya',
    state: 'working',
    updatedAt: minutes(23),
    unread: true,
    artifacts: [
      {
        id: 'control-inventory',
        title: 'Control inventory.md',
        kind: 'markdown',
        updatedAt: minutes(23),
        content:
          '# Control inventory\n\nKeep persistent controls to three concepts:\n\n1. Change scope\n2. Change presentation\n3. Expose the active agent\n\nEverything else appears at the object it affects.',
      },
      {
        id: 'density-board',
        title: 'Density board.jpg',
        kind: 'image',
        updatedAt: minutes(88),
        content: 'Monochrome interface references.',
        imageUrl:
          'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    session: {
      status: 'thinking',
      messages: [
        {
          id: 'audit-1',
          role: 'agent',
          body: 'I found five duplicated control patterns. I am consolidating them into contextual actions.',
          createdAt: minutes(23),
        },
      ],
    },
  },
  {
    id: 'pricing-prototype',
    title: 'Prototype pricing story',
    summary: 'Explore a calmer comparison experience.',
    owner: 'You',
    state: 'idle',
    updatedAt: minutes(57),
    unread: false,
    artifacts: [
      {
        id: 'pricing-page',
        title: 'Pricing direction.html',
        kind: 'html',
        updatedAt: minutes(57),
        content:
          '<div class="pricing"><div><small>Individual</small><strong>$20</strong><p>Focused work with one agent.</p></div><div class="featured"><small>Team</small><strong>$40</strong><p>Shared tasks and coordinated sessions.</p></div></div>',
      },
      {
        id: 'pricing-notes',
        title: 'Decision notes.md',
        kind: 'markdown',
        updatedAt: minutes(91),
        content:
          '# Decision notes\n\nLead with the unit of value: completed work with visible evidence. Avoid feature-count grids.',
      },
    ],
    session: {
      status: 'waiting',
      messages: [
        {
          id: 'pricing-1',
          role: 'agent',
          body: 'Two directions are ready. The quieter version performs better at narrow widths.',
          createdAt: minutes(57),
        },
      ],
    },
  },
  {
    id: 'weekly-signal',
    title: 'Design weekly signal',
    summary: 'Create a compact summary of changes that need attention.',
    owner: 'Lena',
    state: 'review',
    updatedAt: minutes(74),
    unread: true,
    artifacts: [
      {
        id: 'weekly-digest',
        title: 'Weekly signal.md',
        kind: 'markdown',
        updatedAt: minutes(74),
        content:
          '# This week\n\n- 4 tasks completed\n- 2 decisions waiting\n- 1 sleeping task has new activity\n\nThe summary should point to action, not celebrate volume.',
      },
    ],
    session: {
      status: 'review',
      messages: [
        {
          id: 'weekly-1',
          role: 'agent',
          body: 'The digest now groups activity by decisions needed rather than by project.',
          createdAt: minutes(74),
        },
      ],
    },
  },
  {
    id: 'mobile-navigation',
    title: 'Resolve mobile navigation',
    summary: 'Keep the hierarchy legible without persistent chrome.',
    owner: 'You',
    state: 'idle',
    updatedAt: minutes(112),
    unread: false,
    artifacts: [
      {
        id: 'mobile-model',
        title: 'Mobile model.md',
        kind: 'markdown',
        updatedAt: minutes(112),
        content:
          '# Mobile model\n\nMulti-task stays scannable as a table. Deeper modes use the full screen. Edge gestures temporarily reveal filters and the active agent.',
      },
      {
        id: 'gesture-study',
        title: 'Gesture study.png',
        kind: 'image',
        updatedAt: minutes(160),
        content: 'Mobile edge gesture sketches.',
        imageUrl:
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    session: {
      status: 'waiting',
      messages: [
        {
          id: 'mobile-1',
          role: 'agent',
          body: 'The edge drawer model is documented. No persistent toolbar is required.',
          createdAt: minutes(112),
        },
      ],
    },
  },
  ...generatedTaskSpecs.map(makeGeneratedTask),
]

export const demoTasks = allDemoTasks.map((task, index) =>
  index < 9
    ? task
    : {
        ...task,
        state: 'sleeping' as const,
        unread: false,
        session: { ...task.session, status: 'waiting' as const },
      },
)
