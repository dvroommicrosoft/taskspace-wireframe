# Taskspace wireframe

Taskspace is a functional, dark-mode prototype for managing AI-assisted tasks, artifacts, and agent sessions. It demonstrates multi-task triage, focused task and artifact views, animated state changes, and responsive desktop/mobile behavior using generated in-memory data.

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
