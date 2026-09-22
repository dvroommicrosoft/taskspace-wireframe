# Workbench: architecture and first-project journey

This is the product plan for **Workbench**, not a description of the existing
implementation. **Wireframes** means the On Deck demo in this repository.
The companion [visual walkthrough](public/workbench-journey.html) presents
independent snapshots with lightweight, local interactions. It does not connect
to agents, git hosts, invitation services, or a scheduler.

## 1. Confirmed vocabulary and information architecture

- Workbench contains any number of Projects.
- A Project has a name, an automatically derived URL slug, a description, an
  owner, human members, configuration, state, and any number of Threads,
  Artifacts, Comments, and Repos.
- A Thread is a unit or theme of work in a Project. It has a name, description,
  any number of Artifacts and Comments, and references any subset of its
  Project's Repos. "Task" and "work item" in earlier discussion mean Thread.
- A Project or Thread has **zero or one Agent Channel per human member**.
  This supersedes the initial statement that each has one channel in total.
- An Agent Channel is private to its human user. It has any number of Agents.
  Each Agent is a defined role configuration plus a persistent session.
  Users cannot read other users' channels. They can see which humans are
  active in a Project or Thread.
- Comments, artifact annotations, and artifacts are shared Project content.
  The posting user's private channel handles the response. Shared Agent
  Comments are distinct from private agent conversation.
- A Repo is a reference to a git URL. Project repo attachment and Thread repo
  association are distinct operations.

### Artifacts

Every Artifact has a widget presentation.

**Attachment:** represents a durable file. Its file type supplies a default
widget and a default full viewer and/or editor. Examples: an uploaded image,
a pasted Markdown document, `plan.md`, `research.md`, and `explanation.md`.

**Dynamic:** a widget paired with internal data that can interface with the
Workbench SDK. Examples: agent questions, member invitations, repo controls,
agent-maintained todo lists, and output charts.

An agent can define, edit, and attach widgets through tools. The built-in
ask-user-question tool creates a Question Dynamic in the Center Panel.

A **ghost attachment** is an announced output, not a durable file. It shows a
dotted outline and progress indicator. It is not openable and must not appear
as an available file in the peer-attachment list. It becomes a normal
Attachment only when content actually exists.

### Comments and questions

Comments support Markdown and have a human or agent author.

- User Comment: posted -> in progress (agent marks it) -> addressed.
- Agent Comment: can request action, then be marked complete and hidden by
  the agent; the human can also archive it.
- Hidden/old Comments remain accessible through an expandable history.
- Long Comments initially show only their first few lines with **More...**.
- Comments are not Agent Channel messages. Shared requests and responses live
  in the Center Panel; private orchestration and conversation live at right.
- A Question Dynamic remains in the Center Panel until answered or retracted.
  An answered question leaves a collapsed record in the user's channel.
- An agent may retract a pending question when a newer instruction supersedes
  it. Retraction is not an answer.
- Image annotations associate a region and Comment with an Attachment. The
  region persists with an expandable comment marker. Its update reaches the
  posting user's agent automatically.

## 2. Context, navigation, and URLs

The four context levels are **Top**, **Project**, **Thread**, and **Artifact**.
An Artifact inherits its owning Project or Thread, including the user's
channel for that owner.

Confirmed URLs:

- `/` opens Top context.
- `/<project-slug>` opens a Project. The slug is the first path element.

Proposed deeper URL shapes (not yet a routing contract):

- `/<project-slug>/threads/<thread-id>`
- `/<project-slug>/artifacts/<artifact-id>`
- `/<project-slug>/threads/<thread-id>/artifacts/<artifact-id>`

Every context except Top has a Back button in the upper left. It is visible
even when the Titlebar is hidden; when the Titlebar opens it appears integrated
with it. Back from an Artifact restores its owner; Back from a Thread restores
the Project; Back from a Project restores Top.

Navigation should retain relevant view state such as selection, scroll,
pinned widgets, and panel preferences. The exact persistence scope is not yet
specified.

## 3. Shell and layers

The initial "bottom Control Panel" was a terminology error. **Center Panel**
is the correct name. There is **no bottom panel and no bottom gutter**.
The Center Panel cannot be collapsed.

Front to back:

1. Blocking modal layer for login or catastrophic errors.
2. Full-screen-content modal layer.
3. Titlebar and the Items, Center, and Artifact preview columns, with the
   Agent Channel floating above them at the right edge.

Artifact context is navigation, not automatically a modal. The exact uses and
dismissal rules for the full-screen-content modal remain to be specified.

### Panel homes and visibility

| Panel | Home | Behavior |
| --- | --- | --- |
| Titlebar | Top | Always visible at Top; auto-hides elsewhere, can be pinned |
| Items | Left | Can collapse, float for a peek, or dock; can be maximized |
| Center | Center | Always present; reclaims collapsed sides; docks right when Items is maximized |
| Artifact preview | Right column | Opens when an Attachment is selected; can expand into Artifact context |
| Agent Channel | Right edge, floating | Absent at Top; hover/focus/tap to reveal; never pinned or docked |

Present-but-hidden edge panels retain state and expose thin colored/animated
gutters at their home edges. Absent panels have no gutter. Agent activity can
be visible without opening conversation.

With both sidebars open, initial proportions are **1 : 1.5 : 1** for Items,
Center, and Artifact preview. Center reclaims the space of a collapsed sidebar:

| Docked content sidebars | Center presentation |
| --- | --- |
| Both open | Middle column, initially 50% wider than either side |
| Items only | Middle + right space |
| Artifact preview only | Left + middle space |
| Both collapsed | Wider centered reading surface, matching steps 01–05 |

The both-collapsed presentation uses 64% of the available frame, capped at
680px, in Simple and Complex modes. Expanded Artifact content instead uses
all available space when peer Attachments are collapsed.

The Items header has a collapse control. Hover or focus the left gutter for a
floating peek without resizing Center; click the gutter or **Dock Items**
in the floated header to keep Items open. Collapse it to focus on Thread
detail beside its Artifact preview.

Visible column boundaries have draggable separators, revealed on hover or
keyboard focus. Left/Right arrows move a split by 10px; Shift uses 40px.
Home/End reach its minimum/maximum, and double-click restores the default
side width. The desktop concept keeps sidebars at least 200px and Center
at least 280px. Width preferences remain proportional when the frame resizes
and survive closing/reopening panels within that snapshot; reload resets
them. Maximized Items has its own width preference. Floating panels have no
layout divider. Narrow reading viewports scroll the desktop frame; the
dedicated mobile examples retain their screen-based navigation.

Click an Attachment's title, thumbnail, or body to open its content in the
right-hand preview without changing Project/Thread context. Select another
Attachment to replace the preview; close it to return that space to Center.
Fresh-Project Simple mode retains its centered presentation until a sidebar
opens, then follows the same layout rules.

The preview's **Expand** control enters Artifact context: full content uses
the middle and right space, Items lists durable peer Attachments, and Back
restores the owning Project/Thread, its scroll position, Items visibility,
and its preview. Resizing the peer list uses the same Items width preference.
The owner's private channel is unchanged. Ghosts have no preview or Expand.
This is real local context navigation in the walkthrough, not a modal viewer.

The Agent Channel is separate from the Artifact preview. It starts hidden,
including in the Shell Study. Hover, focus, or tap the right-edge control to
float it over the preview or content. It cannot be pinned or docked and never
changes column widths. Titlebar and widget pinning remain available.

### Maximized Items: confirmed interaction

1. Items occupies the former left-plus-center area.
2. Center docks on the right; it does not collapse.
3. Any open Artifact preview closes so it does not conflict with the docked Center.
4. Hovering the Agent Channel overlays it over that Center without resizing.
5. Opening an Attachment restores normal Items/Center widths and opens the
   right-hand preview. Toggling Items maximize also restores the normal frame.

In full Artifact context, content spans the middle and right sections when
peer Attachments are open, and the entire frame when they are collapsed.
The floating channel can cover it temporarily, but cannot reserve space.

### Titlebar

Left: **Workbench**. Right: the user's avatar with an Account + Settings menu.
Top context contains nothing else. In Project, Thread, and Artifact contexts,
also show a Project selector with the current Project name, member avatars,
and a pin-open control. Show the owner first, a vertical separator, then the
other members and a **+** invitation control. The walkthrough uses You, Mira,
and Theo as illustrative titlebar members; it does not imply invitations
were sent during onboarding. Human activity indicators show presence, never
expose private channel contents.

An unpinned Titlebar hides when the pointer leaves its reveal/header region,
keyboard focus moves outside that region, the user clicks elsewhere, or the
browser window loses focus. Moving focus between controls inside the header
keeps it open. A pinned Titlebar stays visible through those events; Top
context remains always visible.

### Items

| Context | Content |
| --- | --- |
| Top | Chronological System Messages, such as release notes, if any |
| Project | Threads, truncated to a recently updated threshold |
| Thread | The same Threads, with the current one selected |
| Attachment | Peer Attachments belonging to the same Project or Thread |

Items defaults to wide formatted cards; a table alternative is available.
Older Threads can be expanded/collapsed. Cards show only the title, one
truncated description line, and the most recently updated widget.
A hover/focus reveal exposes **+** to create a Thread. Repeatable Threads have
a separate tab.

The brief defines the peer list for Attachments, but not for maximized
Dynamics; that Artifact-context case is still open.

### Center: Simple and Complex

Both modes contain an optional title and widget sections.

**Simple:** no section headers or common pin/reorder controls. The top widget
is vertically centered; subsequent widgets follow below it.

**Complex:** widgets can be pinned; pinned widgets can be reordered. Widgets
with expanded presentations can be maximized into Artifact context. A plus
control adds pre-configured artifact widgets that are not already present.
Show collapsible headers only for nonempty sections.

| Context | Center content |
| --- | --- |
| Top, Simple | New Project widget; below it, existing Projects with descriptions and member avatars, owner first |
| Fresh Project, Simple | Project name/description; centered Get Started; Add Attachments; any Attachments |
| Active Project, Complex | Project name/description; Comments; Questions; Controls; Add Attachments; Attachments |
| Thread, Complex | Thread name/description; the same sections, scoped to the Thread |
| Artifact | Full artifact content |

A fresh Project means **no Threads and no messages in the viewing user's
Project Agent Channel**. Attachments alone do not exit Simple mode. The
per-user interpretation follows the clarified channel model; how shared
Comments from other members affect this condition is an open detail.

Todo Dynamics are shown under Controls in this walkthrough. Their definitive
section classification remains a design choice.

### Agent Channel

Always floating when shown. No Pin action, docked state, or layout-resizing
side effect exists. The right column belongs to Artifact preview, not chat.

- Top: not present.
- Project: current user's Project channel.
- Thread: current user's Thread channel.
- Artifact: current user's channel for the Artifact's Project or Thread owner.

The walkthrough uses a **Facilitator** in the Project channel and a **Thread
agent** in Thread channels. Multiple configured agents may share one user's
channel. Shared member presence and private channel ownership must remain
visually distinct.

## 4. Visual direction, inherited from the wireframes

Preserve On Deck's near-black foundation (`#090a0c`), layered dark surfaces
(`#0e1013`, `#13161a`, `#191c21`), low-contrast borders, muted supporting text,
rounded cards, restrained lime (`#b6ff57`) accents, small avatar groups, and
content-first controls. Keep agent conversation secondary to artifacts.

Extend those concepts with a real Project hierarchy, a persistent Center,
shared Comments, typed Dynamics, and private per-human Agent Channels.
Do not rename or rewrite the old demo as part of this deliverable.

Activity uses both a text label and a visual signal; color alone is not state.
Motion explains incoming Questions, new Threads, ghost creation, content
arrival, and edge activity. Respect reduced-motion preferences.

Illustrative only: the sample Project is **On Deck evolution**. Sample
schedules use Monday/Wednesday/Friday at 09:00, America/Los_Angeles. These are
not committed product defaults or real scheduled jobs.

## 5. Step-by-step journey

### A. Arrive and collect context

1. Open `/`. Always-visible Titlebar, optional System Messages at left, no
   Agent Channel. New Project is the centered primary widget; existing
   Projects and owner-first avatars sit below.
2. Expand New Project to reveal name and description. Create derives a slug
   and navigates to the Project.
3. Enter fresh Project Simple mode. Titlebar, Items, and Agent Channel start
   hidden. The Back button remains available.
4. Drag an image into Add Attachments. An image Attachment appears below it.
5. Paste text into Add Attachments. A durable Markdown Attachment is created
   with that content. Stay in Simple mode.

### B. Onboard through shared widgets

6. Click Get Started. Create a long canned User Comment summarizing the
   onboarding request; preview its first lines with More. Mark it in progress.
   Project moves to Complex mode, right gutter indicates agent activity.
7. Facilitator tools attach the Repo Config Dynamic, initially empty, and
   post an Agent Comment asking for a repo URL. The widget lists attached
   Repos and supports adding/removing their references.
8. Attach a repo. The Facilitator completes and hides its request Comment.
   A completion-policy Question appears: merge to local branch, merge PR,
   push branch, no definition, or a freeform answer. After answer, remove the
   widget and keep a collapsed channel record.
9. Add a Member Control Dynamic plus an Agent Comment suggesting invitations.
   The agent does not block waiting for invitations.
10. Drawing on the initial image and Markdown context, a Question suggests
    first-Thread subjects. User archives the invitation suggestion and writes
    their own answer. Member controls remain available.
11. Facilitator creates the Thread, sends planning instructions to the user's
    new Thread channel, marks onboarding addressed, and posts next steps.
    The new left-side card displays its newest todo widget: Planning in
    progress. The user can reveal Items to see it.

### C. Plan and annotate in Thread context

12. Open that Thread. Right panel is hidden. Center shows todo Controls,
    Add Attachments, and a dotted, spinning `plan.md` ghost. It cannot open.
13. A Thread-agent Question animates into Questions. User answers; it leaves
    Center and becomes a collapsed channel line. Right gutter activity
    reflects ongoing planning messages.
14. Add another image to this Thread. Its widget appears among Attachments.
    Click it to inspect it in the right-hand Artifact preview, while remaining
    in Thread context.
15. Expand the image preview. Artifact context displays it fully; Items contains this
    Thread's available peer Attachments. At this point the image is the only
    durable Thread Attachment, so it is selected and alone. `plan.md` is
    still a ghost. Full artifact content takes the middle and right sections.
16. Drag a selection box around a button; a floating comment composer opens.
    Enter a color instruction. Submit collapses to a marker; expand it to
    read the annotation. The user's Thread agent receives the update and the
    right gutter responds.

### D. Start another Thread and change its direction

17. Back restores Thread context. Reveal Items; hover/focus its header to
    expose +. Create prepends an untitled Thread, opens it in Center, and
    focuses its expanded Description. No generated artifacts yet.
18. Save a description. Agent activity begins, the agent generates the title,
    and a Question asks whether to plan different ideas.
19. Ignore that Question. New Comment posts an instruction to research an
    open-source project and explain how it could be leveraged. The Comment
    collapses under Comments and is marked in progress. Agent retracts the
    planning Question, announces a `research.md` ghost, and starts research.
    The sample uses TanStack Table as illustrative research subject only.

### E. Coordinate at Project level

20. Back opens the Project. Post a Comment requesting repeatable Threads for
    maintaining/pruning tests, exploring UX, and finding dead code. Request
    weekly morning runs on different weekdays.
21. Switch Items to Repeatable Threads. Watch the three definitions and their
    schedules appear. These are reusable definitions, not the two active
    one-off Threads. Run-generation semantics remain open.
22. Post another Project Comment: monitor the two in-progress Threads, keep
    them aligned, and write an explanation of the Project.
23. Facilitator works; Project right gutter signals activity. A shared
    `explanation.md` ghost appears without a working Open control.
24. The file is populated. Replace ghost styling with an available Attachment
    widget that opens in the right-hand preview, then can expand into Project
    Artifact context. The explanation
    deliverable is ready; the continuing monitoring instruction must not be
    misleadingly marked wholly addressed.

### F. Inspect a completed Thread's impact

25. Later, the first-run implementation is complete and its PR is merged into
    `main`, satisfying the Thread's completion policy. Show an **Impact**
    Dynamic under Controls with the merged-PR link, a short explanation of
    the change, and code-diff totals immediately after **Impact**:
    **Impact +186 / -42**. Hover the label or either count for a floating
    breakdown of every affected directory and its added/removed line counts,
    rather than a permanently expanded directory list. The Thread's
    card shows the same Impact label, counts, and hover instead of a planning spinner. Its
    channel is quiet and retains its completion message. The Project's
    ongoing monitoring request is independent of this completed Thread.

The sample Impact uses a local, explicitly fictional PR #42 fixture: eight
files, 186 added lines, and 42 removed lines across `src/onboarding/`,
`src/components/shell/`, `src/styles/`, and `tests/onboarding/`. Its link opens
a local merged-PR example, not an invented live GitHub URL.

The illustrative directory breakdown is `src/onboarding/` +88/-18,
`src/components/shell/` +44/-12, `src/styles/` +18/-8, and
`tests/onboarding/` +36/-4; these sum to the displayed +186/-42 total.
Keyboard focus or tapping the Impact/count control also opens the breakdown.
The hover stays open while the pointer is over it, dismisses on Escape or an
outside click, and floats above panel clipping without resizing the layout.

### G. Mobile concept: three columns become three screens

This is a proposed mobile interaction design, chosen for this iteration:

- Default to **Work**, the full-width Center content. Use an always-visible
  compact header with Back, Project name, and an **Agent** activity button,
  followed by a screen switcher: **Items / Work / Preview**. These map to the
  three content columns, not a bottom panel or bottom gutter.
- Items maps to the left column. Select a Thread to open Work. Show member
  avatars here, with the owner separated from members and a + invite button.
- Work retains Comments, Questions, Controls, Add Attachments, and Attachments.
  Preview displays the selected Attachment. Agent opens the user's private
  conversation in a floating, dismissible overlay above the current screen.
  There is no Agent tab or pinning.
- Use text badges for pending Questions on Work and activity on the Agent button.
  Background events never switch screens automatically.
- Screen switching preserves the selected Thread, scroll position, pending
  answers, and Comment drafts. No hover, permanent drawers, or pinning is
  needed on mobile.
- Opening an Attachment shows Preview without leaving Thread context.
  Expand replaces Work with full Artifact content and changes Items to peers.
  The Agent overlay keeps its owner's channel. Back restores the Thread and
  its prior Work position; dismissing Agent reveals the unchanged screen.
- At Top, Work shows project creation and existing Projects. Items exists
  only when there are System Messages; Preview and Agent are absent. At
  Project, all three content screens and the overlay are Project-scoped.
- Use at least 44px interactive touch targets. File/photo pickers and pasted
  text replace reliance on drag-and-drop. A future explicit Mark region mode
  would distinguish annotation gestures from image scrolling/zooming; the
  current phone examples use a preselected region and expandable Comment.
- Three independent, interactive phone examples start on Items, Work, and
  Preview. Each supports screen switching, question answers recorded in Agent,
  shared Comment entry, draft preservation, and Artifact/peer navigation.
  The example Back-to-Project link returns to the desktop Project snapshot.

## 6. Walkthrough implementation and boundaries

- Deliver one standalone long HTML page in `public/workbench-journey.html`,
  alongside this plan in the repository root.
- Title the page **Projects, Threads, and Artifacts**, with the subheader
  **Three-column Format Concept**.
- Use 25 numbered before/after snapshots, organized into six journey chapters,
  followed by a seventh section with a dedicated mobile experience study.
  Each has a human action, visible result, and agent/system consequence.
- Include an interactive shell study for all four sidebar visibility states,
  floating Agent Channel, expanded Artifact context, and maximized Items.
  Start with the Agent Channel hidden, `project-brief.md` open in the right
  preview, and the default 1 : 1.5 : 1 proportions. Follow it with a separate
  Thread + image focus study, initially showing Items collapsed and Center
  using left + middle space. Both examples have resizable visible splits.
- Lightweight local interactions include expanding Comments, answering
  Questions, showing panels, toggling cards/table, selecting tabs, changing
  widget pin/order, previewing Attachments, entering sample descriptions,
  and demonstrating image-region Comments.
- Examples are independent; altering one does not rewrite later snapshots.
  Reset/reload restores the sample. No persistence, real file upload, network
  invitations, real agents, or scheduling is implied.
- New Project, upload/paste, and handoff controls may move to the next
  documented snapshot instead of simulating a backend. State this distinction.
- All editable text is rendered as text, not trusted markup.
- Retain a legible narrow-screen reading layout; wide desktop compositions
  can scroll within their frame rather than shrinking text to unreadable size.
- Use keyboard-operable controls, visible focus, labeled forms, restrained
  live regions, and reduced-motion support.

## 7. Deliberately unresolved product details

These do not prevent an illustrative walkthrough and must not be presented as
settled implementation rules:

- Exact recent-Thread cutoff, ranking, and shared ordering behavior.
- Slug collision handling, renames, and final deeper route syntax.
- Login/provider flows and catastrophic-error recovery; full-screen modal use.
- Private channel creation timing and ownership/lifecycle across membership changes.
- How multiple members' agents avoid conflicting writes to shared artifacts,
  and the permission boundary for cross-Thread coordination.
- Whether Question widgets are shared, answerable by any member, or targeted;
  this single-user journey shows questions for the viewing user.
- Agent routing for a shared Comment when its author leaves or has no channel.
- Durable panel preferences and view-state persistence, final mobile annotation
  gestures, and production minimum panel sizes. The mobile
  screen-switcher and in-session state retention are proposed above.
- Expanded Dynamic peer navigation; todo section placement; widget pin
  ordering across sections and members.
- Image annotation anchoring when an image is replaced or resized.
- File upload/paste naming, supported formats, size limits, and failures.
- Recovery for failed/stalled ghosts and agent runs.
- Repeatable-Thread definition vs. generated-run model, timezone preferences,
  missed runs, overlap, pause/edit/delete behavior, and schedule authorization.
- Monitoring cadence, lifetime, stop controls, and completion semantics for
  mixed finite deliverables and ongoing instructions.

## 8. Acceptance checklist

- All four contexts and both Center modes appear.
- The user clarifications supersede the original bottom-panel and single-
  channel descriptions everywhere.
- No bottom gutter or collapsible Center is introduced.
- Panel study implements Items-maximize / attachment-open transitions.
- Initially, three open columns use 1 : 1.5 : 1. Center reclaims either
  collapsed side and uses the wider centered presentation when both are
  collapsed. Hover peeks do not resize it.
- Visible splits resize by pointer or keyboard, enforce minimum widths, and
  retain preferences across panel visibility changes.
- Attachments open the right-hand preview; Expand enters full Artifact context,
  retains the owning channel, and Back restores the owner, Items visibility,
  and preview.
- No Agent Channel Pin control or docking behavior exists. Hover/float never
  resizes the content.
- Sample Thread cards show title, truncated summary, and one latest widget.
- Ghosts cannot be opened; the Artifact peer list excludes unrealized files.
- Shared Comments are visually distinct from private channels.
- Onboarding, repo config, completion policy, nonblocking invitations,
  Thread handoff, image annotation, research redirection, recurrence, and
  Project explanation are all represented.
- The current On Deck app remains intact.
- A completed Thread shows Impact, a local merged-PR example, diff totals,
  affected directories, and a quiet channel rather than false ongoing work.
- Mobile examples preserve context across Items / Work / Preview and the
  floating Agent overlay, including Artifact ownership and answer records.
- Unpinned Titlebars hide on pointer exit, focus departure, outside click, and
  window blur; pinned and Top-level Titlebars remain visible.
