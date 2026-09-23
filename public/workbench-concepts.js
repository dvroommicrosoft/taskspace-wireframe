/* Local concept state only: no agents, accounts, or repository data are contacted. */
window.WorkbenchConcept = (() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const projectName = 'On Deck evolution';
  const users = [
    {id:'you',name:'You',color:'#648cdb'}, {id:'mira',name:'Mira Chen',color:'#496a6c'},
    {id:'theo',name:'Theo Grant',color:'#895e4f'}, {id:'inez',name:'Inez',color:'#947bb1'},
    ...['Ari','Bo','Cleo','Devi','Eli','Finn','Gia','Hugo','Isla','Jules','Kai'].map((name,i) => ({id:name.toLowerCase(),name,color:['#798fba','#9a8071','#709d8e'][i%3]}))
  ];
  const person = id => users.find(user => user.id === id);
  const avatar = id => ['you','mira','theo','inez'].includes(id)
    ? `<img class="avatar" src="${id === 'you' ? 'workbench-avatar-you' : `avatar-${id}`}.svg" alt="${person(id).name}">`
    : `<span class="avatar initials-avatar" style="background:${person(id).color}" aria-label="${person(id).name}">${person(id).name[0]}</span>`;
  const svg = body => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const pin = () => svg('<path d="M8 3h8l-1 7 3 3v2H6v-2l3-3-1-7Z"/><path d="M12 15v6"/>');
  const chevron = () => svg('<path d="m6 9 6 6 6-6"/>');
  const plus = () => svg('<path d="M12 5v14M5 12h14"/>');
  const gear = () => svg('<path d="m9 3 1-2h4l1 2 3 1 2 3-1 3 1 3-2 3-3 1-1 2h-4l-1-2-3-1-2-3 1-3-1-3 2-3Z" transform="translate(0 2)"/><circle cx="12" cy="12" r="5"/>');
  const listIcon = () => svg('<path d="M8 5h13M8 12h13M8 19h13"/><circle cx="3" cy="5" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="19" r="1"/>');
  const rank = () => svg('<path d="m5 12 7-6 7 6M5 18l7-6 7 6"/>');
  const sleepIcon = () => svg('<path d="M19 16A8 8 0 0 1 8 5a8 8 0 1 0 11 11Z"/>');
  const wakeIcon = () => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>');
  const documentIcon = () => svg('<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h4M9 12h6M9 16h6"/>');
  const checklistItems = [
    {label:'Analyze the current first-run flow, project context, and test setup',done:true},
    {label:'Design the first-run experience, dependencies, and validation strategy',active:true,file:'plan.md'},
    {label:'Implement the approved first-run experience',children:[
      {label:'Inline project creation',added:60,removed:12},
      {label:'Onboarding Questions',added:28,removed:6},
      {label:'Persistent shell navigation',children:[
        {label:'Keep Back visible when the titlebar hides',added:30,removed:8},
        {label:'Preserve panel state across navigation',added:14,removed:4}
      ]},
      {label:'Responsive styles',added:18,removed:8},
      {label:'Match the reference image',file:'button-study.png'}
    ]},
    {label:'Verify interactions, coverage, and the production build',children:[
      {label:'Project creation and onboarding tests',added:18,removed:2},
      {label:'Artifact preview and Back tests',added:8,removed:1},
      {label:'Keyboard and mobile navigation tests',added:10,removed:1},
      {label:'Review the production build'},
      {label:'Review the result with you'}
    ]}
  ];
  function checklistTotals(item) {
    return item.children ? item.children.reduce((total,child)=>{
      const diff=checklistTotals(child);
      return {added:total.added+diff.added,removed:total.removed+diff.removed};
    },{added:0,removed:0}) : {added:item.added || 0,removed:item.removed || 0};
  }
  function checklist({complete=false,ready=false,imageReady=true,expanded=false,documentName='plan.md'}={}) {
    const rows = items => `<ul class="checklist-tree">${items.map(item=>{
      const done=complete || item.done, active=!done && item.active;
      const diff=checklistTotals(item);
      const counts=complete && (diff.added || diff.removed) ? `<span class="checklist-diff" aria-label="${diff.added} additions, ${diff.removed} deletions"><span class="diff-add">+${diff.added}</span><span class="diff-remove">−${diff.removed}</span></span>` : '';
      const status=`<span class="checklist-status ${done ? 'done' : active ? 'active' : ''}" role="img" aria-label="${done ? 'Complete' : active ? 'In progress' : 'Not started'}">${done ? '✓' : active ? '<span class="spinner" aria-hidden="true"></span>' : '○'}</span>`;
      const content=`${status}<span class="checklist-label">${escape(item.label)}</span>${item.children ? `<span class="checklist-child-count" aria-label="${item.children.length} subitems">${item.children.length}</span><span class="checklist-chevron" aria-hidden="true">›</span>` : ''}${counts}`;
      const available=item.file==='plan.md' ? ready : imageReady;
      const name=item.file==='plan.md' ? documentName : item.file;
      const link=item.file ? `<button class="checklist-artifact" data-checklist-file="${escape(name)}" aria-label="${available ? 'Preview' : 'Not yet available:'} ${escape(name)}" title="${escape(available ? name : `${name} · not yet created`)}"${available ? '' : ' disabled'}>${documentIcon()}<span>${escape(name)}</span></button>` : '';
      return `<li>${item.children ? `<details class="checklist-branch"${expanded ? ' open' : ''}><summary class="checklist-row">${content}</summary>${rows(item.children)}</details>` : `<div class="checklist-row">${content}${link}</div>`}</li>`;
    }).join('')}</ul>`;
    return rows(checklistItems);
  }
  function checklistCard(thread,state) {
    const complete=!thread.incomplete;
    const ready=complete || !!state.feature;
    const open=state.expandedChecklists?.has(thread.id);
    return `<div class="card-checklist" data-checklist-thread="${thread.id}" data-checklist-complete="${complete}" data-checklist-ready="${ready}" data-checklist-image-ready="${!state.step || state.step>=14}">
      <div class="card-checklist-head"><button class="checklist-peek" data-checklist-peek aria-haspopup="dialog" aria-expanded="false" aria-label="Preview checklist for ${escape(thread.name)}">Checklist <span>${complete ? '4 / 4' : '1 / 4'}</span></button><button class="checklist-expand" data-checklist-toggle aria-expanded="${!!open}" aria-label="${open ? 'Collapse' : 'Expand'} checklist for ${escape(thread.name)}">${chevron()}</button></div>
      ${complete ? impactTrigger() : '<span class="checklist-caption">Planning in progress</span>'}
      <div class="card-checklist-body"${open ? '' : ' hidden'}>${checklist({complete,ready,imageReady:!state.step || state.step>=14})}</div></div>`;
  }
  const iconSeeds = new Map();
  const defaultIcons = new Map();
  const usedIcons = new Set();
  const hash = text => [...text].reduce((value,c) => (value*31+c.charCodeAt(0))>>>0,17);
  function glyph(name) {
    const seed = hash(name + (iconSeeds.get(name) || ''));
    const bodies = [
      '<path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
      '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M4 10h16M10 10v10"/>',
      '<circle cx="12" cy="12" r="8"/><path d="m8 15 3-7 5 5-8 2Z"/>',
      '<path d="M4 17 9 5l4 9 3-6 4 9ZM4 21h16"/>',
      '<path d="M4 7h6v6H4zM14 3h6v6h-6zM14 15h6v6h-6zM10 10h3m0-4v12h1"/>',
      '<path d="m12 3 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 5 8-5M12 12v9"/>',
      '<path d="M5 4h14v12l-7 5-7-5Z"/><path d="m9 10 2 2 4-5"/>'
    ];
    let variant=seed%28;
    if (!iconSeeds.has(name)) {
      if (!defaultIcons.has(name)) {
        while (usedIcons.size<28 && usedIcons.has(variant)) variant=(variant+1)%28;
        defaultIcons.set(name,variant);usedIcons.add(variant);
      }
      variant=defaultIcons.get(name);
    }
    return `<svg class="entity-glyph" data-entity="${escape(name)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g transform="rotate(${Math.floor(variant/7)*90} 12 12)">${bodies[variant%bodies.length]}</g></svg>`;
  }
  const icon = name => `<button type="button" class="entity-icon" data-icon-name="${escape(name)}" aria-haspopup="dialog" aria-label="Regenerate icon for ${escape(name)}">${glyph(name)}</button>`;
  const now = Date.now();
  const hour = 3600000;
  const recentHours = 168;
  let clock = now;
  const definitions = [
    {id:'design',name:'Design the first-run experience',description:'Make project setup feel like beginning the work.',creator:'you',assignee:'you',editors:['mira'],hours:1,incomplete:true,unread:false,latest:'Planning checklist · 1 of 4',target:12},
    {id:'research',name:'Research table foundations',description:'Explore an open-source foundation for Items.',creator:'you',assignee:'you',editors:['mira'],hours:2,incomplete:true,unread:true,latest:'Question · Compare two approaches',target:19},
    {id:'shipped',name:'Ship the first-run improvements',description:'Review the effect of a quieter beginning.',creator:'you',assignee:'you',editors:['theo'],hours:3,incomplete:false,unread:true,latest:'Impact',target:25},
    {id:'polish',name:'Polish empty states',description:'Keep the interface calm when there is nothing to show.',creator:'mira',assignee:'you',editors:['you'],hours:8,incomplete:false,unread:false,latest:'All requests addressed',target:25},
    {id:'access',name:'Audit keyboard accessibility',description:'Check focus order, menu access, and visible focus.',creator:'mira',assignee:'mira',editors:['theo'],hours:4,incomplete:true,unread:true,latest:'Waiting · Review focus order',target:12},
    {id:'offline',name:'Explore offline support',description:'Keep recent context available without a connection.',creator:'you',assignee:'you',editors:['mira'],hours:10,incomplete:true,unread:false,latest:'Ideas collected · sleeping for you',sleeping:['you'],target:19},
    {id:'older',name:'Prototype command palette',description:'Research quick navigation and fuzzy search.',creator:'mira',assignee:'mira',editors:['you'],hours:360,incomplete:false,unread:false,latest:'Prototype documented',target:19},
    {id:'tests',name:'Maintain & prune tests',description:'Keep the suite useful, focused, and fast.',creator:'you',assignee:'you',editors:[],hours:5,incomplete:false,unread:false,latest:'Mon · 09:00',schedule:true,target:21},
    {id:'ux',name:'Explore the project UX',description:'Walk key journeys and flag rough edges.',creator:'you',assignee:'you',editors:['mira'],hours:6,incomplete:false,unread:false,latest:'Wed · 09:00',schedule:true,target:21},
    {id:'dead',name:'Find dead code',description:'Identify unused paths and propose removals.',creator:'you',assignee:'you',editors:['theo'],hours:7,incomplete:false,unread:false,latest:'Fri · 09:00',schedule:true,target:21}
  ];
  const states = new WeakMap();
  const timelineStates = new WeakMap();
  const disabledBefore = new WeakMap();
  const floats = new Map();
  let serial = 0;
  const workName = id => id === 'project' ? projectName : definitions.find(t => t.id === id)?.name || projectName;
  const events = users.flatMap((user,i) => Array.from({length:i<3 ? 8-i : 3},(_,j) => ({
    id:`${user.id}-${j}`,user:user.id,ago:j === 0 ? i*.35 : 1+i*.8+j*4,
    duration:.5+(i+j)%4*.4,works:[['design','research','project','access','polish'][(i+j)%5],...(j%3 === 0 ? ['research'] : [])]
  })));
  function matchesMember(thread,user) { return thread.creator === user || thread.assignee === user || thread.editors.includes(user); }
  function sleeping(thread,user) { return thread.slept[user] !== undefined && thread.updated <= thread.slept[user]; }
  const recency = (thread,user) => Math.max(thread.updated,thread.woken[user] || 0);
  function recentFor(state,user) { return state.threads.filter(t => matchesMember(t,user) && !sleeping(t,user) && clock-recency(t,user) <= recentHours*hour).sort((a,b)=>recency(b,user)-recency(a,user)); }
  function visibleThreads(state) {
    const search = state.query.trim().toLowerCase();
    if (search) return state.threads.filter(t => `${t.name} ${t.description}`.toLowerCase().includes(search)).sort((a,b)=>b.updated-a.updated);
    return state.threads.filter(t => {
      if (!matchesMember(t,state.user)) return false;
      if (state.tab === 'Sleeping') return sleeping(t,state.user);
      if (sleeping(t,state.user)) return false;
      if (state.tab === 'Scheduled') return t.schedule;
      if (state.tab === 'Incomplete') return t.incomplete;
      return state.showOlder || clock-recency(t,state.user) <= recentHours*hour;
    }).sort((a,b)=>recency(b,state.user)-recency(a,state.user));
  }
  function threadColor(thread,user) {
    const unread = thread.read[user] < thread.updated;
    return unread ? (thread.incomplete ? 'yellow' : 'green') : (thread.incomplete ? 'white' : 'gray');
  }
  function threadCard(thread,state,{preview=false}={}) {
    const asleep = sleeping(thread,state.user);
    const unread = thread.read[state.user] < thread.updated;
    return `<article class="thread-card concept-thread ${thread.id === state.selected ? 'selected' : ''}" data-thread-id="${thread.id}" data-unread="${unread}" data-updated="${thread.updated}" data-signal="${threadColor(thread,state.user)}">
      <div class="thread-heading">${preview ? glyph(thread.name) : icon(thread.name)}<button class="thread-name" data-open-thread="${thread.id}">${escape(thread.name)}</button>${unread ? '<span class="unread-dot" aria-label="Unread"></span>' : ''}
      ${!preview ? `<button class="icon sleep-thread" data-sleep-thread="${thread.id}" aria-label="${asleep ? 'Wake' : 'Sleep'} ${escape(thread.name)}" title="${asleep ? 'Wake' : 'Sleep until updated'}"${state.user !== 'you' ? ' disabled' : ''}>${asleep ? wakeIcon() : sleepIcon()}</button>` : ''}</div>
      <div class="description">${escape(thread.description)}</div><div class="latest-widget">${!preview && (thread.id==='design' || thread.id==='shipped') ? checklistCard(thread,state) : !thread.incomplete && (thread.id === 'shipped' || thread.latest.startsWith('Impact')) ? impactTrigger() : `<span class="work-indicator ${thread.incomplete ? 'incomplete' : ''}"></span><span>${escape(thread.latest)}</span>`}</div>
      <div class="thread-meta">${avatar(thread.assignee)}<span>${thread.incomplete ? 'Incomplete work' : 'No incomplete work'}${asleep ? ' · Sleeping' : ''}</span></div></article>`;
  }
  function renderThreads(app) {
    const state = states.get(app);
    const list = $('.thread-results',app);
    if (!list) return;
    const threads = visibleThreads(state);
    list.innerHTML = threads.map(t => threadCard(t,state)).join('') || '<p class="notice">No matching Threads.</p>';
    $$('.thread-tabs button',app).forEach(button => { button.setAttribute('aria-selected',String(button.dataset.threadTab === state.tab)); button.classList.toggle('selected',button.dataset.threadTab === state.tab); });
    $('.thread-filter-note',app).textContent = state.query.trim() ? 'Searching every Thread · all people, dates and states' : `${person(state.user).name} · ${state.tab === 'Recent' ? 'updated in 7 days' : state.tab.toLowerCase()}${state.user !== 'you' ? ' · read-only' : ''}`;
    const older = $('.older-threads',app);
    older.hidden = !!state.query.trim() || state.tab !== 'Recent';
    older.textContent = state.showOlder ? 'Hide older Threads' : 'Show older Threads';
    older.setAttribute('aria-expanded',String(state.showOlder));
    updateAccess(app);
    queueGutters(app);
    refreshMemberPeeks(app);
  }
  function setUser(app,user) {
    const state = states.get(app);
    state.user = user;
    state.query = '';
    state.tab = 'Recent';
    state.showOlder = false;
    $('.thread-search',app) && ($('.thread-search',app).value = '');
    app.classList.toggle('viewing-other',user !== 'you');
    app.classList.remove('channel-open');
    const mobileAgent=$('.mobile-agent',app);
    if (mobileAgent) mobileAgent.hidden=true;
    $$('.member-filter',app).forEach(button => button.setAttribute('aria-pressed',String(button.dataset.user === user)));
    renderThreads(app);
    updateAccess(app);
    closeFloats();
    queueGutters(app);
  }
  function editingAllowed(app) {
    const state = states.get(app);
    if (!state) return true;
    if (state.user !== 'you') return false;
    const thread = state.threads.find(t => t.id === app.dataset.threadId);
    return app.dataset.scope !== 'Thread' || !thread || thread.assignee === 'you';
  }
  const editActions = new Set(['pin-top','pin-widget','move-widget','answer','archive-comment','remove-repo','invite','invite-members','add-widget','focus-description']);
  function isEditControl(node) {
    return node.matches('[data-icon-name],[data-assignment],[data-promote],[data-sleep-thread],.item-add,[data-edit-control],[data-mobile-answer]') ||
      editActions.has(node.dataset.action) || (node.matches('input,textarea,button[type="submit"]') && !node.matches('.thread-search'));
  }
  function updateAccess(app) {
    const state = states.get(app);
    if (!state) return;
    const allowed = editingAllowed(app);
    app.classList.toggle('read-only',!allowed);
    let banner = $('.view-mode-banner',app);
    if (!banner) { banner = document.createElement('div'); banner.className='view-mode-banner'; ($('.center',app) || $('[data-pane="work"]',app)).prepend(banner); }
    const thread = state.threads.find(t=>t.id===app.dataset.threadId);
    banner.textContent = state.user !== 'you' ? `Viewing as ${person(state.user).name} · read-only · live shared updates` : !allowed ? `Assigned to ${person(thread.assignee).name} · only the assigned user can edit` : '';
    banner.hidden = allowed;
    $$('button,input,textarea,a',app).filter(isEditControl).forEach(node => {
      const personal = node.matches('[data-sleep-thread]');
      const blocked = personal ? state.user !== 'you' : !allowed;
      if (blocked && !disabledBefore.has(node)) disabledBefore.set(node,{disabled:node.disabled,tabindex:node.getAttribute('tabindex')});
      if (blocked) {
        node.setAttribute('aria-disabled','true');
        if ('disabled' in node) node.disabled = true;
        else node.tabIndex = -1;
      } else if (disabledBefore.has(node)) {
        const before = disabledBefore.get(node);
        if ('disabled' in node) node.disabled = before.disabled;
        if (before.tabindex === null) node.removeAttribute('tabindex'); else node.setAttribute('tabindex',before.tabindex);
        node.removeAttribute('aria-disabled');
        disabledBefore.delete(node);
      }
    });
    const agentTrigger=$('.right-edge',app) || $('.mobile-agent-trigger',app);
    if (agentTrigger) {
      agentTrigger.setAttribute('aria-label',state.user==='you' ? `Reveal your private ${app.dataset.scope} Agent Channel` : 'Agents are only available in your own view');
      const indicator=$('.diff-add',agentTrigger);
      if (indicator) indicator.hidden=state.user!=='you';
      if (state.user!=='you') {
        app.classList.remove('channel-open');
        if (agentTrigger.matches('.right-edge')) agentTrigger.replaceChildren();
        const mobileAgent=$('.mobile-agent',app);
        if (mobileAgent) mobileAgent.hidden=true;
        agentTrigger.setAttribute('aria-expanded','false');
      }
    }
    const edgeNote=$('.edge-note',app);
    if (edgeNote && state.user!=='you') {
      state.privateEdgeNote ??= edgeNote.innerHTML;
      edgeNote.textContent=`Viewing as ${person(state.user).name} · shared activity only`;
    } else if (edgeNote && state.privateEdgeNote!==undefined) {
      edgeNote.innerHTML=state.privateEdgeNote;
      delete state.privateEdgeNote;
    }
    const assignment = $('[data-assignment]',app);
    if (assignment && thread) {
      assignment.innerHTML = `${avatar(thread.assignee)}<span>Assigned to ${person(thread.assignee).name}</span><span aria-hidden="true">⌄</span>`;
      assignment.setAttribute('aria-label',`Assign Thread; currently ${person(thread.assignee).name}`);
    }
  }
  function mutateThread(app,id,change) {
    const state = states.get(app);
    const thread = state.threads.find(t=>t.id===id);
    Object.assign(thread,change,{updated:++clock});
    renderThreads(app);
    renderAttachments(app);
  }
  function openThread(app,id) {
    const state = states.get(app);
    const thread = state.threads.find(t=>t.id===id);
    if (!thread) return;
    if (app.classList.contains('phone')) {
      state.selected=id;app.dataset.threadId=id;if (state.user==='you') thread.read.you=thread.updated;
      $('[data-pane="work"] h4',app).innerHTML=`${glyph(thread.name)}${escape(thread.name)}`;
      $('[data-pane="work"]>p',app).textContent=thread.description;
      $('.mobile-agent .channel-message',app).innerHTML=`<strong>Thread agent</strong>Working on ${escape(thread.name)}. Shared progress and decisions appear on Work.`;
      renderThreads(app);showMobileView(app,'work');return;
    }
    if (artifactStates.has(app)) restoreArtifactOwner(app);
    closeArtifactPreview(app);
    if (!state.projectCenter && app.dataset.scope === 'Project') state.projectCenter = $('.center',app);
    const center = document.createElement('div'); center.className='center';
    const ghost = !state.feature && state.step<25;
    const documentName=thread.id==='research'?'research.md':'plan.md';
    const imageReady=['design','shipped'].includes(thread.id) && !state.promoted.has('button-study.png');
    const attachments=(imageReady ? file('button-study.png',{image:true}) : '')+(!state.promoted.has(documentName) ? file(documentName,{ghost,detail:'<strong>A repeatable plan.</strong>Tests, review, and a small set of manual checks validate the implementation.'}) : '');
    center.innerHTML = `${title(thread.name,thread.description,`Thread · ${projectName}`)}<button class="assignment-control" data-assignment></button>${comments('')}${section('Controls',thread.incomplete ? todo({ready:!ghost,imageReady,documentName}) : impact()+todo({complete:true,ready:true,imageReady,documentName}))}${section('Attachments',attachments)}`;
    $('.center',app).replaceWith(center);
    app.dataset.scope='Thread'; app.dataset.threadId=id; state.selected=id;
    if (state.user==='you') thread.read.you=thread.updated;
    $('.route',app.closest('.screen')).textContent=`workbench.local/on-deck-evolution/threads/${id}`;
    const back = $('.back',app); back.dataset.action='concept-back'; back.innerHTML=`‹${glyph(projectName)}`; back.setAttribute('aria-label','Back to Project');
    $('.channel .private-label',app).textContent='◉ Only you · Thread channel · floating';
    $('.channel-head>span',app).textContent='Thread agent';
    renderThreads(app);
    syncPanelButtons(app);
    center.tabIndex=-1; center.focus({preventScroll:true});
  }
  const attachmentFixtures = [
    {name:'button-study.png',thread:'design',age:.5,text:'Thread reference image.',image:true},
    {name:'plan.md',thread:'design',age:1,text:'<strong>First-run implementation plan.</strong>Validate with tests, CI, and review before merging.'},
    {name:'research.md',thread:'research',age:3,text:'<strong>Table foundations.</strong>Compare accessible, headless table primitives and card-based navigation.'},
    {name:'keyboard-audit.md',thread:'access',age:240,text:'<strong>Keyboard audit.</strong>Focus order and visible focus across the shell.'}
  ];
  function renderAttachments(app) {
    const state = states.get(app);
    if (!state || app.dataset.scope !== 'Project' || app.classList.contains('home')) return;
    const available = attachmentFixtures.filter(file => state.threads.some(t=>t.id===file.thread) && !state.promoted.has(file.name) && (state.feature || state.step>=25 || file.image && state.step>=14)).sort((a,b)=>a.age-b.age);
    if (!available.length && app.classList.contains('simple')) return;
    let sectionNode = $('.thread-attachments',app);
    if (!sectionNode) {
      sectionNode = document.createElement('details'); sectionNode.className='section thread-attachments'; sectionNode.open=true;
      $('.center',app).append(sectionNode);
    }
    const rows = files => files.map(item=>`<article class="widget thread-attachment" data-name="${item.name}" data-thread-owner="${item.thread}"><div class="widget-head"><button data-thread-file="${item.name}" class="attachment-title">${item.name}</button><button class="icon promote" data-promote="${item.name}" aria-label="Promote ${item.name} to Project Attachments" title="Promote to Project">${rank()}</button></div><div class="attachment-origin">${glyph(workName(item.thread))}<span>${workName(item.thread)} · updated ${item.age < 24 ? `${item.age}h` : `${Math.round(item.age/24)}d`} ago</span></div></article>`).join('');
    sectionNode.innerHTML=`<summary>Thread Attachments<span class="count">${available.length}</span></summary><div class="section-body">${rows(available.filter(f=>f.age<=recentHours)) || '<p class="notice">No recent Thread Attachments yet.</p>'}<details class="stale-attachments"><summary><span>Older Thread Attachments · ${available.filter(f=>f.age>recentHours).length}</span></summary>${rows(available.filter(f=>f.age>recentHours))}</details></div>`;
    updateAccess(app);
  }
  function promote(app,name) {
    const state = states.get(app);
    const item = attachmentFixtures.find(f=>f.name===name);
    if (state.promoted.has(name)) return;
    let projectSection = $$('.center>.section',app).find(section=>$('summary',section)?.textContent.startsWith('Project Attachments'));
    if (!projectSection) {
      $('.thread-attachments',app).insertAdjacentHTML('beforebegin',section('Project Attachments','<p class="notice empty-project-files">No Project Attachments yet.</p>'));
      projectSection = $('.thread-attachments',app).previousElementSibling;
    }
    $('.empty-project-files',projectSection)?.remove();
    $('.section-body',projectSection).insertAdjacentHTML('afterbegin',file(item.name,{detail:item.text,image:item.image}));
    projectSection.open=true;
    state.promoted.add(name);
    renderAttachments(app);
    notify(app,`${name} promoted to Project Attachments.`);
  }
  function notify(app,text) {
    const status=$('.concept-feedback',app); if (status) status.textContent=text;
  }
  function positionFloat(panel,trigger) {
    const rect=trigger.getBoundingClientRect(), width=panel.offsetWidth, height=panel.offsetHeight;
    panel.style.left=`${Math.max(12,Math.min(rect.left,innerWidth-width-12))}px`;
    panel.style.top=`${Math.max(12,rect.bottom+height+8<innerHeight-12 ? rect.bottom+8 : rect.top-height-8)}px`;
  }
  function closeFloat(kind) {
    const record=floats.get(kind); if (!record) return;
    clearTimeout(record.timer);
    record.trigger.removeEventListener('pointerleave',record.schedule);
    record.trigger.removeEventListener('blur',record.schedule);
    record.trigger.setAttribute('aria-expanded','false');
    record.panel.hidePopover(); record.panel.remove(); floats.delete(kind);
    if (record.app && ![...floats.values()].some(r=>r.app===record.app)) {
      delete record.app.dataset.headerFloating;
      const header=$('.titlebar',record.app);
      const focused=header?.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
      if (focused) record.app.classList.add('top-open');
      else if (!header?.matches(':hover')) record.app.classList.remove('top-open');
    }
    [...floats.values()].filter(parent=>parent.panel.contains(record.trigger)).forEach(parent=>parent.schedule());
  }
  function closeFloats() { [...floats.keys()].forEach(closeFloat); }
  function floating(trigger,kind,markup,{pinned=false,label=kind}={}) {
    const current=floats.get(kind);
    if (current?.trigger===trigger) { if (pinned) current.pinned=true; clearTimeout(current.timer); return current.panel; }
    closeFloat(kind);
    const panel=document.createElement('div');
    panel.className=`concept-float ${kind}-float`; panel.setAttribute('popover','manual'); panel.setAttribute('role','dialog'); panel.setAttribute('aria-label',label);
    panel.innerHTML=markup; document.body.append(panel); panel.showPopover(); positionFloat(panel,trigger);
    trigger.setAttribute('aria-expanded','true');
    const app=trigger.closest('.app,.phone');
    const record={panel,trigger,pinned,app,timer:null}; floats.set(kind,record);
    if (trigger.closest('.titlebar')) { app.dataset.headerFloating='true'; app.classList.add('top-open'); }
    panel.addEventListener('pointerenter',()=>clearTimeout(record.timer));
    const schedule=()=> { clearTimeout(record.timer); record.timer=setTimeout(()=>{ if (!record.pinned && !panel.matches(':hover') && !trigger.matches(':hover,:focus-visible') && !panel.contains(document.activeElement) && ![...floats.values()].some(r=>r.trigger!==trigger && panel.contains(r.trigger))) closeFloat(kind); },220); };
    record.schedule=schedule;
    panel.addEventListener('pointerleave',schedule);
    panel.addEventListener('focusout',schedule);
    trigger.addEventListener('pointerleave',schedule);
    trigger.addEventListener('blur',schedule);
    return panel;
  }
  const iconForm = name => `<div class="float-heading">${glyph(name)}<strong>${escape(name)}</strong></div><p>Generate a new monochrome icon.</p><form class="regenerate-icon" data-name="${escape(name)}"><label>Optional guidance<input name="guidance" placeholder="e.g. a doorway, simple lines" maxlength="120"></label><button class="primary" type="submit">Regenerate SVG</button><p class="icon-feedback" role="status">Local generated variations · no AI service contacted.</p></form>`;
  function memberMarkup(app,user) {
    const state=states.get(app);
    const mirror={...state,user,selected:null};
    return `<div class="float-heading">${avatar(user)}<strong>${person(user).name}'s recent Threads</strong></div><p>Created, assigned, or edited · excluding their sleeping Threads · last 7 days</p><div class="member-thread-scroll" data-member-preview="${user}">${recentFor(state,user).map(t=>threadCard(t,mirror,{preview:true})).join('') || '<p class="notice">No recently updated Threads.</p>'}</div><button class="secondary" data-view-member="${user}" data-source-app="${app.id}">View as ${person(user).name} · read-only</button>`;
  }
  function refreshMemberPeeks(app) {
    const peek=floats.get('member');
    if (peek?.app===app) peek.panel.innerHTML=memberMarkup(app,peek.trigger.dataset.user);
    if (app.classList.contains('feature-app')) $('#member-explainer').innerHTML=`<div class="shown-float" data-source-app="${app.id}">${memberMarkup(app,'mira')}</div>`;
  }
  function timelineMarkup(state) {
    const relevant=events.filter(event=>event.ago<state.span && (state.view==='user' ? event.user===state.subject : state.view==='work' ? event.works.includes(state.subject) : true));
    const lanes=state.view==='user' ? [...new Set(relevant.flatMap(e=>e.works))].map(id=>({id,name:workName(id),work:true})) : users.slice(0,15);
    const title=state.view==='user' ? `${person(state.subject).name}'s activity` : state.view==='work' ? workName(state.subject) : 'Project activity';
    return `<div class="timeline-toolbar">${state.history.length ? '<button class="icon" data-timeline-back aria-label="Back in activity">‹</button>' : ''}<strong>${escape(title)}</strong><label>Time span<select class="timeline-span"><option value="24"${state.span===24?' selected':''}>24 hours</option><option value="72"${state.span===72?' selected':''}>3 days</option><option value="168"${state.span===168?' selected':''}>7 days</option></select></label></div><p class="timeline-caption">${state.view==='user' ? 'Work across Projects and Threads' : 'Users across the top · time since increases downward'} · white bars are activity</p>
      <div class="timeline-scroll"><div class="vertical-timeline" style="--lanes:${lanes.length}"><div class="time-axis"><span>Now</span><span>${state.span/4}h</span><span>${state.span/2}h</span><span>${state.span*3/4}h</span><span>${state.span}h ago</span></div>${lanes.map(lane=>{
        const activity=relevant.filter(event=>lane.work ? event.works.includes(lane.id) : event.user===lane.id);
        return `<div class="activity-lane"><button class="lane-head" ${lane.work ? `data-timeline-work="${lane.id}"` : `data-timeline-user="${lane.id}"`} aria-label="${escape(lane.name)}" title="${escape(lane.name)}">${lane.work ? glyph(lane.name) : avatar(lane.id)}</button><div class="lane-track">${activity.map(event=>`<button class="activity-bar" data-event="${event.id}" style="top:${event.ago/state.span*100}%;height:${Math.max(1.5,Math.min(event.duration,state.span-event.ago)/state.span*100)}%" aria-label="${person(event.user).name}, ${event.ago.toFixed(1)} hours ago; ${event.works.map(workName).join(', ')}"></button>`).join('')}</div></div>`;
      }).join('')}</div></div>`;
  }
  function renderTimeline(panel) { panel.innerHTML=timelineMarkup(timelineStates.get(panel)); }
  function makeTimeline(panel) {
    panel.classList.add('timeline-panel'); panel.id ||= `timeline-${++serial}`;
    timelineStates.set(panel,{view:'users',subject:null,span:24,history:[]}); renderTimeline(panel);
  }
  function timelineSummary() {
    const top=users.map(user=>({...user,total:events.filter(e=>e.user===user.id && e.ago<24).reduce((n,e)=>n+e.duration,0)})).sort((a,b)=>b.total-a.total).slice(0,3);
    return `<span class="mini-gantt" aria-hidden="true">${top.map(user=>`<span class="gantt-row">${events.filter(e=>e.user===user.id && e.ago<24).map(event=>`<i style="left:${Math.max(0,(24-event.ago-event.duration)/24*100)}%;width:${event.duration/24*100}%;background:${user.color}"></i>`).join('')}</span>`).join('')}</span><span class="timeline-summary-label">24h</span>`;
  }
  function openActivity(trigger,pinned=false) {
    const panel=floating(trigger,'timeline','',{pinned,label:'Project activity timeline'});
    if (!timelineStates.has(panel)) { makeTimeline(panel); positionFloat(panel,trigger); }
  }
  function drill(panel,view,subject) {
    const state=timelineStates.get(panel);
    state.history.push({view:state.view,subject:state.subject});
    state.view=view; state.subject=subject; renderTimeline(panel); closeFloat('activity-work');
  }
  const pendingGutters = new WeakSet();
  function queueGutters(app) {
    if (pendingGutters.has(app)) return;
    pendingGutters.add(app);
    requestAnimationFrame(()=>{ pendingGutters.delete(app); syncGutters(app); });
  }
  function syncGutters(app) {
    const state=states.get(app); if (!state) return;
    const rect=app.getBoundingClientRect();
    const top=$('.top-edge',app);
    if (top) {
      const members=$$('.titlebar .member-filter',app);
      top.innerHTML=members.map(button=>{
        const bounds=button.getBoundingClientRect(), user=button.dataset.user;
        const color=user===state.user ? (user==='you' ? 'green' : 'yellow') : (user==='you'||user==='mira' ? 'white' : 'gray');
        return `<span class="gutter-segment ${color}" data-user="${user}" style="left:${bounds.left-rect.left}px;width:${bounds.width}px"></span>`;
      }).join('');
    }
    const segments = (edge,elements,color) => {
      if (!edge) return;
      const bounds=$('.items',app).getBoundingClientRect();
      edge.innerHTML=elements.map(element=>{
        const box=element.getBoundingClientRect();
        const start=Math.max(box.top-rect.top,edge.classList.contains('left-edge') ? Math.max(bounds.top-rect.top,0) : 0);
        const end=Math.min(box.bottom-rect.top,app.clientHeight-28);
        if (end<=start || box.height===0) return '';
        return `<span class="gutter-segment ${color(element)}" data-for="${escape(element.dataset.threadId || element.dataset.file || element.textContent.slice(0,30))}" style="top:${start}px;height:${end-start}px"></span>`;
      }).join('');
    };
    const peers=app.classList.contains('artifact-expanded') ? $$('.artifact-peers [data-file]',app) : app.classList.contains('artifact') ? $$('.items .thread-card',app) : $$('.thread-results .concept-thread',app);
    segments($('.left-edge',app),peers,el=>el.dataset.signal || (state.filesRead[state.user].has(el.dataset.file || 'button-study.png') ? 'gray' : 'green'));
    segments($('.right-edge',app),state.user==='you' ? $$('.channel .channel-message,.channel>details,.channel-records details',app) : [],el=>el.classList.contains('user-message') || el.matches('details') ? 'white' : 'gray');
  }
  function initializeApp(app,index) {
    app.id ||= `concept-app-${index}`;
    const step=Number(app.closest('.step')?.id.replace('step-',''));
    const feature=app.classList.contains('feature-app');
    let ids=feature ? definitions.map(t=>t.id) : [...(step>=11 || !step && !app.classList.contains('simple') ? ['design'] : []),...(step>=17 || !step ? ['research'] : []),...(step>=21 ? ['tests','ux','dead'] : [])];
    if (app.classList.contains('home')) ids=[];
    const threads=definitions.filter(t=>ids.includes(t.id)).map(t=>({...t,editors:[...t.editors],updated:now-t.hours*hour,woken:{},slept:Object.fromEntries((t.sleeping||[]).map(u=>[u,now])),read:Object.fromEntries(users.map(u=>[u.id,t.unread ? 0 : now]))}));
    if (step===25) Object.assign(threads.find(t=>t.id==='design'),{incomplete:false,latest:'Impact · +186 / −42',target:25});
    if (step===17) Object.assign(threads.find(t=>t.id==='research'),{name:'Untitled Thread',description:'Add a description to begin.',latest:'Waiting for your description'});
    const state={user:'you',tab:step===21?'Scheduled':'Recent',threads,query:'',showOlder:false,selected:app.dataset.scope==='Thread' ? step>=17&&step<=19 ? 'research':'design':null,promoted:new Set(),projectCenter:null,feature,step,filesRead:Object.fromEntries(users.map(user=>[user.id,new Set(app.classList.contains('artifact') ? ['button-study.png'] : [])]))};
    states.set(app,state);
    if (state.selected) app.dataset.threadId=state.selected;
    const items=$('.items',app);
    if ($('.tabs',items)) {
      const controls=$('.item-controls',items).outerHTML;
      items.innerHTML=`<div class="items-head"><strong>Threads</strong><input type="search" class="thread-search" placeholder="Search" aria-label="Search all Threads and descriptions">${controls}</div><div class="thread-tabs" role="tablist" aria-label="Thread views">${['Recent','Scheduled','Incomplete','Sleeping'].map(tab=>`<button role="tab" data-thread-tab="${tab}">${tab}</button>`).join('')}</div><p class="thread-filter-note"></p><div class="thread-results"></div><button class="older-threads"></button>`;
    }
    $$('.project-members',app).forEach(group=> {
      group.innerHTML=`${['you','mira','theo'].map((id,i)=>`${i===1?'<span class="owner-divider" role="separator" aria-label="Owner and members"></span>':''}<button class="member-filter" data-user="${id}" aria-pressed="${id==='you'}" aria-label="View ${person(id).name}'s Threads">${avatar(id)}</button>`).join('')}<button class="member-invite" data-action="invite-members" aria-label="Invite project members">${plus()}</button>`;
    });
    const summary=$('.activity-summary',app); if (summary) summary.innerHTML=timelineSummary();
    const back=$('.back',app);
    if (back) back.innerHTML=`‹${app.classList.contains('artifact') ? glyph(workName('design')) : app.dataset.scope==='Thread' ? glyph(projectName) : listIcon()}`;
    const heading=$('.context-title',app);
    if (heading && !$('h4 .entity-glyph',heading)) {
      const name=$('h4',heading).textContent;
      $('h4',heading).innerHTML=`${icon(name)}<span class="entity-name">${escape(name)}</span>`;
    }
    if (app.dataset.scope==='Thread' && heading) heading.insertAdjacentHTML('afterend','<button class="assignment-control" data-assignment></button>');
    if (app.dataset.scope==='Project' && !app.classList.contains('home')) {
      $$('.center>.section>summary',app).filter(el=>el.firstChild.textContent==='Attachments').forEach(el=>{el.firstChild.textContent='Project Attachments';});
      renderAttachments(app);
    }
    $$('.project-row h5',app).forEach(el=>el.insertAdjacentHTML('afterbegin',icon(el.textContent)));
    const channel=$('.channel',app);
    if (channel && $('.channel-message',channel)) channel.insertAdjacentHTML('afterbegin','<div class="channel-message user-message"><strong>You</strong>Use the shared context and move this work forward. Ask for decisions when needed.</div>');
    const feedback=document.createElement('span'); feedback.className='concept-feedback'; feedback.setAttribute('role','status'); app.append(feedback);
    $$('.tree-widget .checklist',app).forEach(node=>{
      node.innerHTML=checklist({ready:!!$('.attachment-widget[data-name="plan.md"]',app),imageReady:!!$('.attachment-widget[data-name="button-study.png"]',app)});
    });
    app.addEventListener('workbench-layout',()=>{
      const opened=app.classList.contains('artifact-expanded') ? $('.artifact-peers [aria-pressed="true"]',app)?.dataset.file : $('.artifact-preview',app)?.dataset.file;
      if (opened && state.user==='you') state.filesRead.you.add(opened);
      updateAccess(app);queueGutters(app);
    });
    app.addEventListener('scroll',()=>queueGutters(app),true);
    const resize=new ResizeObserver(()=>queueGutters(app));
    [app,items,$('.titlebar',app),$('.project-choice',app),channel].filter(Boolean).forEach(element=>resize.observe(element));
    new MutationObserver(()=>queueGutters(app)).observe(items,{childList:true,subtree:true});
    if (channel) new MutationObserver(()=>queueGutters(app)).observe(channel,{childList:true,subtree:true});
    renderThreads(app); updateAccess(app); queueGutters(app);
    if (feature) {
      $('[data-action="pin-top"]',app).setAttribute('aria-pressed','true');
      $('[data-action="pin-top"]',app).setAttribute('aria-label','Unpin Titlebar');
    }
  }
  function initializePhone(phone,index) {
    phone.id=`concept-phone-${index}`;phone.dataset.scope='Thread';phone.dataset.threadId='design';
    const threads=definitions.filter(t=>['design','research','access','offline'].includes(t.id)).map(t=>({...t,editors:[...t.editors],updated:now-t.hours*hour,woken:{},slept:Object.fromEntries((t.sleeping||[]).map(u=>[u,now])),read:Object.fromEntries(users.map(u=>[u.id,t.unread?0:now]))}));
    states.set(phone,{user:'you',tab:'Recent',threads,query:'',showOlder:false,selected:'design',promoted:new Set()});
    $('.mobile-thread-list',phone).innerHTML=`<h4>Threads</h4><input class="thread-search" type="search" aria-label="Search all Threads and descriptions" placeholder="Search all Threads"><div class="thread-tabs" role="tablist" aria-label="Thread views">${['Recent','Scheduled','Incomplete','Sleeping'].map(tab=>`<button role="tab" data-thread-tab="${tab}">${tab}</button>`).join('')}</div><p class="thread-filter-note"></p><div class="thread-results"></div><a class="secondary phone-action item-add" href="#step-17">+ New Thread</a><button class="older-threads">Show older Threads</button>`;
    $('.project-members',phone).innerHTML=users.slice(0,3).map((user,i)=>`${i===1?'<span class="owner-divider" role="separator" aria-label="Owner and members"></span>':''}<button class="member-filter" data-user="${user.id}" aria-label="View ${user.name}'s Threads" aria-pressed="${user.id==='you'}">${avatar(user.id)}</button>`).join('')+`<button class="member-invite" data-action="invite-members" aria-label="Invite project members">${plus()}</button>`;
    $('.mobile-presence+small',phone).textContent='Select a member · other-member views are read-only';
    $('.phone-header strong',phone).insertAdjacentHTML('afterbegin',icon(projectName));
    $('[data-pane="work"] h4',phone).insertAdjacentHTML('afterbegin',glyph(workName('design')));
    $$('.phone-nav button',phone).forEach(button=>{
      [...button.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).forEach(node=>node.remove());
      const marker=$('.mobile-unread',button);
      if (marker) {marker.textContent='';marker.setAttribute('aria-hidden','true');}
    });
    updateMobileNav(phone);
    $('.tree-widget .checklist',phone).innerHTML=checklist();
    $('[data-pane="work"] h4',phone).insertAdjacentHTML('afterend','<button class="assignment-control" data-assignment></button>');
    renderThreads(phone);
  }
  function updateMobileNav(phone) {
    $$('.phone-nav button',phone).forEach(button=>{
      const waiting=button.dataset.mobileView==='work' && !!$('.mobile-question',phone);
      const label={items:'Items',work:phone.dataset.artifact==='true' ? 'Artifact' : 'Work',preview:'Preview'}[button.dataset.mobileView];
      const hint=waiting ? `${label} · question awaiting your answer` : label;
      button.setAttribute('aria-label',hint);
      button.title=hint;
    });
  }
  function initializeMotion() {
    const tracked = new Set();
    const observer = new IntersectionObserver(entries=>{
      for (const entry of entries) entry.target.classList.toggle('motion-visible',entry.isIntersecting);
    });
    const track = root => {
      const spinners=[...(root.matches('.spinner') ? [root] : []),...$$('.spinner',root)];
      for (const spinner of spinners) {
        if (tracked.has(spinner)) continue;
        tracked.add(spinner);
        observer.observe(spinner);
      }
    };
    track(document.body);
    new MutationObserver(records=>{
      for (const record of records) for (const node of record.addedNodes) {
        if (node instanceof Element && node.isConnected) track(node);
      }
      for (const spinner of tracked) if (!spinner.isConnected) {
        observer.unobserve(spinner);
        tracked.delete(spinner);
      }
    }).observe(document.body,{childList:true,subtree:true});
    const syncVisibility=()=>document.documentElement.classList.toggle('page-hidden',document.hidden);
    document.addEventListener('visibilitychange',syncVisibility);
    syncVisibility();
  }
  function initializeTooltips() {
    const tooltip=document.createElement('div');
    tooltip.id='control-tooltip';
    tooltip.className='control-tooltip';
    tooltip.setAttribute('role','tooltip');
    tooltip.setAttribute('popover','manual');
    document.body.append(tooltip);
    let active=null, pending=null, timer;
    const selector='button[aria-label],a[aria-label],summary[aria-label],[data-tooltip]';
    const migrateTitles = root => {
      for (const node of [...(root.hasAttribute('title') ? [root] : []),...$$('[title]',root)]) {
        node.dataset.tooltip=node.getAttribute('title');
        node.removeAttribute('title');
      }
    };
    migrateTitles(document.body);
    const hide = () => {
      clearTimeout(timer);
      tooltip.hidePopover();
      if (active) {
        const ids=(active.getAttribute('aria-describedby') || '').split(/\s+/).filter(id=>id && id!==tooltip.id);
        if (ids.length) active.setAttribute('aria-describedby',ids.join(' ')); else active.removeAttribute('aria-describedby');
      }
      active=null;
      pending=null;
    };
    const detail = node => {
      if (node.getAttribute('aria-disabled')==='true') return 'Read-only view. Switch to your own view; only the assigned user can edit a Thread.';
      if (node.matches('[data-promote]')) return 'Move this attachment from its Thread to the Project so it becomes shared project-level context.';
      if (node.matches('[data-sleep-thread]')) return node.getAttribute('aria-label').startsWith('Wake') ? 'Bring this Thread back into your Recent view.' : 'Hide from your Recent view until it receives an update or you wake it. Only your view changes.';
      if (node.matches('[data-action="pin-top"]')) return node.getAttribute('aria-pressed')==='true' ? 'Let the titlebar hide when you leave it.' : 'Keep the titlebar visible instead of automatically hiding it.';
      if (node.matches('[data-action="pin-widget"]')) return node.getAttribute('aria-pressed')==='true' ? 'Return this widget to its normal position in the section.' : 'Keep this widget first in its section; pinned widgets can be reordered.';
      if (node.matches('[data-action="move-widget"]')) return node.disabled ? 'Pin this widget first to change its order.' : 'Move this pinned widget one position up in its section.';
      if (node.matches('[data-action="table"]')) return 'Switch the Thread list between cards and compact table rows.';
      if (node.matches('[data-action="maximize-items"]')) return node.getAttribute('aria-pressed')==='true' ? 'Restore the normal Items and Work split.' : 'Give more space to the Items list without leaving this context.';
      if (node.matches('[data-action="toggle-items"]')) return node.getAttribute('aria-expanded')==='true' ? 'Hide Items and give its space to the work. Hover the left edge to peek.' : 'Keep Items open beside the work.';
      if (node.matches('[data-checklist-toggle]')) return 'Expand or collapse this checklist inside the Thread card without opening the Thread.';
      if (node.matches('[data-timeline-user]')) return 'Show this person’s activity in separate lanes for each Project or Thread.';
      if (node.matches('.lane-head[data-timeline-work]')) return 'Show activity for this work, with a lane for each person.';
      if (node.matches('[data-checklist-file]')) return node.disabled ? 'This artifact has been announced but has not been created yet.' : 'Open Artifact preview without losing your place in the work.';
      return node.dataset.tooltip && node.dataset.tooltip!==node.getAttribute('aria-label') ? node.dataset.tooltip : '';
    };
    const show = node => {
      if (!node.isConnected || node.matches('[data-impact-trigger],.checklist-peek,.gw-card-checklist>summary') || [...floats.values()].some(record=>record.trigger===node)) return;
      const bounds=node.getBoundingClientRect();
      if (!bounds.width || !bounds.height || bounds.bottom<=0 || bounds.top>=innerHeight || bounds.right<=0 || bounds.left>=innerWidth) return;
      const label=node.getAttribute('aria-label') || node.dataset.tooltip;
      if (!label) return;
      active=node;
      tooltip.replaceChildren();
      const heading=document.createElement('strong');heading.textContent=label;tooltip.append(heading);
      const description=detail(node);
      if (description) {const text=document.createElement('span');text.textContent=description;tooltip.append(text);}
      node.setAttribute('aria-describedby',[...(node.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean),tooltip.id].join(' '));
      tooltip.showPopover();positionFloat(tooltip,node);
    };
    const schedule = (node,delay) => {hide();pending=node;timer=setTimeout(()=>{pending=null;show(node);},delay);};
    const leave = () => {
      if (pending===document.activeElement) return;
      clearTimeout(timer);
      timer=setTimeout(()=>{if (!tooltip.matches(':hover') && !active?.matches(':hover,:focus-visible')) hide();},120);
    };
    document.addEventListener('pointerover',event=>{
      if (event.pointerType==='touch') return;
      const node=event.target.closest(selector);
      if (node && !node.contains(event.relatedTarget)) schedule(node,350);
    });
    document.addEventListener('pointerout',event=>{
      const node=event.target.closest(selector);
      if (node && !node.contains(event.relatedTarget)) leave();
    });
    document.addEventListener('focusin',event=>{
      const node=event.target.closest(selector);
      if (node) schedule(node,120);
    });
    document.addEventListener('focusout',leave);
    tooltip.addEventListener('pointerenter',()=>clearTimeout(timer));
    tooltip.addEventListener('pointerleave',leave);
    document.addEventListener('pointerdown',hide,true);
    document.addEventListener('keydown',event=>{if(event.key==='Escape') hide();});
    document.addEventListener('scroll',()=>{if(active) hide();},true);
    window.addEventListener('resize',hide);
    document.addEventListener('visibilitychange',()=>{if(document.hidden) hide();});
    new MutationObserver(records=>{
      for (const record of records) {
        if (record.type==='attributes' && record.target.hasAttribute('title')) migrateTitles(record.target);
        for (const node of record.addedNodes) if (node instanceof Element) migrateTitles(node);
      }
      if (active && !active.isConnected) hide();
    }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});
  }
  function initialize() {
    $('.nav .wrap').insertAdjacentHTML('beforeend','<a href="#features">Feature explainers</a>');
    attachmentFixtures.filter(item=>!item.image).forEach(item=>{expandedContents[item.name]=item.text;});
    $$('.app').forEach(initializeApp);
    $$('.phone').forEach(initializePhone);
    $('#step-8 .question').insertAdjacentHTML('afterend',question('How should changes be validated?',['Tests + CI + review','Tests + manual checks','Agent proposes per Thread','No fixed validation'],true));
    $('#step-8 .step-heading h3').textContent='Agree on completion and validation.';
    $('#step-8 .step-heading p').textContent='The repository is connected. Separate Questions establish what counts as complete and how changes should be validated. Each answer is recorded in your private channel.';
    $('#step-8 .section .count') && ($('#step-8 .section .count').textContent='2');
    for (const step of [9,10,11]) $('.channel-records',$(`#step-${step}`)).insertAdjacentHTML('beforeend','<details><summary>✓ Validation · Tests + CI + review</summary><p>Example onboarding choice, independent of the completion policy.</p></details>');
    $('#step-21 .step-heading p').textContent='Switch Items to Scheduled. The weekly maintenance Threads appear with their schedule widgets.';
    $('#step-21 .tag').textContent='Project / Scheduled';
    $('#step-21 .notes>div').innerHTML='<b>Human / visible result</b>Try Recent / Scheduled / Incomplete / Sleeping, and search across all Threads regardless of the current view.';
    $('#step-25 .step-heading p').textContent='The first-run requests have been satisfied and the PR is merged. The Thread has no incomplete work right now; another request can make it incomplete again. Impact shows what changed.';
    $('#step-25 .center>.impact-badge').textContent='No incomplete work';
    $('#step-25 .center>.section:last-child .section-body').insertAdjacentHTML('beforeend',todo({complete:true,ready:true,imageReady:true}));
    $('#step-25 .center').insertAdjacentHTML('beforeend',section('Attachments',file('plan.md',{detail:expandedContents['plan.md']})+file('button-study.png',{image:true})));
    $('#checklist-explainer').dataset.sourceApp=$('#feature-example .app').id;
    $('#checklist-explainer').dataset.checklistThread='design';
    $('#checklist-explainer').innerHTML=`<div class="shown-float"><strong>Completed checklist · 4 / 4 · +186 / −42</strong><p>Illustrative first-run changes, matching the completed Thread's Impact. Branches are expanded here to show the hierarchy.</p>${checklist({complete:true,ready:true,expanded:true})}</div>`;
    const timeline=document.createElement('div'); timeline.className='shown-float'; $('#timeline-explainer').append(timeline); makeTimeline(timeline);
    $('#icon-explainer').innerHTML=`<div class="shown-float">${iconForm(projectName)}</div>`;
    refreshMemberPeeks($('#feature-example .app'));
    $('#feature-example').insertAdjacentHTML('afterend','<div class="demo-controls"><button data-demo-update>Simulate a shared update</button><button data-demo-complete>Simulate requests satisfied</button><span>Demo events, outside the UI: shared updates keep read-only views live.</span></div>');
    bindInteractions();
    initializeMotion();
    initializeTooltips();
  }
  function bindInteractions() {
    let restoringFocus=false;
    const dismissOutside = target => {
      if (target.closest('.concept-float')) return;
      for (const [kind,record] of floats) if (!record.trigger.contains(target)) closeFloat(kind);
    };
    const appFor = node => node.closest('.app,.phone') || document.getElementById(node.closest('[data-source-app]')?.dataset.sourceApp || '') || [...floats.values()].find(r=>r.panel.contains(node))?.app;
    document.addEventListener('click',event=>{
      const node=event.target.closest('button,a,summary');
      const app=node && appFor(node);
      if (app && states.get(app)?.user!=='you' && node.matches('.right-edge,.mobile-agent-trigger')) {
        event.preventDefault();event.stopImmediatePropagation();showAgentUnavailable(node,true);return;
      }
      if (app && isEditControl(node) && (node.matches('[data-sleep-thread]') ? states.get(app).user!=='you' : !editingAllowed(app))) {
        event.preventDefault(); event.stopImmediatePropagation(); notify(app,'Read-only view. Only the assigned user can edit a Thread.');
      }
    },true);
    document.addEventListener('submit',event=>{
      const app=appFor(event.target);
      if (app && !editingAllowed(app)) {event.preventDefault();event.stopImmediatePropagation();notify(app,'This view is read-only.');}
    },true);
    document.addEventListener('pointerdown',event=>{
      const app=event.target.closest('.app,.phone');
      if (app && event.target.closest('.image-canvas') && !event.target.closest('button') && !editingAllowed(app)) {event.preventDefault();event.stopImmediatePropagation();}
      dismissOutside(event.target);
    },true);
    document.addEventListener('keydown',event=>{
      if (event.key==='Escape') {
        const trigger=[...floats.values()].find(record=>!record.trigger.closest('.concept-float'))?.trigger;
        closeFloats();
        if (trigger?.isConnected && !trigger.disabled) {
          if (trigger.closest('.titlebar')) trigger.closest('.app').classList.add('top-open');
          restoringFocus=true;trigger.focus({preventScroll:true});restoringFocus=false;
        }
      }
    });
    document.addEventListener('pointerover',event=>{
      if (event.pointerType==='touch') return;
      const trigger=event.target.closest('.entity-icon,.member-filter,.activity-summary,.activity-bar,.right-edge,.mobile-agent-trigger,.checklist-peek');
      if (!trigger || trigger.contains(event.relatedTarget)) return;
      showTrigger(trigger);
    });
    document.addEventListener('focusin',event=>{
      if (restoringFocus) return;
      const trigger=event.target.closest('.entity-icon,.member-filter,.activity-summary,.activity-bar,.right-edge,.mobile-agent-trigger,.checklist-peek');
      if (trigger) showTrigger(trigger);
    });
    function showTrigger(trigger) {
      const app=appFor(trigger);
      if (trigger.matches('.checklist-peek')) showChecklist(trigger);
      if (trigger.matches('.right-edge,.mobile-agent-trigger') && states.get(app)?.user!=='you') showAgentUnavailable(trigger);
      if (trigger.matches('.entity-icon')) {
        if (app && !editingAllowed(app)) return;
        floating(trigger,'icon',iconForm(trigger.dataset.iconName),{label:'Regenerate monochrome icon'});
      }
      if (trigger.matches('.member-filter') && states.get(app)?.user!==trigger.dataset.user) floating(trigger,'member',memberMarkup(app,trigger.dataset.user),{label:`${person(trigger.dataset.user).name}'s recent Threads`});
      if (trigger.matches('.activity-summary')) openActivity(trigger);
      if (trigger.matches('.activity-bar')) {
        const event=events.find(e=>e.id===trigger.dataset.event), panel=trigger.closest('.timeline-panel');
        floating(trigger,'activity-work',`<strong>${person(event.user).name} · ${event.ago.toFixed(1)}h ago</strong><p>All work in this activity bar</p><div class="bar-work-list">${[...new Set(event.works)].map(id=>`<button data-timeline-work="${id}" data-timeline-owner="${panel.id}">${glyph(workName(id))}${escape(workName(id))}</button>`).join('')}</div>`,{label:'Threads in this activity'});
      }
    }
    function showChecklist(trigger,pinned=false) {
      const card=trigger.closest('.card-checklist');
      const app=appFor(trigger);
      const complete=card.dataset.checklistComplete==='true';
      const panel=floating(trigger,'checklist',`<strong>${complete ? 'Completed' : 'Planning'} checklist · ${complete ? '4 / 4' : '1 / 4'}</strong><p>Expand a row to inspect its subitems. Diff counts roll up from the leaves; file links open Artifact preview.</p>${checklist({complete,ready:card.dataset.checklistReady==='true',imageReady:card.dataset.checklistImageReady==='true'})}`,{pinned,label:'Thread checklist'});
      panel.dataset.checklistThread=card.dataset.checklistThread;
      panel.dataset.sourceApp=app.id;
    }
    function showAgentUnavailable(trigger,pinned=false) {
      const panel=floating(trigger,'agent-unavailable','<strong>Agents unavailable</strong><p>You can only use agents when in your own view.</p>',{pinned,label:'Agents are only available in your own view'});
      if (trigger.matches('.right-edge')) {
        const bounds=trigger.getBoundingClientRect();
        panel.style.left=`${Math.max(12,Math.min(bounds.left-panel.offsetWidth-8,innerWidth-panel.offsetWidth-12))}px`;
        panel.style.top=`${Math.max(12,Math.min(bounds.top+48,innerHeight-panel.offsetHeight-12))}px`;
      }
    }
    document.addEventListener('click',event=>{
      dismissOutside(event.target);
      const button=event.target.closest('button,a');
      if (!button) return;
      const app=appFor(button), state=app && states.get(app);
      if (button.matches('[data-checklist-peek]')) showChecklist(button,true);
      if (button.matches('[data-checklist-toggle]')) {
        const card=button.closest('.card-checklist'),body=$('.card-checklist-body',card);
        body.hidden=!body.hidden;
        button.setAttribute('aria-expanded',String(!body.hidden));
        button.setAttribute('aria-label',`${body.hidden ? 'Expand' : 'Collapse'} checklist for ${workName(card.dataset.checklistThread)}`);
        state.expandedChecklists ??= new Set();
        if (body.hidden) state.expandedChecklists.delete(card.dataset.checklistThread); else state.expandedChecklists.add(card.dataset.checklistThread);
        closeFloat('checklist');queueGutters(app);
      }
      if (button.matches('[data-checklist-file]')) {
        const name=button.dataset.checklistFile;
        const thread=button.closest('[data-checklist-thread]')?.dataset.checklistThread;
        closeFloat('checklist');
        if (app.classList.contains('phone')) {
          if (thread) openThread(app,thread);
          showMobileView(app,'preview');
        } else {
          if (state.promoted.has(name)) {
            if (app.dataset.scope==='Thread') $('.back',app).click();
          } else if (thread && app.dataset.threadId!==thread) openThread(app,thread);
          openArtifactPreview(app,name);
        }
      }
      if (button.matches('.member-filter')) setUser(app,button.dataset.user);
      if (button.matches('[data-view-member]')) setUser(document.getElementById(button.dataset.sourceApp),button.dataset.viewMember);
      if (button.matches('[data-thread-tab]')) {state.tab=button.dataset.threadTab;state.query='';$('.thread-search',app).value='';renderThreads(app);}
      if (button.matches('.older-threads')) {state.showOlder=!state.showOlder;renderThreads(app);}
      if (button.matches('[data-sleep-thread]') && state.user==='you') {
        const thread=state.threads.find(t=>t.id===button.dataset.sleepThread);
        if (sleeping(thread,'you')) {delete thread.slept.you;thread.woken.you=++clock;} else thread.slept.you=++clock;
        renderThreads(app);
      }
      if (button.matches('[data-open-thread]')) {
        event.preventDefault();
        const member=button.closest('[data-member-preview]')?.dataset.memberPreview;
        if (member) setUser(app,member);
        openThread(app,button.dataset.openThread);
      }
      if (button.matches('[data-action="concept-back"]')) {
        event.preventDefault();
        if (artifactStates.has(app)) restoreArtifactOwner(app);
        closeArtifactPreview(app);
        const center=state.projectCenter || document.createElement('div');
        if (!state.projectCenter) {center.className='center';center.innerHTML=`${title()}${comments('')}${section('Project Attachments',initialFiles(false))}`;}
        $('.center',app).replaceWith(center); state.projectCenter=null; app.dataset.scope='Project'; delete app.dataset.threadId;state.selected=null;
        button.removeAttribute('data-action');button.href='#step-1';button.innerHTML=`‹${listIcon()}`;button.setAttribute('aria-label','Back to Top');
        $('.route',app.closest('.screen')).textContent='workbench.local/on-deck-evolution';
        renderThreads(app);renderAttachments(app);syncPanelButtons(app);
      }
      if (button.matches('[data-assignment]') && editingAllowed(app)) floating(button,'assignment',`<strong>Assign this Thread</strong><p>Only the assigned user can edit. Assigning to someone else makes your view read-only.</p>${users.slice(0,3).map(user=>`<button class="assignment-option" data-assign-to="${user.id}" data-source-app="${app.id}">${avatar(user.id)}${user.name}</button>`).join('')}`,{pinned:true,label:'Assign Thread'});
      if (button.matches('[data-assign-to]') && editingAllowed(app)) {mutateThread(app,app.dataset.threadId,{assignee:button.dataset.assignTo});closeFloats();}
      if (button.matches('[data-promote]') && editingAllowed(app)) promote(app,button.dataset.promote);
      if (button.matches('[data-thread-file]')) {
        const item=attachmentFixtures.find(f=>f.name===button.dataset.threadFile);
        openThread(app,item.thread);openArtifactPreview(app,item.name);
      }
      if (button.matches('.entity-icon')) {
        if (app && !editingAllowed(app)) return;
        floating(button,'icon',iconForm(button.dataset.iconName),{pinned:true,label:'Regenerate monochrome icon'});
      }
      if (button.matches('.project-select')) floating(button,'projects',`<strong>Projects</strong><button class="project-option" data-current-project>${glyph(projectName)}${projectName}</button><p>Other Projects are outside this independent snapshot.</p>`,{pinned:true,label:'Project selector'});
      if (button.matches('[data-current-project]')) closeFloats();
      if (button.matches('.activity-summary')) openActivity(button,true);
      const panel=button.dataset.timelineOwner ? document.getElementById(button.dataset.timelineOwner) : button.closest('.timeline-panel');
      if (button.matches('[data-timeline-user]')) drill(panel,'user',button.dataset.timelineUser);
      if (button.matches('[data-timeline-work]')) drill(panel,'work',button.dataset.timelineWork);
      if (button.matches('[data-timeline-back]')) {const s=timelineStates.get(panel);Object.assign(s,s.history.pop());renderTimeline(panel);}
      if (button.matches('[data-demo-update],[data-demo-complete]')) {
        const example=$('#feature-example .app'), s=states.get(example);
        const target=s.user==='you' ? 'offline' : 'access';
        const complete=button.hasAttribute('data-demo-complete');
        mutateThread(example,target,{incomplete:!complete,latest:complete ? 'All requests satisfied · no incomplete work' : 'New shared update · review requested'});
        $('.demo-controls span').textContent=`Incoming update to ${workName(target)}. The list, sleep cutoff, and gutter updated live.`;
      }
    });
    document.addEventListener('input',event=>{
      if (!event.target.matches('.thread-search')) return;
      const app=event.target.closest('.app,.phone');states.get(app).query=event.target.value;renderThreads(app);
    });
    document.addEventListener('change',event=>{
      if (!event.target.matches('.timeline-span')) return;
      const panel=event.target.closest('.timeline-panel');timelineStates.get(panel).span=Number(event.target.value);renderTimeline(panel);
    });
    document.addEventListener('submit',event=>{
      if (event.target.matches('.regenerate-icon')) {
        event.preventDefault();
        const form=event.target,name=form.dataset.name,guidance=form.elements.guidance.value;
        iconSeeds.set(name,`${guidance}:${++serial}`);
        $$('svg[data-entity]').filter(el=>el.dataset.entity===name).forEach(el=>{el.outerHTML=glyph(name);});
        $('.icon-feedback',form).textContent=guidance ? `New SVG generated with guidance: ${guidance}` : 'New monochrome SVG generated.';
      }
      if (event.target.matches('.local-comment')) {
        const app=event.target.closest('.app');
        if (app.dataset.threadId) mutateThread(app,app.dataset.threadId,{incomplete:true,latest:'New request · agent working'});
      }
    });
    document.addEventListener('scroll',event=>{
      for (const [kind,record] of floats) if (!record.pinned && !record.panel.contains(event.target)) closeFloat(kind);
    },true);
    document.addEventListener('toggle',event=>{
      if (!event.target.matches('.checklist-branch')) return;
      const app=appFor(event.target);
      if (app) queueGutters(app);
      const panel=event.target.closest('.checklist-float');
      const record=floats.get('checklist');
      if (panel && record) positionFloat(panel,record.trigger);
    },true);
    window.addEventListener('resize',()=>{closeFloats();$$('.app').forEach(queueGutters);});
  }
  document.addEventListener('DOMContentLoaded',initialize);
  return {icon,glyph,pin,gear,chevron,updateMobileNav,checklist};
})();
