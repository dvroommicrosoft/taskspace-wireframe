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
- [Visual journey](public/workbench-journey.html): 25 step-by-step snapshots
  with lightweight local interactions, right-column Attachment previews that
  expand into Artifact context, floating-only Agent Channels, a completed
  Thread's Impact widget, and three interactive mobile screen examples.

Open `public/workbench-journey.html` directly, or visit
`http://localhost:5173/workbench-journey.html` with the dev server running.
The walkthrough uses example data only; it does not run agents or create real
uploads, invitations, repository connections, or schedules.
