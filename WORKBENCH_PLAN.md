# Projects, Threads, and Widgets

**Reimagining the Workbench UI format and Information Architecture**

This is the product plan for **Workbench**, not a description of the existing
implementation. **Wireframes** means the On Deck demo in this repository.
The audience already knows Workbench, not these wireframes. Introduce the
proposal through three contrasts: **Tenants become Projects**, **Threads, not
Tasks**, and **Recognizable From a Distance**. Projects make the incoming
Tenant concept work-centric and provide a home for artifacts spanning Threads.
The companion [visual walkthrough](public/workbench-journey.html) now leads
with an abbreviated, eight-screen grid-first journey. The earlier independent
three-column snapshots live at [their own URL](public/workbench-earlier.html),
not in a hidden subtree of the current page. It does not connect
to agents, git hosts, invitation services, or a scheduler.

## Current direction: grid-first Project workspace

This revision supersedes the three-column layout and file terminology in the
historical journey below. The earlier examples are retained for comparison,
not silently presented as current requirements.

- Monitor recent Threads in a full-width card grid for **one selected Project**.
  Cross-Project monitoring is deferred. Keep Recent, Scheduled, Incomplete,
  Sleeping, search, member filters, unread indicators, and nested checklists.
- A Thread pane floats beside its selected card, choosing a side with enough
  room rather than always opening in one fixed position. Keep that card visible
  when space permits; other cards can be covered. Reposition on resize and grid
  scroll. On a narrow screen, details are a separate full-width screen, not
  an overlay with cards behind them.
- Clicking away within the canvas or Escape dismisses the pane; titlebar
  interactions do not count as clicking away. There is no Close button. Comment drafts,
  pending attachments, selected tabs, and per-tab scroll positions survive
  ordinary navigation. Local new-artifact drafts survive closing/reopening too;
  selecting another content tab or Cancel exits that editor.
- Project context has a distinct home: one bottom-center pane whose collapsed
  and expanded shapes share the same anchor. Hover opens it temporarily;
  click keeps it open. Opening Project context
  replaces the Thread pane, preserving the Thread's state. Empty Projects
  start with Project context expanded; Get Started exposes onboarding widgets.
  Get Started remains a labeled primary button until pressed. Before that,
  the Project has no visible Comments section or Comment composer.
- The Project description appears once. Hover or focus reveals an insertion-bar
  edit icon, and an inline editor saves changes in place.
- Folder-shaped tabs sit above the content container, with the first tab flush
  to its left edge. The first tab is the **subject icon and name**, followed by
  individual non-image Artifacts and one **Gallery** for all images.
  **More** appears only when those tabs exceed the available space. Its hover shows a searchable
  floating list of *all* Artifacts; clicking More puts the same list in the
  content area. Excess document tabs are accessible from More. Selecting an
  overflow document gives it a visible tab when there is room.
- A square **+ tab** at the far right offers Upload, Paste, and New document.
  The Add Artifacts drop/paste area remains below the Project controls. No additional
  Artifact sidebar opens automatically. New arrivals mark the collection
  without taking over the selected tab. Expand makes the file view fill the
  workspace; Restore returns to the floating pane. Both use a borderless icon.
  Folder outlines include the slanted edge; the square + joins the content border.
  The collapsed Project folder has a single bottom border.
  Tabs stay the same height when selected, overlap at their rounded slants,
  and place the active tab in front with white content and the pane's gray fill.
  The active tab opens directly into the content without a dividing line.
  Corners and slants use fixed pixel geometry across every tab width, with
  identical overlap spacing. Hover previews dismiss on pointer/focus exit.
- Promote on a Thread Artifact adds the same file object to Project Artifacts;
  it does not copy the file or remove the Thread reference. Its icon then becomes
  Demote, which removes only the Project reference. The same operation is available
  when viewing the shared Artifact from Project context.
- **Artifacts** are curated files directly attached to Projects or Threads.
  **Attachments** are files attached to Comments/messages, not another name
  for all files. Both user and agent Comments can show attachments. The
  composer supports a paperclip picker and pasted images/files; ordinary
  pasted text stays Comment text. Save as Artifact retains the original
  attachment on its Comment and adds it to the curated collection.
- Cards have a title/control row and a horizontally scrollable widget carousel,
  not separate descriptions, status rows, or footers. Checklists lead most cards;
  blocked work leads with a Question, completed work with directory diff totals
  and an illustrative PR link. Checklist rows stay single-line with a faded
  truncation. Widget ordering varies, and carousel controls appear on hover or
  keyboard focus only when multiple widgets exist. Controls attach just below
  the card: previous/next arrows flank clickable position dots, with the current
  dot white. Clicking the card's content opens its Thread; embedded controls
  retain their own actions.
- Artifact indicators are bounded, overlapping dots with no visible count:
  orange for new/unread, white for older/unread, gray for read. Each dot opens
  its individual Artifact and has a custom name/status hover description. Sleep appears on
  card hover/focus. Older Threads sit behind a wavy expand/collapse divider.
- The fixed-height titlebar has no background or bottom border. It reveals Project
  navigation and a horizontally scrollable, width-limited member strip, active first,
  the existing activity report, icon filters, and search on hover/focus. Its
  category multi-button is centered. Back/Workbench and Account/Settings plus
  its divider remain visible at rest. Search fills the available space from that
  button group to the divider before Account/Settings, with the magnifier at its
  inside right edge. At rest only the selected member, selected filter, and search
  magnifier remain alongside that persistent navigation. The revealed search
  input prompts "Search across <project name> Threads...".
  The member activity gutter stays visible. On touch, tapping the header reveals
  controls without changing the height reserved for it.
- New Thread is docked to the left canvas edge, aligned with the card grid's top.
  It is fully exposed without cards and partly tucked away when cards exist;
  hover or keyboard focus reveals it. It has a violet outline and +, with a faint
  violet background. The bold + moves from the exposed edge into the button's
  center as the button expands.
- Content surfaces retain the earlier neutral gray/black/white palette.
  Violet is restrained to selection and primary actions; Questions use orange.
  Accent backgrounds are weaker than outlines. Diffs use normal green/red.
  Labels, outlines, icons, and accessible descriptions supplement color.
- Every Question offers a freeform answer in addition to suggested choices.
- Comments and their composer follow Questions, before checklists and controls.
  Repository attachment, member invitation, file upload/promotion, and form
  submission/cancel actions use icons with custom hover/focus descriptions.
- Another-member view uses an orange avatar selection and gutter, plus an inset
  orange glow around the content area only, excluding the titlebar. Editing
  stays disabled and browsing does not mark the other member's Artifacts read.
- Widgets remain presentations and interactions (Questions, checklists,
  controls), not a reason to call every file an Attachment.
- The prototype holds files locally in memory, limits individual files to
  10 MB, renders text and images, and explicitly identifies file types without
  an inline viewer. Nothing is uploaded, sent to an agent, or saved to a server.
  Reload clears local changes. The historical root demo remains
  unchanged.

The eight independent snapshots show Top context with inline New Project,
an empty Project, onboarding Question plus repo/invite controls, the first
Thread alongside the Facilitator's original next-steps Comment, progressed
Thread detail, an editable new Thread card, and the twelve-card recent grid
with two older Threads behind its divider, then a read-only view of Mira's work.
Three visible mobile examples use
the same renderer and independent state, with animated swipe/tap navigation
between Project details, the Thread list, and Thread detail. Only the active
screen is displayed; no Project dock or list sits behind a mobile detail screen.
The Comment composer puts icon-only
Attach and Send buttons inside its border.

### Rendering budget

Examples initialize only as they approach the viewport, retaining their local
state once initialized. The earlier journey loads only on its separate page;
legacy hashes redirect there. The current page does not initialize legacy
gutters, timelines, or hidden snapshots. Full-pane CSS filters and the chapter
navigation's backdrop blur are removed. Resize callbacks are width-guarded.
Reduced-motion preferences apply to pane, edge-button, and mobile transitions.
Headless profiling found no recurring idle callback loop in the preceding
revision; its avoidable cost was eager construction of roughly 15,800 elements
(10,100 in the hidden legacy tree) and ten filtered panes. These changes reduce
initial construction to roughly 210 elements and one nearby example.
The embedded host's white-flash failure has not been independently reproduced;
this is a reduction of observed page workload, not proof of a host-level fix.

## 1. Confirmed vocabulary and information architecture

- Workbench contains any number of Projects.
- A Project has a name, an automatically derived URL slug, a description, an
  owner, human members, configuration, state, and any number of Threads,
  Artifacts, Comments, and Repos.
- A Thread is a unit or theme of work in a Project. It has a name, description,
  any number of Artifacts and Comments, and references any subset of its
  Project's Repos. "Task" and "work item" in earlier discussion mean Thread.
- A Thread is not a backlog item with a single Status. It independently has
  incomplete work or not, unread updates or not (per user), and a sleeping
  preference (per user). New requests make work incomplete; satisfying those
  requests clears that signal without closing the subject forever.
- Each Thread has an assigned user, initially the owner. **Only its assigned
  user can edit it.** The detail header shows their avatar and an assignment
  button; reassignment makes the former assignee's view read-only.
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

### Files and widgets

**Artifact:** a curated file connected directly to a Project or Thread, with a
file-type-specific presentation and full viewer and/or editor. Examples:
`plan.md`, `research.md`, and curated reference images.

**Attachment:** a file connected to a Comment or message, shown alongside that
session-log entry rather than in the curated Artifact collection. Ephemeral
here describes its role, not an automatic deletion policy.

**Dynamic:** a widget paired with internal data that can interface with the
Workbench SDK. Examples: agent questions, member invitations, repo controls,
agent-maintained todo lists, and output charts.

An agent can define, edit, and attach widgets through tools. The built-in
ask-user-question tool creates a Question Dynamic in the Center Panel.

A **ghost artifact** is an announced output, not a durable file. It shows a
dotted outline and progress indicator. It is not openable and must not appear
as an available file. It becomes a normal Artifact only when content exists.

### Comments and questions

Comments support Markdown, have a human or agent author, and can carry
Attachments added by paperclip picker or paste. Save as Artifact curates an
attachment without removing it from the original Comment.

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

## 2. Earlier three-column concept: context, navigation, and URLs

The following sections preserve the earlier design and its historical use of
"Attachment" for a directly connected file. Where the layout or terminology
differs, the current grid-first direction above takes precedence.

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
Back is a larger floating control overlapping the gutter, with the icon of
its Project/Thread destination, or a generic list icon when returning to Top.
On mobile, Back uses only a chevron, without a destination icon.

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

Left: a monochrome SVG workbench logo, also used as this document's favicon.
Right: the current user's colored avatar inside a gear for Account + Settings.
Top context contains nothing else. In Project, Thread, and Artifact contexts,
also show a Project selector with the current Project name, member avatars,
and an icon-only pin toggle, right-justified before a vertical divider and
the account avatar. The Project name has no enclosing input-like container;
its disclosure chevron immediately follows the name. Show the owner first,
a vertical separator, then the
other members and a **+** invitation control. The walkthrough uses You, Mira,
and Theo as illustrative titlebar members; it does not imply invitations
were sent during onboarding. Human activity indicators show presence, never
expose private channel contents. The current user is selected by default.

Every Project and Thread has a generated monochrome SVG icon before its name.
Hover or focus its icon to open a regeneration dialog, optionally supplying
guidance. A click keeps the dialog open for editing. The local walkthrough
generates deterministic SVG variations; it does not call an AI service.

The titlebar's compact, three-lane timeline shows the last 24 hours of
activity for the three most active members, using representative dominant
colors from their avatars. Hover/focus opens a vertical timeline; click pins
it until an outside click or Escape. It shows up to 15 members across the top,
time since increasing downward, and white activity bars. Hovering a bar shows
all the Threads/Project work in it. Selecting a user drills into lanes for
their Projects and Threads; selecting a work icon drills into that work with
members across the top. Drilldowns provide Back and time spans of 24 hours,
3 days, and 7 days in this example.

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
The Items background matches Center. Move the Threads heading and controls
to the top, next to Back, with search between the heading and controls.
Cards show the generated icon, title, one truncated description line, latest
widget, and a compact assignee / work indicator. Cards are the default because
dynamic progress and Impact content need space; old work need not occupy a
permanently compact list.

The tabs are **Recent**, **Scheduled**, **Incomplete**, and **Sleeping**.
Recent uses an illustrative 7-day cutoff, with an older-Threads disclosure.
Scheduled shows recurrence definitions. Incomplete is independent of unread
or recency. Sleeping shows the selected member's own sleeping Threads.
Sleep moves a Thread below that user's cutoff until the Thread is updated
or they wake it. Waking changes personal recency, not shared edit history.

Search matches names and descriptions across **all Threads in the Project**,
ignoring member, sleep, incomplete, schedule, and recency filters. Clearing
search restores the selected view. The selected avatar remains visible so
search does not accidentally change editing permissions.

### Member filtering and read-only views

Selecting a member shows Threads they created, were assigned, or edited,
excluding their own sleeping Threads in the non-Sleeping tabs. Hover/focus
on an unselected avatar shows a floating, scrollable recent list with exactly
the same membership and sleep rules as selecting them. It updates live.

Viewing as another member is **read-only**, not impersonation. Do not allow
sleeping/waking, pinning, assignment, icon regeneration, Thread or artifact
editing, comments, answers, invitations, or agent messages. Navigation,
search, read access, view tabs, timeline exploration, and panel resizing are
still available. Do not mark that member's updates read merely because the
viewer opened them. The selected top-gutter mark becomes orange; a subtle orange
glow is inset at the browser content edges and clipped inside the frame, not
cast outside the window. It is a soft edge treatment, without a solid border
or connector, and does not intercept gutter interactions. A persistent banner
explains the view. Selecting You restores normal assignment-based permissions.

Shared updates still change that view without interaction. The explainer has
explicit outside-the-UI demo event buttons for new shared work and satisfied
requests, including wake-on-update. These are illustrative incoming events,
not a way to edit through the read-only UI. Other members' private Agent
Channels are never exposed. The right gutter is empty and the Agent Channel
cannot open. Hovering, focusing, or clicking its trigger instead displays a
separate floating message: "You can only use agents when in your own view."
Returning to You restores the normal private channel.

### Element-aligned gutters

Gutters use actual panel-element positions, including the retained geometry
of collapsed panels, and update after scrolling, resizing, filtering, and
incoming changes. The top gutter remains visible with the Titlebar open.

| Panel / element | Gutter signal |
| --- | --- |
| Selected member | Violet for You; orange when viewing another member |
| Other member | White when active; dark gray when inactive |
| Unread Thread, no incomplete work | Green |
| Unread Thread, waiting / idle with incomplete work | Yellow |
| Read Thread, incomplete work | White / light gray |
| Read Thread, no incomplete work | Dark gray |
| Attachment changed since last opened | Green |
| Already-read Attachment | Dark gray |
| User channel message / answer | White / light gray |
| Agent channel message | Dark gray |

The brief defines the peer list for Attachments, but not for maximized
Dynamics; that Artifact-context case is still open.

### Center: Simple and Complex

Both modes contain an optional title and widget sections.

**Simple:** no section headers or common pin/reorder controls. The top widget
is vertically centered; subsequent widgets follow below it.

**Complex:** widgets have icon-only pin toggles; pinned widgets can be reordered. Widgets
with expanded presentations can be maximized into Artifact context. A plus
control adds pre-configured artifact widgets that are not already present.
Show collapsible headers only for nonempty sections.

| Context | Center content |
| --- | --- |
| Top, Simple | New Project widget; below it, existing Projects with descriptions and member avatars, owner first |
| Fresh Project, Simple | Project name/description; centered Get Started; Add Attachments; any Attachments |
| Active Project, Complex | Project name/description; Comments; Questions; Controls; Add Attachments; Project Attachments; Thread Attachments |
| Thread, Complex | Thread name/description; the same sections, scoped to the Thread |
| Artifact | Full artifact content |

A fresh Project means **no Threads and no messages in the viewing user's
Project Agent Channel**. Attachments alone do not exit Simple mode. The
per-user interpretation follows the clarified channel model; how shared
Comments from other members affect this condition is an open detail.

Todo Dynamics are shown under Controls in this walkthrough. Their definitive
section classification remains a design choice.

**Checklist trees** support nested subitems rather than a flat list alone.
Each row shows completion, in-progress, or not-started state; branches show
their immediate child count and an expand/collapse chevron. Indentation and
vertical guides preserve the hierarchy at deeper levels. Completion is
agent-maintained, not an editable checkbox in this study.

Rows can show additions/deletions and link to durable artifacts. Parent diff
counts sum their descendants' leaf changes once; expanding a branch does not
change those totals. Counts are omitted until changes exist. Artifact links
open the usual preview, with Expand and Back retaining their existing meaning.
Links to announced-but-unwritten files remain disabled. The completed example
rolls up implementation (+150 / -38) and verification (+36 / -4) to the same
+186 / -42 as its Impact widget.

Thread cards show a collapsed checklist summary and completed/top-level count.
Hover or keyboard-focus the summary for a floating tree; click to keep it open
until outside click or Escape. A separate chevron expands the tree inline
without opening the Thread. Branches can be expanded independently in either
presentation. Inline expansion survives list rerenders; gutters follow the
changed card heights. These are read-only inspection actions and remain
available when viewing another member. Mobile uses the same inline chevron
and tap-to-open preview, with touch-sized controls and wrapped rows.

**Thread Attachments** rolls up durable attachments from the Project's
Threads, newest update first. It follows Project Attachments. Older items
are behind a horizontal expand/collapse line (7 days is illustrative).
Each row identifies its owning Thread and includes a double-chevron,
military-rank-style **Promote to Project** icon. Promotion moves the file to
Project ownership and removes it from the Thread rollup / peer list.
The preview and expanded artifact then use the Project's channel. Ghosts
remain excluded. Opening an unpromoted item takes the viewer to its owning
Thread and its preview. Empty fresh Projects do not gain complex-mode headers.

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

## 4. Visual direction

Preserve On Deck's near-black foundation (`#090a0c`), layered dark surfaces
(`#0e1013`, `#13161a`, `#191c21`), low-contrast borders, muted supporting text,
rounded cards, restrained violet (`#a78bfa`) accents, small avatar groups, and
content-first controls. Keep agent conversation secondary to artifacts.

The introductory copy contrasts these ideas with the team's current
Workbench, not the largely unfamiliar On Deck wireframes.
Extend the visual concepts with a real Project hierarchy, a persistent Center,
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
   A separate Question asks how changes should be validated: tests + CI +
   review, tests + manual checks, an agent-proposed per-Thread strategy, no
   fixed validation, or freeform guidance. This has its own answer record.
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
21. Switch Items to Scheduled. Watch the three definitions and their
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
    card shows the same Impact label, counts, and hover instead of a planning
    spinner. "Complete" means no incomplete requests now, not a permanent
    Thread Status. Its
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
  followed by three thin gutter signals for **Items / Work / Preview**, with
  no visible labels or icons. These map to the
  three content columns, not a bottom panel or bottom gutter.
- Items maps to the left column. Select a Thread to open Work. Show member
  avatars here, with the owner separated from members and a + invite button.
- Work retains Comments, Questions, Controls, Add Attachments, and Attachments.
  Preview displays the selected Attachment. Agent opens the user's private
  conversation in a floating, dismissible overlay above the current screen.
  There is no Agent tab or pinning.
- The selected screen's gutter signal is violet. Work's signal is orange when
  a Question is pending and Work is not selected; other signals are unlit.
  Accessible names identify the screens and pending Question. The Agent
  button retains its activity indicator only in your own view.
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
- Gutter navigation uses full-third-width, 24px-high targets around 3px signals,
  keeping the entire switcher 28px high. Other controls retain at least 44px
  touch targets. Back is a chevron only, without a destination icon.
  File/photo pickers and pasted
  text replace reliance on drag-and-drop. A future explicit Mark region mode
  would distinguish annotation gestures from image scrolling/zooming; the
  current phone examples use a preselected region and expandable Comment.
- Three independent, interactive phone examples start on Items, Work, and
  Preview. Each supports screen switching, question answers recorded in Agent,
  shared Comment entry, draft preservation, and Artifact/peer navigation.
  The example Back-to-Project link returns to the desktop Project snapshot.

## 6. Walkthrough implementation and boundaries

- Deliver one long HTML page in `public/workbench-journey.html`,
  alongside this plan in the repository root. Its companion
  `workbench-concepts.js` and `.css` implement the richer concept controls,
  with dedicated logo and colored-avatar SVG assets; keep these files
  together when opening the document directly.
- Title the page **Projects, Threads, and Widgets**, with the subheader
  **Reimagining the Workbench UI format and Information Architecture**.
- Use 25 numbered before/after snapshots, organized into six journey chapters,
  followed by a seventh section with a dedicated mobile experience study.
  Each has a human action, visible result, and agent/system consequence.
- Follow the journey with an unnumbered Feature explainers section: a
  live membership/permissions/attachment shell, a vertical activity panel,
  an icon-regeneration dialog, a member Thread preview, and a gutter key.
  The floating-style explainer panels start open and remain interactive.
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
  Generated icon variations remain consistent throughout this document.
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

Icon controls have custom dark hover/focus descriptions, not native browser
title tooltips. Descriptions explain consequences (especially promotion,
personal sleep, pinning, and panel layout), reflect toggle state, and explain
disabled actions. Existing rich hover dialogs remain the explanation where
available, without a second tooltip covering them. Hints can be hovered,
are associated through `aria-describedby`, stay inside the viewport, and
dismiss on Escape, interaction, scrolling, or leaving the control and hint.

The long walkthrough animates spinners only while they intersect the visible
viewport, including clipping by scrollable panels. Hidden Agent Channels and
background tabs pause motion. Newly inserted spinners follow the same rule,
and the existing reduced-motion preference continues to suppress animations.

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
- Thread lists use all four requested tabs, a global search override, and
  the selected member's creation/assignment/edit and personal sleep rules.
- Another-member views are live and read-only, with an orange selected-member
  mark and subtle inset glow inside the browser content frame. Their empty agent gutter shows
  an own-view-only explanation instead of opening a channel; read markers
  are not changed on their behalf.
- Only the assignee can edit a Thread; assignment, promotion, icon generation,
  and pinning honor the read-only boundary.
- Project Thread Attachments are newest-first, exclude ghosts, have a stale
  disclosure, and can be promoted to Project ownership.
- Activity supports user and work drilldowns, span changes, and bar previews;
  gutters align to actual member, card, artifact, and message positions.
- Unpinned Titlebars hide on pointer exit, focus departure, outside click, and
  window blur; pinned and Top-level Titlebars remain visible.
