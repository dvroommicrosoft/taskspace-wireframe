# On Deck

On Deck is a functional, dark-mode prototype for managing AI-assisted tasks, artifacts, and agent sessions. It demonstrates multi-task triage, focused task and artifact views, animated state changes, and responsive desktop/mobile behavior using generated in-memory data.

## Run locally

Prerequisites: Node.js 20 or newer and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To create a production bundle:

```bash
npm run build
```

## Demo interactions

- Hover the left and right edges to open filters and the active agent session.
- Open a task, maximize an artifact, and navigate back through the workspace hierarchy.
- Flip a task card to chat with its task-specific agent.
- Put tasks to sleep or use the **Demo event** menu to add, update, reorder, review, archive, and wake tasks.
- Switch between card and table presentations where available.

A recorded walkthrough is included at [`taskspace-demo.mp4`](./taskspace-demo.mp4).

## Published demo

[https://dvroommicrosoft.github.io/taskspace-wireframe/](https://dvroommicrosoft.github.io/taskspace-wireframe/)

## Workbench concept

The next-product concept is documented separately from the existing On Deck
wireframes:

- [Published Workbench walkthrough](https://dvroommicrosoft.github.io/taskspace-wireframe/workbench-journey.html)
- [Architecture and journey plan](WORKBENCH_PLAN.md)
- [Visual journey](public/workbench-journey.html): nine independent interactive
  screens, from inline Project creation through onboarding, the first Thread,
  Thread details, an editable new card, and a scrolling twelve-card grid.
  Project context expands from a fixed bottom anchor. Floating details have
  folder tabs for curated Artifacts, a Gallery, and More only on overflow.
  Cards contain widget carousels with nested checklists, Questions, or Impact.
  A Comment composer below each widget, inside the carousel slide's scroll area,
  lets users steer agents from the card view without increasing card height,
  sharing drafts and Attachments with Thread details.
  A fixed-height titlebar reveals its full controls on hover or keyboard focus.
  Comment Attachments support file selection, paste, and Save as Artifact.
  Three mobile examples use Project / Thread list / Thread detail swipe
  navigation, showing only one screen at a time. Neutral surfaces use violet
  for selection and primary actions, orange for Questions, and standard
  green/red diff counts.
  Another-member example uses orange selection and a content-only read-only glow.
  Folder tabs overlap without resizing on selection; card carousels have an
  attached dot-and-arrow control beneath them.
  An Artifact promotion example shares a Thread file with the Project by
  reference. Promotion actions live in open file tabs, not Comment references.
  Examples initialize progressively near the viewport. The earlier 25-step
  three-column journey has its own [comparison page](public/workbench-earlier.html)
  and is not rendered by the current page.
  The **Projects, Threads, and Cards** concept also includes member-filtered
  Thread views, global search, personal sleep, read-only view-as modes,
  assignment controls, generated SVG icons, attachment promotion, aligned
  gutters, and interactive activity-timeline explainers.

Open `public/workbench-journey.html` directly, or visit
`http://localhost:5173/workbench-journey.html` with the dev server running.
Keep `workbench-journey.css`, `workbench-grid.js`, `workbench-grid.css`, `workbench-concepts.js`,
`workbench-concepts.css`, and the companion SVG
assets beside the HTML when copying it elsewhere. The walkthrough uses
example data and optional files held locally in the current tab; it does not
run agents, upload files, send invitations, connect repositories, or schedule jobs.
Each screen has independent in-memory state. Reloading clears local changes.
