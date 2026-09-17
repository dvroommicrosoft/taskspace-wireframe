# AI Task Workspace Wireframe Plan

## Prototype goal

Build a functional, animated, dark-mode prototype for managing AI-assisted work. The interface should maximize content, keep navigation and session chrome nearly invisible until needed, and make hierarchy changes feel spatially coherent.

The first polished journey covers both:

1. Browsing and triaging many tasks, including sleep and animated list mutations.
2. Opening a task, maximizing an artifact, and working with its task-specific agent.

The prototype uses realistic generated data only. It is a visual interaction demo, not a production backend.

## Product model

- **Tasks** are the primary top-level objects.
- **Artifacts** belong to tasks and render inline as Markdown, HTML previews, or images.
- **Agent sessions** include one root session for multi-task mode and one session per task.
- **Filters** choose which tasks appear in multi-task mode.

## Mode hierarchy

```text
Multi-task
  card grid (desktop default)
  task table (desktop/mobile)
  root agent session
    |
    | explode task
    v
Single-task
  artifact card grid (desktop default)
  artifact table (desktop)
  task agent session
    |
    | maximize artifact
    v
Single-artifact
  maximized artifact content
  task agent session
```

Routes preserve the hierarchy:

- `/` — multi-task mode
- `/tasks/$taskId` — single-task mode
- `/tasks/$taskId/artifacts/$artifactId` — single-artifact mode

## Global frame

### Desktop

- Main content occupies almost the entire viewport.
- A narrow left edge gutter indicates the active filter with a short accent line.
- Hovering or focusing the left edge opens a floating icon-first filter sidebar.
- A narrow right edge gutter shows agent state through a small pulse/status treatment.
- Hovering or focusing the right edge opens the active agent session.
- The agent panel auto-hides when unpinned. Pinning it converts the overlay into a dock and resizes the content frame.
- Multi-task mode uses the root agent session; task and artifact modes use the selected task's session.

### Mobile

- Multi-task mode is table-only.
- Single-task and single-artifact modes are maximized presentations.
- Left and right edge taps or horizontal swipes open temporary overlay drawers.
- Drawers never permanently reduce the content viewport.

## Multi-task mode

### Card presentation

- Default desktop view.
- Cards use a tall, mobile-screen-like aspect ratio.
- The responsive grid changes column count with viewport width.
- Vertical padding exposes slices of adjacent rows as a scrolling affordance.
- Wheel/trackpad navigation settles one aligned row at a time.
- Grid changes animate additions, removals, and reordering with restrained spring motion.

### Task card front

- Minimal title strip with title, activity state, and no permanently visible buttons.
- Hover/focus reveals:
  - upper-left: explode into single-task mode
  - upper-right: sleep and flip
- Artifact previews are ordered by recently updated.
- Artifact stack scrolls independently when content exceeds the card.
- Each artifact has a minimal title strip.
- Artifact hover/focus reveals expand/collapse and maximize controls.
- Markdown, HTML, and image artifacts receive recognizable inline renderings rather than generic placeholders.

### Task card back

- Flip uses a restrained 3D spring.
- Back surface shows the task agent conversation and a compact composer.
- Flip control returns to the artifact side.
- Sending a message streams a scripted response and may update task or artifact state.

### Table presentation

- Uses TanStack Table.
- Optimized for scanning title, state, agent status, artifact count, latest activity, and owner.
- Row activation opens single-task mode.
- Mobile uses a reduced, stacked row composition while retaining table semantics.

## Single-task mode

- Shows task title and only the controls needed to return, switch presentation, or expose drawers.
- Desktop defaults to a responsive artifact card grid.
- Optional desktop table view uses TanStack Table.
- Artifact mutations animate.
- Artifact cards are wider than task cards and emphasize readable content.
- Maximizing an artifact enters single-artifact mode.
- Agent drawer is the selected task's session.

## Single-artifact mode

- Artifact content owns the viewport.
- Markdown uses a distraction-free document layout.
- HTML uses a contained live-looking preview surface.
- Images use fit/zoom-friendly presentation.
- A minimal breadcrumb/back control restores task mode.
- The right edge still exposes the task agent session.

## Filters and sleep

Initial filters:

- My active tasks — default
- Needs review
- Agent working
- Sleeping
- All tasks

Sleeping a task removes it from ordinary filters until a scripted new-activity event occurs. The removal and later re-entry animate rather than abruptly changing the list.

## Agent behavior

- Conversations are generated and stored in local in-memory state.
- Sending a message immediately appends the user message.
- A typing indicator appears, followed by a visibly streamed scripted response.
- Selected scripts trigger meaningful UI mutations, such as:
  - artifact updated and reordered
  - task moved to needs-review
  - task activity timestamp changed
  - sleeping task awakened
- Root session discusses and mutates the multi-task workspace.
- Task sessions discuss and mutate only their task.

## Scripted demo events

A subtle demo control opens a small event menu. Events run one at a time:

- Add a task.
- Move a task to the top after new agent activity.
- Add or update an artifact.
- Mark work ready for review.
- Remove/archive a task.
- Wake a sleeping task.

Every event uses motion to explain what changed. The control stays visually subordinate to the product UI.

## Motion system

- Standard transitions: 180–300ms.
- Use opacity and short translations for drawers, hover controls, and route-level continuity.
- Use spring motion only for card flips and collection reflow.
- Animate layout changes instead of manually calculating item positions.
- Respect `prefers-reduced-motion`.
- Motion should identify cause and destination, not decorate.

## Visual system

- Dark monochrome foundation with subtle warm/cool gray separation.
- One restrained accent identifies selection, focus, and live agent activity.
- Borders are low-contrast and used only where spacing cannot communicate grouping.
- Shadows are limited to floating drawers and lifted hover states.
- Controls use icons with tooltips and accessible labels.
- Typography and spacing carry most of the hierarchy.
- Realistic task names, conversation snippets, Markdown, HTML previews, and generated image compositions support a polished product-prototype feel.

## Responsive targets

- Primary desktop composition: 1440 × 900.
- Compact desktop/tablet: reduce grid columns and shorten drawer widths.
- Mobile: approximately 390 × 844, table-only multi-task mode, maximized nested modes, overlay drawers.

## Technical approach

- Vite
- React
- TypeScript
- TanStack Router
- TanStack Table
- Motion for React for layout, presence, flip, and drawer animation
- Lucide React for minimal iconography
- Local reducers/context for generated tasks, artifacts, sessions, filters, and scripted mutations
- CSS variables and responsive CSS for the visual system

## Proposed source shape

```text
src/
├── app/
│   ├── router.tsx
│   └── store.tsx
├── components/
│   ├── shell/
│   ├── tasks/
│   ├── artifacts/
│   └── agent/
├── data/
│   └── demo-data.ts
├── routes/
│   ├── workspace-route.tsx
│   ├── task-route.tsx
│   └── artifact-route.tsx
├── styles/
│   └── app.css
├── types.ts
└── main.tsx
```

## Implementation order

1. Scaffold Vite/React/TypeScript and install the selected libraries.
2. Add generated domain data, store actions, and routes.
3. Build the adaptive near-invisible shell and edge drawers.
4. Build multi-task card and table presentations.
5. Build task-card artifact previews, card flip, sleep, and navigation.
6. Build single-task artifact views and single-artifact renderers.
7. Add scripted agent streaming and mutation events.
8. Run the prototype and inspect desktop and mobile interactions in a browser.
9. Iterate on information density, drawer behavior, motion clarity, and responsive composition.

