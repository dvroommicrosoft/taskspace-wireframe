/* In-memory UI study. Local files never leave this browser tab. */
document.addEventListener('DOMContentLoaded', () => {
  const moments=[
    ['top','01','A place to begin.','Create a Project inline without losing the list of existing Projects. Account and Settings stays at the far right.'],
    ['empty','02','Project intent, before Threads.','The new Project opens from its bottom anchor. Add context, then Get Started. Collapse it to see the same pane fold back to its home.'],
    ['setup','03','Questions and controls arrive in the work.','The familiar Question, repository, and invitation widgets live inside Project context. Artifacts can be dropped or pasted below the controls.'],
    ['first','04','The first Thread starts moving.','The Facilitator has completed onboarding. The first card appears while Project context remains open.'],
    ['thread','05','Open the work already in progress.','A Thread opens beside its card. Review its checklist, Comments, and curated Artifacts without an extra side panel.'],
    ['new','06','Start another subject.','The new card is editable immediately. Save its description to start a Thread; existing work continues alongside it.'],
    ['full','07','A grid that grows with the Project.','Steer agents directly from the card view: scroll within a carousel slide to add instructions or attach context below its widget, without opening the Thread. The same Comment and draft appear in Thread details. Scroll the grid to the wavy divider to reveal older Threads.'],
    ['member','08','See the work through a teammate’s view.','Mira is selected. Orange marks her avatar and the edges of the content, while the titlebar stays neutral. Browse her Threads and Artifacts read-only; your private agents remain available only in your own view.']
  ];
  document.querySelector('#grid-journey').innerHTML=moments.map(([mode,n,title,copy])=>`<article class="gw-moment" id="grid-${mode}"><header class="gw-moment-heading"><span>${n}</span><div><h3>${title}</h3><p>${copy}</p></div></header><div class="grid-workbench" data-grid-mode="${mode}" id="${mode==='full'?'grid-workbench':`workspace-${mode}`}"></div></article>`).join('');
  document.querySelector('#grid-mobile-examples').innerHTML=[['first','Project context'],['thread','Thread detail'],['full','Browse the work']].map(([mode,name],i)=>`<article class="mobile-study"><h3>${i+1} / ${name}</h3><div class="grid-workbench gw-phone" data-grid-mode="${mode}" id="workspace-mobile-${i}"></div></article>`).join('');
  function initializeWorkspace(root) {
  root.dataset.initialized='true';
  const $ = (selector, scope = root) => scope.querySelector(selector);
  const all = (selector, scope = root) => [...scope.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => WorkbenchConcept.glyph(name);
  const svg = body => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const clip = svg('<path d="m8 13 7-7a3 3 0 0 1 4 4l-9 9a5 5 0 0 1-7-7L13 2"/><path d="m6 15 8-8"/>');
  const plus = svg('<path d="M12 4v16M4 12h16"/>');
  const squiggle=svg('<path d="M0 12q3-8 6 0t6 0t6 0t6 0"/>').replace('viewBox','preserveAspectRatio="none" viewBox');
  const searchIcon=svg('<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>');
  const sendIcon=svg('<path d="m3 3 18 9-18 9 4-9Zm4 9h14"/>');
  const editIcon=svg('<path d="M8 4h8M12 4v16M8 20h8M4 8h3m10 8h3"/>');
  const expandIcon=svg('<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>');
  const restoreIcon=svg('<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5"/>');
  const rankIcon=svg('<path d="m5 12 7-6 7 6M5 18l7-6 7 6"/>');
  const inviteIcon=svg('<circle cx="9" cy="7" r="4"/><path d="M2 21v-3a7 7 0 0 1 13-3m4-4v8m-4-4h8"/>');
  const uploadIcon=svg('<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>');
  const cancelIcon=svg('<path d="m6 6 12 12M6 18 18 6"/>');
  const saveIcon=svg('<path d="m5 12 4 4L19 6"/>');
  const previousIcon=svg('<path d="m14 6-6 6 6 6"/>');
  const nextIcon=svg('<path d="m10 6 6 6-6 6"/>');
  const trashIcon=svg('<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>');
  const folderShape=()=>`<svg class="gw-folder-shape" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M.5 39.5V8Q.5 .5 8 .5H88Q92 .5 93 5L99.5 39.5" vector-effect="non-scaling-stroke"/><path class="gw-folder-base" d="M.5 39.5h99" vector-effect="non-scaling-stroke"/></svg>`;
  const folderObserver=new ResizeObserver(entries=>{
    for(const {target,contentRect:{width,height}} of entries){
      if(!width || !height)continue;
      target.setAttribute('viewBox',`0 0 ${width} ${height}`);
      target.firstElementChild.setAttribute('d',`M.5 ${height-.5}V10Q.5 .5 10 .5H${width-25}Q${width-17} .5 ${width-15} 5L${width-.5} ${height-.5}`);
      target.lastElementChild.setAttribute('d',`M.5 ${height-.5}H${width-.5}`);
    }
  });
  const filterIcons={
    Recent:svg('<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>'),
    Scheduled:svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/>'),
    Incomplete:svg('<circle cx="12" cy="12" r="9" stroke-dasharray="30 7"/><path d="M12 6v7m0 4v1"/>'),
    Sleeping:svg('<path d="M19 16A8 8 0 0 1 8 5a8 8 0 1 0 11 11Z"/>')
  };
  const people=[['mira','Mira Chen',true],['you','You',true],['theo','Theo Grant',false],['inez','Inez',false]];
  const mobile=()=>root.clientWidth<700;
  const avatar=id=>`<img class="avatar" src="${id==='you'?'workbench-avatar-you':`avatar-${id}`}.svg" alt="">`;
  let serial = 0;
  const objectUrls = new Set();
  const image = (name, color) => ({
    id:`f${++serial}`,name,kind:'image',unread:false,
    url:`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480"><rect width="800" height="480" fill="#15191d"/><rect x="35" y="35" width="730" height="45" rx="8" fill="#242c30"/><rect x="35" y="110" width="225" height="300" rx="12" fill="#242c30"/><rect x="285" y="110" width="480" height="300" rx="12" fill="#1c2328"/><rect x="315" y="160" width="240" height="14" rx="5" fill="${color}"/><rect x="315" y="200" width="400" height="8" fill="#414b50"/><rect x="315" y="225" width="350" height="8" fill="#414b50"/><rect x="315" y="295" width="150" height="42" rx="8" fill="${color}"/><text x="52" y="65" fill="#eff2f4" font-family="system-ui" font-size="18">${name}</text></svg>`)}`
  });
  const doc = (name, text) => ({id:`f${++serial}`,name,kind:'text',text,unread:false});
  const subject = (id, name, description, extra = {}) => ({
    id,name,description,tab:'work',draft:'',pending:[],comments:[],artifacts:[],scroll:{},widgets:{},incomplete:true,unread:false,sleeping:false,member:'you',question:true,...extra
  });
  let state;
  function reset(mode = root.dataset.gridMode, preservedProject = null) {
    if(!preservedProject) {
      for (const url of objectUrls) URL.revokeObjectURL(url);
      objectUrls.clear();
    }
    const project=subject('project','On Deck evolution','A quieter workspace for human intent and agent-led work.',{
      artifacts:mode==='empty'?[]:[doc('project-brief.md','# A calm place to work\n\nKeep artifacts in the foreground. Let agents move the work forward without demanding constant attention.'),image('workspace-reference.svg','#a78bfa')],
      phase:mode==='empty'?'fresh':mode==='setup'?'setup':'ready',repos:['https://github.com/workbench/product'],
      comments:mode==='empty'?[]:[{id:`c${++serial}`,author:'Facilitator',text:mode==='setup'?'You can invite teammates now or later. I will keep going with the context you have already provided.':'Your project is ready. Open the first Thread to shape its plan, or add another Thread when a new idea comes up.',attachments:[]}]
    });
    const names=['Design the first-run experience','Research table foundations','Ship the first-run improvements','Audit keyboard accessibility','Explore the project UX','Maintain and prune tests','Find dead code','Polish empty states','Explore offline support','Review release notes','Measure loading performance','Prototype command palette','Archive migration notes','Review last quarter'];
    const threads=['empty','top','setup'].includes(mode) ? [] : names.map((name,i)=>subject(`thread-${i}`,name,[
      'Make project setup feel like beginning the work.','Compare accessible, headless table primitives.','Review the effect of a quieter beginning.',
      'Check focus order and keyboard navigation.','Walk key journeys and record opportunities.','Keep the test suite focused and useful.',
      'Identify unused paths and propose removals.','Keep the interface calm when there is nothing to show.','Keep recent context available without a connection.'
    ][i] || 'Keep this subject useful and the outcome visible.',{member:i===3?'mira':i===7?'theo':'you',incomplete:![2,7,12,13].includes(i),unread:[1,2,4].includes(i),scheduled:[4,5,6].includes(i),question:[1,4].includes(i),older:i>=12,widgetIndex:0,
      artifacts:[
        doc('plan.md',`# ${name}\n\nRead the shared Project context.\n\n## Approach\n\nKeep the change small and reviewable. Preserve the user's place and drafts.\n\n## Validation\n\nCover keyboard, mobile, and artifact navigation before review.`),
        doc('research.md','# Research notes\n\nCompare the existing behavior with a focused prototype. Document the tradeoffs rather than committing to a framework too early.'),
        image('button-study.svg','#a78bfa'),image('alternate-layout.svg','#f59e0b'),
        doc('validation.md','# Validation\n\n- Keyboard navigation\n- Mobile layout\n- Draft preservation\n- Artifact ownership'),
        doc('changes.md','# Changes\n\nImplementation: +150 / -38\n\nVerification: +36 / -4'),
        doc('review.md','# Review\n\nKeep Project context visually distinct from individual Threads.')
      ],
      comments:[
        {id:`c${++serial}`,author:'You',text:'Use this reference as context, not a pixel-perfect requirement.',attachments:[image('comment-reference.svg','#7d9eda')]},
        {id:`c${++serial}`,author:'Thread agent',text:'I have gathered the initial notes. Save them as an Artifact if they should become part of the curated work.',attachments:[doc('session-notes.md','# Session notes\n\nThe grid helps monitoring. Details should preserve focus and drafts.')]}
      ]
    })).map((t,i)=>({...t,artifacts:t.artifacts.slice(0,mode==='first'?1:mode==='full'?3+i%5:4).map((f,j)=>({...f,unread:j<2,fresh:j===0}))}));
    if(['first','thread','new'].includes(mode))threads.splice(mode==='first'?1:2);
    if(mode==='new')threads.unshift(subject('draft-thread','', '',{isNew:true,question:false}));
    state={project:preservedProject || project,threads,active:['empty','setup','first'].includes(mode)?'project':mode==='thread'?'thread-0':null,filter:'Recent',member:'you',query:'',full:false,top:mode==='top',showOlder:false,mobileView:mode==='thread'?2:['empty','setup','first'].includes(mode)?0:1,lastThread:threads[0]?.id};
    if(mode==='member'){state.member='mira';state.active='thread-3';state.lastThread='thread-3';state.mobileView=2;}
    renderShell();
  }
  const current = () => !state.active || state.active==='project' ? state.project : state.threads.find(t=>t.id===state.active);
  const readonly = (owner=current()) => state.member!=='you' || owner?.member!=='you';
  const composerOwner = form => form.dataset.owner==='project'?state.project:state.threads.find(t=>t.id===form.dataset.owner);
  const getFile = id => {
    const owner=current();
    return owner?.artifacts.find(f=>f.id===id) || owner?.comments.flatMap(c=>c.attachments).find(f=>f.id===id);
  };
  const markdown = text => escape(text).split(/\n/).map(line=>line.startsWith('### ') ? `<h5>${line.slice(4)}</h5>` : line.startsWith('## ') ? `<h4>${line.slice(3)}</h4>` : line.startsWith('# ') ? `<h3>${line.slice(2)}</h3>` : `<p>${line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>') || '<br>'}</p>`).join('');
  function announce(message, error = false) {
    const notice=$('.gw-notice');
    notice.textContent=message;
    notice.classList.toggle('error',error);
  }
  function renderShell() {
    root.innerHTML=`<div class="gw-browser"><span>● ● ●</span><span>workbench.local / on-deck-evolution</span><span>LOCAL CONCEPT</span></div>
      <div class="gw-shell">
        ${headerMarkup()}
        <div class="gw-top-content"${state.top?'':' hidden'}></div>
        <nav class="gw-mobile-nav" aria-label="Workspace screens">${['Project details','Thread list','Thread detail'].map((name,index)=>`<button data-g="mobile-view" data-index="${index}" aria-label="${name}" aria-pressed="${state.mobileView===index}"></button>`).join('')}</nav>
        <div class="gw-mobile-viewport">
        <div class="gw-grid" aria-label="Project Threads"></div>
        <section class="gw-detail" role="dialog" aria-label="Work details" hidden></section>
        <div class="gw-mobile-empty" hidden>Select a Thread from the list to open its details.</div>
        </div>
        <button class="gw-new-thread" data-g="new-thread" aria-label="New Thread"${state.top?' hidden':''}>${plus}</button>
        <button class="gw-project-return" data-g="project" aria-label="Open Project context" hidden>${folderShape()}${icon(state.project.name)}<span>${escape(state.project.name)}</span></button>
        <div class="gw-notice" role="status" aria-live="polite"></div>
      </div>`;
    if(state.top)renderTop();
    renderGrid();
    renderPane();
    syncMobile();
  }
  function headerMarkup() {
    const account=`<details class="gw-account"><summary aria-label="Account and Settings"><span class="account-gear">${WorkbenchConcept.gear()}${avatar('you')}</span></summary><div><strong>Your workspace</strong><p>Account · You</p><label>Reduce motion<input class="gw-reduce-motion" type="checkbox" aria-label="Reduce motion in this screen"></label><small>Local settings preview</small></div></details>`;
    if(state.top)return `<header class="gw-header gw-top-header"><img class="gw-product" src="workbench-logo.svg" alt="Workbench">${account}</header>`;
    return `<header class="gw-header" aria-label="Workspace titlebar"><div class="gw-header-left">
      <button data-g="top" class="gw-back" aria-label="Back to Projects">‹<img src="workbench-logo.svg" alt=""></button>
      <details class="gw-project-switch gw-reveal"><summary aria-label="Switch Project">${icon(state.project.name)}<span>${escape(state.project.name)}</span>${WorkbenchConcept.chevron()}</summary><div><button data-g="project">${escape(state.project.name)}</button><button data-g="top">All Projects</button></div></details>
      <div class="gw-people" aria-label="Project members, active first">${[...people].sort((a,b)=>Number(b[2])-Number(a[2])).map(([id,name,active])=>`<button data-g="member" data-id="${id}" class="gw-person${id===state.member?' selected':' gw-reveal'}" aria-pressed="${id===state.member}" aria-label="View ${name}'s Threads${id==='you'?' · owner':''}"><i class="gw-person-gutter ${id===state.member?'selected':active?'active':'inactive'}"></i>${avatar(id)}</button>`).join('')}</div>
      <button class="activity-summary gw-reveal gw-activity" aria-label="Open activity report">${svg('<path d="M4 3v18h17M8 15v-4m5 4V6m5 9v-7"/>')}</button>
      </div>
      <div class="gw-filters" role="group" aria-label="Thread views">${Object.entries(filterIcons).map(([name,graphic])=>`<button data-g="filter" data-value="${name}" class="${state.filter===name?'selected':'gw-reveal'}" aria-pressed="${state.filter===name}" aria-label="${name} Threads">${graphic}</button>`).join('')}</div>
      <div class="gw-header-right"><form class="gw-search-form" role="search"><input class="gw-search gw-reveal" type="search" value="${escape(state.query)}" placeholder="Search across ${escape(state.project.name)} Threads..." aria-label="Search Thread names and descriptions"><button type="button" data-g="search" aria-label="Search Threads">${searchIcon}</button></form>
      <span class="gw-divider" role="separator"></span><div class="gw-account-wrap">${account}</div></div>
    </header>`;
  }
  function updateHeader() {
    const focused=$('.gw-search')===document.activeElement;
    if(focused)return;
    const expanded=$('.gw-header').classList.contains('gw-header-expanded');
    $('.gw-header').outerHTML=headerMarkup();
    if(expanded)$('.gw-header').classList.add('gw-header-expanded');
    const selected=$('.gw-person.selected'),strip=$('.gw-people');
    if(selected && strip)strip.scrollLeft=Math.max(0,selected.offsetLeft+selected.offsetWidth-strip.clientWidth);
  }
  let shownMobileView;
  function syncMobile() {
    const isMobile=mobile(),view=state.mobileView;
    $('.gw-shell').classList.toggle('gw-mobile',isMobile);
    $('.gw-mobile-nav').hidden=!isMobile || state.top;
    $('.gw-mobile-viewport').hidden=state.top;
    $('.gw-grid').hidden=state.top || isMobile && view!==1;
    $('.gw-detail').hidden=state.top || isMobile && (view===1 || view===2 && !state.active);
    $('.gw-mobile-empty').hidden=state.top || !isMobile || view!==2 || !!state.active;
    $('.gw-new-thread').hidden=state.top || isMobile && view!==1;
    $('.gw-project-return').hidden=state.top || isMobile || !state.active || state.active==='project';
    all('.gw-mobile-nav button').forEach((button,i)=>{
      button.setAttribute('aria-pressed',String(i===view));
      button.classList.toggle('has-question',i===0?state.project.phase==='setup':i===2 && !!state.threads.find(t=>t.id===state.lastThread)?.question);
    });
    if(isMobile && shownMobileView!==undefined && shownMobileView!==view && !matchMedia('(prefers-reduced-motion: reduce)').matches && !$('.gw-shell').classList.contains('gw-no-motion')){
      const target=view===1?$('.gw-grid'):$('.gw-detail').hidden?$('.gw-mobile-empty'):$('.gw-detail');
      target.animate([{transform:`translateX(${view>shownMobileView?'':'-'}24px)`,opacity:.4},{transform:'translateX(0)',opacity:1}],{duration:180,easing:'ease-out'});
    }
    shownMobileView=view;
  }
  function mobileView(index) {
    if(index===0)open('project',false);
    else if(index===1)close();
    else if(state.lastThread)open(state.lastThread,false);
    else {savePane();state.active=null;state.mobileView=2;syncMobile();}
  }
  function renderTop() {
    $('.gw-top-content').innerHTML=`<div class="gw-top-primary"><div class="gw-start-action"><span>New Project</span><button class="primary" data-g="new-project" aria-label="New Project">${plus}</button></div><form class="gw-new-project" hidden><label>Project name<input name="name" required placeholder="What are we working on?"></label><label>Description<textarea name="description" required placeholder="What should this Project achieve?"></textarea></label><div><button type="button" data-g="cancel-project" aria-label="Cancel Project creation">${cancelIcon}</button><button class="primary" type="submit" aria-label="Create Project">${saveIcon}</button></div></form></div><div class="gw-project-list">${[['On Deck evolution','A quieter workspace for human intent and agent-led work.'],['Design system','Shared patterns for a coherent product.'],['Release readiness','Coordinate the next release.']].map(([name,desc])=>`<button data-g="existing-project" data-name="${name}">${icon(name)}<span><strong>${name}</strong><small>${desc}</small></span><span class="avatars">${avatar('you')}${avatar('mira')}${avatar('theo')}</span></button>`).join('')}</div>`;
  }
  const prIcon=svg('<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v10M18 17V9a4 4 0 0 0-4-4h-2m2-2-2 2 2 2"/>');
  const widgetNames={question:'Question',checklist:'Planning checklist',impact:'Impact',note:'Working notes',repos:'Project Repos',members:'Project members'};
  function decorateWidgets(scope,owner) {
    const locked=state.member!=='you' || owner.member!=='you';
    all('.widget,.gw-work-checklist',scope).forEach(widget=>{
      const kind=widget.matches('.question')?'question':widget.matches('.gw-impact')?'impact':widget.matches('.gw-carousel-checklist,.gw-work-checklist')?'checklist':widget.matches('.repo-widget')?'repos':widget.closest('.gw-controls')?'members':'note';
      if(owner.widgets[kind]?.removed){widget.remove();return;}
      const pinned=!!owner.widgets[kind]?.pinned,name=widgetNames[kind];
      widget.dataset.widget=kind;
      widget.classList.add('gw-managed-widget');
      (widget.querySelector(':scope > summary') || widget).insertAdjacentHTML('beforeend',`<span class="gw-widget-tools"><button type="button" data-g="pin-widget" data-owner="${owner.id}" data-kind="${kind}" aria-label="${pinned?'Unpin':'Pin'} ${name} widget" aria-pressed="${pinned}"${locked?' disabled':''}>${WorkbenchConcept.pin()}</button><button type="button" data-g="trash-widget" data-owner="${owner.id}" data-kind="${kind}" aria-label="Remove ${name} widget"${locked?' disabled':''}>${trashIcon}</button></span>`);
    });
    const controls=$('.gw-controls',scope);
    if(controls)all('[data-widget]',controls).sort((a,b)=>Number(!!owner.widgets[b.dataset.widget]?.pinned)-Number(!!owner.widgets[a.dataset.widget]?.pinned)).forEach(widget=>controls.append(widget));
  }
  function questionMarkup(owner,prompt,choices,action) {
    return `<article class="widget question"><div class="widget-head">◇ Question for you</div><p>${prompt}</p><div class="choices">${choices.map(text=>`<button data-g="${action}" data-id="${owner.id}">${text}</button>`).join('')}</div><form class="gw-answer-form" data-action-kind="${action}" data-owner="${owner.id}"><input name="answer" required aria-label="Your own answer" placeholder="Or write your own answer..." value="${escape(owner.questionDraft || '')}"><button type="submit" class="primary" aria-label="Send answer">${sendIcon}</button></form></article>`;
  }
  function answerQuestion(owner,action,text) {
    if(state.member!=='you' || owner.member!=='you'){announce('Only the assignee in their own view can answer this Question.',true);return;}
    if(!text.trim()){announce('Write an answer before sending.',true);return;}
    if(action==='validation')owner.phase='ready';else owner.question=false;
    owner.questionDraft='';
    owner.comments.push({id:`c${++serial}`,author:'You',text:action==='validation'?`Validation: ${text}`:text,attachments:[]});
    renderGrid();if(current()===owner)renderBody();syncMobile();
    announce('Answer recorded in this local example.');
  }
  function widgetMarkup(thread,kind) {
    if(kind==='question')return questionMarkup(thread,'Which direction should we explore first?',['Quiet first-run flow','Navigation patterns'],'card-answer');
    if(kind==='impact')return `<article class="widget gw-impact"><div class="widget-head"><strong>Impact <span class="diff-add">+186</span> <span class="diff-remove">−42</span></strong><a href="#merged-pr-example" aria-label="Open illustrative merged PR 42">${prIcon}</a></div><div class="gw-directory-diffs">${[['src/onboarding/','88','18'],['src/components/shell/','44','12'],['src/styles/','18','8'],['tests/onboarding/','36','4']].map(([path,add,remove])=>`<div><span>${path}</span><span class="diff-add">+${add}</span><span class="diff-remove">−${remove}</span></div>`).join('')}</div><small>Merged PR · illustrative diff</small></article>`;
    if(kind==='note')return `<article class="widget"><div class="widget-head">Working notes</div><p>${escape(thread.description)}</p><p class="muted">The latest context stays with the work, not in a second status row.</p></article>`;
    return `<article class="widget gw-carousel-checklist"><div class="widget-head">Planning checklist</div>${WorkbenchConcept.checklist({complete:!thread.incomplete,ready:true})}</article>`;
  }
  function cardMarkup(t) {
    if(t.isNew)return `<article class="gw-card gw-new-card" data-thread="${t.id}"><form class="gw-thread-editor" data-id="${t.id}" data-owner="${t.id}"><div class="gw-thread-editor-heading"><input name="name" aria-label="Thread title" placeholder="Untitled Thread" value="${escape(t.name)}"><button type="button" data-g="cancel-thread" data-id="${t.id}" class="gw-icon-action" aria-label="Cancel new Thread">${cancelIcon}</button></div><div class="gw-thread-description"><textarea name="description" aria-label="Thread description" placeholder="Describe what you want to work on..." required>${escape(t.description)}</textarea><div class="gw-pending">${pendingMarkup(t)}</div><div class="gw-compose-actions"><button type="button" data-g="attach" aria-label="Attach files to the new Thread; pasted images and files work too">${clip}</button><button class="primary" type="submit" aria-label="Save Thread"${t.description.trim()?'':' disabled'}>${saveIcon}</button></div></div><input type="file" class="gw-comment-input" multiple hidden></form></article>`;
    const kinds=(t.question?['question','checklist']:!t.incomplete?['impact','checklist']:Number(t.id.replace(/\D/g,''))%4===0?['checklist']:t.id==='thread-3'?['note','checklist']:['checklist','note'])
      .filter(kind=>!t.widgets[kind]?.removed).sort((a,b)=>Number(!!t.widgets[b]?.pinned)-Number(!!t.widgets[a]?.pinned));
    t.widgetIndex=Math.max(0,Math.min(t.widgetIndex || 0,kinds.length-1));
    return `<article class="gw-card ${state.active===t.id?'selected':''}" data-thread="${t.id}">
      <div class="gw-card-heading">${icon(t.name)}<button data-g="thread" data-id="${t.id}" class="gw-thread-name">${escape(t.name)}</button><div class="gw-artifact-dots" role="group" aria-label="Thread Artifacts">${t.artifacts.map(f=>`<button data-g="thread-artifact" data-id="${t.id}" data-file="${f.id}" class="gw-artifact-dot ${f.unread?f.fresh?'new-unread':'old-unread':'read'}" aria-label="${escape(f.name)} · ${f.unread?f.fresh?'new, unread':'unread':'read'}"></button>`).join('')}</div><button class="gw-sleep" data-g="sleep" data-id="${t.id}" aria-label="${t.sleeping?'Wake':'Sleep'} ${escape(t.name)}"${state.member!=='you'?' disabled':''}>${t.sleeping?'☀':'☾'}</button></div>
      <div class="gw-carousel" aria-label="Thread widgets" tabindex="0" data-index="${t.widgetIndex}">${kinds.length?kinds.map((kind,i)=>`<div class="gw-slide" data-slide="${i}">${widgetMarkup(t,kind)}${composerMarkup(t,true)}</div>`).join(''):`<div class="gw-slide" data-slide="0">${composerMarkup(t,true)}</div>`}</div>
      ${kinds.length>1?`<div class="gw-carousel-controls" role="group" aria-label="Choose a card widget"><button data-g="carousel" data-id="${t.id}" data-dir="-1" aria-label="Previous widget">${previousIcon}</button>${kinds.map((kind,i)=>`<button data-g="carousel" data-id="${t.id}" data-index="${i}" class="gw-carousel-dot" aria-current="${t.widgetIndex===i}" aria-label="Show ${kind} widget"></button>`).join('')}<button data-g="carousel" data-id="${t.id}" data-dir="1" aria-label="Next widget">${nextIcon}</button></div>`:''}
    </article>`;
  }
  function renderGrid() {
    const ownView=state.member==='you';
    const threads=state.threads.filter(t=>(ownView || t.member===state.member) && `${t.name} ${t.description}`.toLowerCase().includes(state.query.toLowerCase()) && (state.filter==='Sleeping' ? ownView && t.sleeping : !(ownView && t.sleeping) && (state.filter==='Incomplete' ? t.incomplete : state.filter==='Scheduled' ? t.scheduled : true)));
    $('.gw-shell').classList.toggle('gw-viewing-other',!ownView);
    $('.gw-grid').hidden=state.top;
    const older=threads.filter(t=>t.older && !state.query),recent=threads.filter(t=>!t.older || state.query);
    $('.gw-grid').innerHTML=recent.map(cardMarkup).join('')+(older.length?`<button class="gw-older" data-g="older" aria-expanded="${state.showOlder}">${squiggle}<span>${state.showOlder?'Hide':'Show'} older Threads · ${older.length}</span>${squiggle}</button>${state.showOlder?older.map(cardMarkup).join(''):''}`:'') || (state.threads.length?'<p class="gw-empty">No matching Threads.</p>':'');
    $('.gw-new-thread').classList.toggle('gw-tucked',recent.length>0 || state.showOlder && older.length>0);
    all('.gw-card').forEach(card=>decorateWidgets(card,state.threads.find(t=>t.id===card.dataset.thread)));
    all('.gw-carousel').forEach(el=>el.scrollLeft=el.clientWidth*Number(el.dataset.index));
    updateHeader();
    syncMobile();
  }
  function savePane() {
    const owner=current();
    if (owner && $('.gw-body')) owner.scroll[owner.tab]=$('.gw-body').scrollTop;
  }
  function open(id, focus = true) {
    savePane();
    if(id==='project' && state.active && state.active!=='project'){
      state.active=null;renderPane();
      $('.gw-detail').getBoundingClientRect();
    }
    state.active=id;state.full=false;
    state.mobileView=id==='project'?0:2;
    if(id!=='project')state.lastThread=id;
    if(state.member==='you') current().unread=false;
    renderGrid();renderPane();syncMobile();
    if(focus) ($('.gw-tabs [aria-selected="true"]') || $('.gw-primary-tab')).focus({preventScroll:true});
  }
  function close() {
    const previous=state.active;
    savePane();state.active=null;state.full=false;state.mobileView=1;
    renderGrid();renderPane();syncMobile();
    const target=mobile()?$('.gw-mobile-nav [data-index="1"]'):previous==='project' ? $('.gw-project-toggle') : $(`[data-g="thread"][data-id="${previous}"]`);
    target?.focus({preventScroll:true});
  }
  function fileList(files, context='all') {
    return `<div class="gw-file-list" data-list="${context}">${files.map(f=>`<button data-g="file" data-id="${f.id}"><span>${f.kind==='image'?'▧':'▤'} ${escape(f.name)}</span><small>${f.unread?f.fresh?'New · ':'Unread · ':''}${f.kind==='image'?'Gallery':'Artifact'}</small></button>`).join('') || '<p>No Artifacts yet. Use + to upload, paste, or create one.</p>'}</div>`;
  }
  function renderTabs() {
    const owner=current();if(!owner)return;
    const files=owner.artifacts.filter(f=>f.kind!=='image').map(f=>[f.id,f.name]);
    if(owner.artifacts.some(f=>f.kind==='image'))files.push(['gallery','Gallery']);
    const attachment=owner.comments.flatMap(c=>c.attachments).find(f=>f.id===owner.tab);
    if(attachment && !owner.artifacts.some(f=>f.id===attachment.id))files.unshift([attachment.id,attachment.name]);
    const tabs=[['work',owner.name],...files,['more','More']];
    const selectedTab=!state.active?'work':owner.tab;
    $('.gw-tabs').innerHTML=`<div role="tablist" aria-label="Work and Artifact tabs">${tabs.map(([id,label])=>`<button role="tab" data-g="${state.active?'tab':'project'}" data-id="${id}" aria-selected="${selectedTab===id}" aria-label="${escape(label)}" class="${id==='more'?'gw-more':id==='work'?'gw-primary-tab gw-project-toggle':''}">${folderShape()}${id==='work'?icon(owner.name):''}<span>${escape(label)}</span></button>`).join('')}</div><button data-g="add" class="gw-add" aria-expanded="false" aria-label="Add Artifact: upload files, paste content, or create a new document"${readonly()?' disabled':''}>${plus}</button>`;
    const pane=$('.gw-detail'),nav=$('.gw-tabs'),paneStyle=getComputedStyle(pane);
    const width=(parseFloat(pane.style.width) || pane.clientWidth)-parseFloat(paneStyle.paddingLeft)-parseFloat(paneStyle.paddingRight);
    const available=width-$('.gw-add').getBoundingClientRect().width-parseFloat(getComputedStyle(nav).columnGap);
    const space=available-Math.min(210,available*.48);
    const fileTabs=all('[role="tab"]',nav).slice(1,-1),more=$('.gw-more');
    const cost=tab=>tab.getBoundingClientRect().width+parseFloat(getComputedStyle(tab).marginLeft);
    const costs=new Map(fileTabs.map(tab=>[tab,cost(tab)]));
    if([...costs.values()].reduce((sum,width)=>sum+width,0)<=space)more.remove();
    else {
      let remaining=space-cost(more);
      const selected=fileTabs.find(tab=>tab.dataset.id===owner.tab);
      const visible=new Set();
      for(const tab of selected?[selected,...fileTabs.filter(tab=>tab!==selected)]:fileTabs){
        if(costs.get(tab)<=remaining){visible.add(tab);remaining-=costs.get(tab);}
      }
      for(const tab of fileTabs)if(!visible.has(tab))tab.remove();
      if(selected && !visible.has(selected))more.setAttribute('aria-selected','true');
    }
    folderObserver.disconnect();
    all('.gw-folder-shape').forEach(shape=>folderObserver.observe(shape));
  }
  function renderPane() {
    const pane=$('.gw-detail'),owner=current();
    pane.hidden=state.top;
    $('.gw-project-return').hidden=state.top || !state.active || state.active==='project';
    if(state.top)return;
    pane.setAttribute('aria-label',`${owner.id==='project'?'Project':'Thread'} details: ${owner.name}`);
    const locked=readonly();
    pane.className=`gw-detail ${owner.id==='project'?'gw-project-detail':'gw-thread-detail'}${state.full?' gw-full':''}${!state.active?' gw-collapsed':''}`;
    pane.setAttribute('aria-expanded',String(!!state.active));
    pane.innerHTML=`<nav class="gw-tabs"></nav><div class="gw-detail-content"${state.active?'':' inert'}>
      ${locked?'<div class="gw-readonly">Read-only · switch to your own view to edit your assigned work.</div>':''}
      <div class="gw-add-menu" hidden><button data-g="upload">Upload files</button><button data-g="paste">Paste content</button><button data-g="new-file">New document</button></div>
      <div class="gw-more-float" hidden><label>All Artifacts<input type="search" class="gw-more-search" aria-label="Search all Artifacts" placeholder="Find an Artifact"></label>${fileList(owner.artifacts,'hover')}</div>
      <div class="gw-body"></div><input type="file" class="gw-file-input" multiple hidden></div>`;
    positionPane();renderTabs();renderBody();
    $('.gw-body').scrollTop=owner.scroll[owner.tab] || 0;
    syncMobile();
  }
  function commentMarkup(comment) {
    const owner=current();
    return `<article class="comment gw-comment ${comment.author==='You'?'':'agent-comment'}"><div class="comment-head">${comment.author==='You'?avatar('you'):'<span class="activity-dot"></span>'}${escape(comment.author)}${comment.author==='You'?'<span class="status">Received</span>':''}</div><div>${markdown(comment.text)}</div><div class="gw-comment-files">${comment.attachments.map(f=>`<div><button data-g="attachment" data-id="${f.id}">${f.kind==='image'?`<img src="${escape(f.url)}" alt="">`:'▤'}<span>${escape(f.name)}</span></button><button data-g="promote" data-id="${f.id}" aria-label="${owner.artifacts.some(a=>a.id===f.id)?'Saved':'Save'} ${escape(f.name)} as a curated Artifact"${readonly() || owner.artifacts.some(a=>a.id===f.id)?' disabled':''}>${owner.artifacts.some(a=>a.id===f.id)?saveIcon:rankIcon}</button></div>`).join('')}</div></article>`;
  }
  function controlsMarkup(owner,locked) {
    return `<section class="gw-controls"><h4>Controls</h4><article class="widget repo-widget"><div class="widget-head">⌘ Project Repos</div><div class="repo-list">${(owner.repos||[]).map(url=>`<div class="repo-row"><span>${escape(url.replace('https://github.com/',''))}</span><button class="tiny" data-g="remove-repo" data-url="${escape(url)}" aria-label="Remove repository ${escape(url)}"${locked?' disabled':''}>${cancelIcon}</button></div>`).join('') || '<p>No Repos attached.</p>'}</div><form class="gw-repo-form"><input type="url" name="url" required placeholder="https://github.com/owner/repo" aria-label="Repository git URL"${locked?' disabled':''}><button type="submit" aria-label="Attach repository"${locked?' disabled':''}>${clip}</button></form></article><article class="widget"><div class="widget-head">◎ Project members</div><div class="member-row">${avatar('you')}<span>You <small>· owner</small></span><button class="tiny" data-g="invite" aria-label="Invite member"${locked?' disabled':''}>${inviteIcon}</button></div>${owner.invited?`<p>${escape(owner.invited)} · invitation pending</p>`:''}<form class="gw-invite-form" hidden><input type="email" name="email" required placeholder="teammate@example.com" aria-label="Teammate email"><button type="submit" aria-label="Send invitation">${sendIcon}</button></form><p>Keep working. Invitations are optional.</p></article></section>`;
  }
  function dropzoneMarkup(locked) {
    return `<div class="dropzone gw-dropzone" tabindex="0" role="group" aria-label="Add Artifacts: drop or paste files"><strong>Add Artifacts</strong><span>Drop or paste files here <button data-g="upload" aria-label="Browse files to add Artifacts"${locked?' disabled':''}>${uploadIcon}</button></span></div>`;
  }
  function descriptionMarkup(owner,locked) {
    if(owner.editingDescription)return `<form class="gw-description-editor"><textarea name="description" required aria-label="Project description">${escape(owner.descriptionDraft)}</textarea><button type="submit" class="primary" aria-label="Save description">${sendIcon}</button></form>`;
    return `<div class="gw-description-row"><p class="gw-description">${escape(owner.description)}</p>${owner.id==='project'?`<button data-g="edit-description" aria-label="Edit Project description"${locked?' disabled':''}>${editIcon}</button>`:''}</div>`;
  }
  function projectArtifactButton(file) {
    if(!file)return '';
    const promoted=state.project.artifacts.includes(file);
    const linked=state.threads.some(t=>t.artifacts.includes(file));
    if(!linked)return '';
    return `<button data-g="project-artifact" data-id="${file.id}" class="gw-icon-action ${promoted?'gw-demote':''}" aria-label="${promoted?'Demote: remove Project reference; keep Thread Artifact':'Promote to Project artifact: share a reference, not a copy'}"${readonly()?' disabled':''}>${rankIcon}</button>`;
  }
  function artifactActions(file) {
    return `<span class="gw-artifact-actions">${projectArtifactButton(file)}<button data-g="expand" class="gw-icon-action" aria-label="${state.full?'Restore pane size':'Expand Artifact'}">${state.full?restoreIcon:expandIcon}</button></span>`;
  }
  function pendingMarkup(owner) {
    return owner.pending.map(f=>`<span>${escape(f.name)}<button type="button" data-g="remove-pending" data-id="${f.id}" aria-label="Remove ${escape(f.name)} from the draft"${readonly(owner)?' disabled':''}>×</button></span>`).join('');
  }
  function composerMarkup(owner,compact=false) {
    const locked=readonly(owner);
    return `<form class="gw-composer${compact?' gw-card-composer':''}" data-owner="${owner.id}" aria-label="Comment on ${escape(owner.name)}"><textarea name="comment" aria-label="New Comment" placeholder="${compact?'Steer the agent...':'Write an instruction, or paste an image or file...'}"${locked?' disabled':''}>${escape(owner.draft)}</textarea><div class="gw-pending">${pendingMarkup(owner)}</div><div class="gw-compose-actions"><button type="button" data-g="attach" aria-label="Attach files to this Comment; pasted images and files work too"${locked?' disabled':''}>${clip}</button><button type="submit" class="primary" aria-label="Send Comment"${locked?' disabled':''}>${sendIcon}</button></div><input type="file" class="gw-comment-input" multiple hidden></form>`;
  }
  function renderBody() {
    const owner=current(),body=$('.gw-body'),locked=readonly();
    if(owner.editor) {renderEditor();return;}
    if(owner.tab==='work' && owner.id==='project' && owner.phase==='fresh'){
      body.innerHTML=`${descriptionMarkup(owner,locked)}<div class="gw-get-started"><form class="gw-intent"><button class="primary" type="submit"${locked?' disabled':''}>Get Started</button></form>${dropzoneMarkup(locked)}</div>`;
      return;
    }
    if(owner.tab==='work') {
      body.innerHTML=`${descriptionMarkup(owner,locked)}
        ${owner.id==='project' && owner.phase==='setup'?questionMarkup(owner,'How should changes be validated?',['Tests + CI + review','Tests + manual checks','Agent proposes per Thread'],'validation'):''}
        ${owner.question && owner.id!=='project'?questionMarkup(owner,'Who should this first-run flow serve first?',['First-time solo users','An existing team'],'answer'):''}
        ${owner.id==='project' && owner.phase==='fresh'?'':`<section class="gw-comments"><h4>Comments</h4>${owner.comments.map(commentMarkup).join('')}</section>
        ${composerMarkup(owner)}`}
        ${owner.id!=='project'?`<details class="gw-work-checklist" open><summary>${owner.incomplete?'Planning checklist':'Completed checklist · +186 / −42'}</summary>${WorkbenchConcept.checklist({complete:!owner.incomplete,ready:true})}</details>`:''}
        ${owner.id==='project' && owner.phase!=='fresh'?controlsMarkup(owner,locked):''}
        ${dropzoneMarkup(locked)}`;
      decorateWidgets(body,owner);
    } else if(owner.tab==='more') {
      body.innerHTML=`<div class="gw-file-heading"><h4>All Artifacts · ${owner.artifacts.length}</h4><button data-g="add" class="gw-icon-action" aria-label="Add Artifact">${plus}</button></div><label>Find an Artifact<input type="search" class="gw-list-search" placeholder="Search files and images"></label>${fileList(owner.artifacts)}`;
    } else if(owner.tab==='gallery') {
      const images=owner.artifacts.filter(f=>f.kind==='image');
      const selected=images.find(f=>f.id===owner.imageId) || images[0];
      body.innerHTML=`<div class="gw-file-heading"><h4>Gallery · ${images.length} images</h4>${artifactActions(selected)}</div>${selected?`<figure class="gw-gallery-view"><img src="${escape(selected.url)}" alt="${escape(selected.name)}"><figcaption>${escape(selected.name)}</figcaption></figure><div class="gw-gallery">${images.map(f=>`<button data-g="image" data-id="${f.id}" aria-label="View ${escape(f.name)}" aria-pressed="${f.id===selected.id}"><img src="${escape(f.url)}" alt=""><span>${escape(f.name)}</span></button>`).join('')}</div>`:'<p>No images yet.</p>'}`;
    } else {
      const file=getFile(owner.tab);
      if(!file) {announce('This file is no longer available.',true);owner.tab='more';renderTabs();renderBody();return;}
      const attachment=!owner.artifacts.some(f=>f.id===file.id);
      body.innerHTML=`<div class="gw-file-heading"><div><small>${attachment?'COMMENT ATTACHMENT':'ARTIFACT'}</small><h4>${escape(file.name)}</h4></div>${artifactActions(file)}</div>${file.kind==='image'?`<img class="gw-file-image" src="${escape(file.url)}" alt="${escape(file.name)}">`:file.kind==='text'?`<div class="gw-document">${markdown(file.text)}</div>`:`<p>No inline viewer for this file type. ${escape(file.size || 0)} bytes are held locally in this tab.</p>`}`;
    }
  }
  function renderPending(owner) {
    all('.gw-composer,.gw-thread-editor').filter(form=>form.dataset.owner===owner.id).forEach(form=>$('.gw-pending',form).innerHTML=pendingMarkup(owner));
  }
  function positionPane() {
    const pane=$('.gw-detail');if(pane.hidden)return;
    pane.classList.toggle('gw-full',state.full);
    const shell=$('.gw-mobile-viewport'),width=shell.clientWidth,height=shell.clientHeight;
    const owner=current();
    if(mobile()){Object.assign(pane.style,{left:'0px',top:'0px',bottom:'auto',width:`${width}px`,height:'100%'});return;}
    const paneWidth=Math.min(660,width-32),paneHeight=height-126;
    if(owner.id==='project') {
      const targetWidth=state.active?(state.full?width-16:paneWidth):Math.min(310,width-32);
      Object.assign(pane.style,{left:`${(width-targetWidth)/2}px`,top:'auto',bottom:'20px',width:`${targetWidth}px`,height:state.active?`${height-(state.full?46:126)}px`:'38px'});return;
    }
    pane.style.bottom='auto';
    if(width<700 || state.full) {Object.assign(pane.style,{left:'8px',top:'76px',width:`${width-16}px`,height:`${height-96}px`});return;}
    const card=$(`[data-thread="${owner.id}"]`),frame=shell.getBoundingClientRect(),rect=card?.getBoundingClientRect();
    if(!rect) {Object.assign(pane.style,{left:`${(width-paneWidth)/2}px`,top:'100px',width:`${paneWidth}px`,height:`${paneHeight}px`});return;}
    const rightSpace=width-(rect.right-frame.left)-16,leftSpace=rect.left-frame.left-16;
    const right=rightSpace>=360 && (rightSpace>=leftSpace || leftSpace<360);
    const space=right?rightSpace:leftSpace;
    const actualWidth=space>=360?Math.min(paneWidth,space):paneWidth;
    const x=space>=360?(right?rect.right-frame.left+10:rect.left-frame.left-actualWidth-10):(width-actualWidth)/2;
    const y=Math.max(26,Math.min(rect.top-frame.top,height-paneHeight-26));
    Object.assign(pane.style,{left:`${x}px`,top:`${y}px`,width:`${actualWidth}px`,height:`${paneHeight}px`});
  }
  function selectTab(id) {
    savePane();current().tab=id;
    current().editor=null;
    if(state.member==='you'){
      if(id==='gallery'){
        const image=current().artifacts.find(f=>f.id===current().imageId) || current().artifacts.find(f=>f.kind==='image');
        if(image)image.unread=false;
      }
      const file=getFile(id);if(file)file.unread=false;
    }
    $('.gw-more-float').hidden=true;$('.gw-add-menu').hidden=true;
    renderTabs();renderBody();$('.gw-body').scrollTop=current().scroll[id] || 0;
    renderGrid();
    ($(`.gw-tabs [data-id="${id}"]`) || $('.gw-primary-tab')).focus({preventScroll:true});
  }
  async function readFiles(files, owner, attachment) {
    const workspace=state;
    const results=[];
    const failures=[];
    for(const file of files) {
      if(file.size>10*1024*1024) {failures.push(`${file.name} exceeds this local study's 10 MB file limit.`);continue;}
      try {
        const isImage=file.type.startsWith('image/');
        const entry={id:`f${++serial}`,name:file.name || 'pasted-image.png',kind:isImage?'image':/^text\/|json|javascript|xml/.test(file.type) || /\.(md|txt|csv|json|js|ts|css|html)$/i.test(file.name)?'text':'binary',size:file.size,unread:true,fresh:true};
        if(isImage) {entry.url=URL.createObjectURL(file);objectUrls.add(entry.url);}
        else if(entry.kind==='text') entry.text=await file.text();
        results.push(entry);
      } catch(error) {failures.push(`Could not read ${file.name}: ${error.message}`);}
    }
    if(state!==workspace || owner.id!=='project' && !state.threads.includes(owner)) {
      for(const entry of results) if(entry.url){URL.revokeObjectURL(entry.url);objectUrls.delete(entry.url);}
      return;
    }
    if(!results.length){if(failures.length)announce(failures.join(' '),true);return;}
    (attachment?owner.pending:owner.artifacts).push(...results);
    if(!attachment){owner.sleeping=false;owner.older=false;}
    if(attachment)renderPending(owner);
    else {
      if(current()===owner){renderTabs();if(['more','gallery'].includes(owner.tab))renderBody();}
      renderGrid();
    }
    announce(`${results.length} ${attachment?'Attachment(s) added to the Comment draft':'Artifact(s) added'} · stored in this tab only.${failures.length?' '+failures.join(' '):''}`,!!failures.length);
  }
  function fileEditor(mode) {
    $('.gw-add-menu').hidden=true;
    current().editor={mode,name:'untitled.md',content:''};
    renderEditor();
    $('.gw-artifact-editor textarea').focus();
  }
  function renderEditor() {
    const {mode,name,content}=current().editor;
    $('.gw-body').innerHTML=`<form class="gw-artifact-editor"><h4>${mode==='paste'?'Paste an Artifact':'New Artifact'}</h4><label>File name<input name="name" value="${escape(name)}" required maxlength="120"${readonly()?' disabled':''}></label><label>Content<textarea name="content" placeholder="${mode==='paste'?'Paste text here, or paste an image/file directly.':'Write a document...'}" required${readonly()?' disabled':''}>${escape(content)}</textarea></label><button class="primary" type="submit" aria-label="Add Artifact"${readonly()?' disabled':''}>${saveIcon}</button><button type="button" data-g="cancel-editor" aria-label="Cancel Artifact editing">${cancelIcon}</button></form>`;
  }
  root.addEventListener('click',event=>{
    if(event.target.closest('.gw-header') && matchMedia('(hover: none)').matches)$('.gw-header').classList.add('gw-header-expanded');
    const pr=event.target.closest('a[href="#merged-pr-example"]');
    if(pr){event.preventDefault();announce('Illustrative merged PR #42 · +186 / −42 across four directories. No live pull request is connected to this local example.');return;}
    const legacyFile=event.target.closest('[data-checklist-file]');
    if(legacyFile) {
      event.stopImmediatePropagation();
      const card=legacyFile.closest('[data-thread]');
      if(card)open(card.dataset.thread,false);
      const name=legacyFile.dataset.checklistFile;
      const match=current().artifacts.find(f=>f.name===name || name==='button-study.png' && f.kind==='image');
      if(match)selectTab(match.kind==='image'?'gallery':match.id);
      else announce(`${name} is not available in this snapshot.`,true);
      return;
    }
    const button=event.target.closest('[data-g]');
    if(!button) {
      const card=event.target.closest('.gw-card');
      if(card && !card.classList.contains('gw-new-card') && !event.target.closest('button,summary,input,textarea,form,a')){open(card.dataset.thread);return;}
      if(!state.top && !event.target.closest('.gw-detail,.gw-header,.gw-card'))close();
      return;
    }
    const action=button.dataset.g,id=button.dataset.id;
    if(action==='attach' || action==='remove-pending'){
      const form=button.closest('.gw-composer,.gw-thread-editor'),owner=composerOwner(form);
      if(readonly(owner)){announce('This view is read-only.',true);return;}
      if(action==='attach')$('.gw-comment-input',form).click();
      else {owner.pending=owner.pending.filter(f=>f.id!==id);renderPending(owner);}
      return;
    }
    if(action==='pin-widget' || action==='trash-widget'){
      const owner=button.dataset.owner==='project'?state.project:state.threads.find(t=>t.id===button.dataset.owner),kind=button.dataset.kind;
      const inCard=!!button.closest('.gw-card');
      if(state.member!=='you' || owner.member!=='you'){announce('This view is read-only.',true);return;}
      const settings=owner.widgets[kind] ||= {};
      if(action==='pin-widget')settings.pinned=!settings.pinned;else settings.removed=true;
      owner.widgetIndex=0;
      savePane();renderGrid();
      if(current()===owner)renderBody();
      if(action==='pin-widget'){
        const scope=inCard?$(`[data-thread="${owner.id}"]`):$('.gw-body');
        $(`[data-g="pin-widget"][data-kind="${kind}"]`,scope)?.focus();
      }
      announce(action==='trash-widget'?`${widgetNames[kind]} widget removed. Its underlying content is unchanged.`:`${widgetNames[kind]} widget ${settings.pinned?'pinned first':'unpinned'}.`);
      return;
    }
    if(action==='mobile-view'){mobileView(Number(button.dataset.index));return;}
    if(action==='new-project'){$('.gw-new-project').hidden=false;$('.gw-new-project input').focus();return;}
    if(action==='cancel-project'){$('.gw-new-project').hidden=true;return;}
    if(action==='top'){savePane();state.top=true;state.active=null;renderShell();return;}
    if(action==='existing-project'){state.top=false;state.project.name=button.dataset.name;renderShell();return;}
    if(action==='search'){$('.gw-header').classList.add('gw-header-expanded');$('.gw-search').focus();return;}
    if(action==='member'){savePane();state.member=id;renderGrid();renderPane();return;}
    if(action==='older'){state.showOlder=!state.showOlder;renderGrid();return;}
    if(action==='carousel'){
      const card=button.closest('.gw-card'),carousel=$('.gw-carousel',card),t=state.threads.find(t=>t.id===id);
      t.widgetIndex=button.dataset.index===undefined?(t.widgetIndex+Number(button.dataset.dir)+carousel.children.length)%carousel.children.length:Number(button.dataset.index);
      carousel.scrollTo({left:carousel.clientWidth*t.widgetIndex,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      return;
    }
    if(['card-answer','answer','validation'].includes(action)){
      answerQuestion(id==='project'?state.project:state.threads.find(t=>t.id===id),action,button.textContent);return;
    }
    if(action==='thread-artifact'){
      open(id);const file=getFile(button.dataset.file);current().imageId=file.id;
      selectTab(file.kind==='image'?'gallery':file.id);return;
    }
    if(!event.target.closest('.gw-add-menu,[data-g="add"]') && $('.gw-add-menu'))$('.gw-add-menu').hidden=true;
    if(!event.target.closest('.gw-more-float,.gw-more') && $('.gw-more-float'))$('.gw-more-float').hidden=true;
    if(['attach','upload','paste','new-file','promote','project-artifact','edit-description','remove-pending'].includes(action) && readonly()){announce('This view is read-only.',true);return;}
    if(action==='edit-description'){current().editingDescription=true;current().descriptionDraft=current().description;renderBody();$('.gw-description-editor textarea').focus();return;}
    if(action==='project-artifact'){
      const file=getFile(id),promoted=state.project.artifacts.includes(file);
      if(promoted)state.project.artifacts=state.project.artifacts.filter(f=>f!==file);
      else state.project.artifacts.push(file);
      if(current().id==='project' && promoted)current().tab='work';
      renderTabs();renderBody();
      announce(promoted?'Project reference removed. The Thread Artifact is unchanged.':'Project and Thread now reference the same Artifact. No copy was created.');
      return;
    }
    if(action==='cancel-thread'){
      const thread=state.threads.find(t=>t.id===id);
      if(!thread?.isNew || readonly(thread)){announce('Only your unsubmitted Threads can be cancelled.',true);return;}
      for(const file of thread.pending)if(objectUrls.has(file.url)){URL.revokeObjectURL(file.url);objectUrls.delete(file.url);}
      state.threads=state.threads.filter(t=>t!==thread);
      if(state.lastThread===id)state.lastThread=state.threads.find(t=>!t.isNew)?.id;
      if(state.active===id){state.active=null;state.mobileView=1;}
      renderGrid();renderPane();
      $('.gw-new-thread').focus({preventScroll:true});
      announce('New Thread cancelled. Nothing was submitted.');
      return;
    }
    if(action==='thread')open(id);
    if(action==='project'){
      state.projectPeek=false;
      open('project');
    }
    if(action==='tab')selectTab(id);
    if(action==='filter') {state.filter=button.dataset.value;renderGrid();positionPane();}
    if(action==='sleep') {const t=state.threads.find(t=>t.id===id);t.sleeping=!t.sleeping;renderGrid();positionPane();}
    if(action==='new-thread') {
      if(state.member!=='you'){announce('Switch to your own view to create a Thread.',true);return;}
      savePane();state.active=null;state.mobileView=1;
      const thread=subject(`thread-${++serial}`,'','',{question:false,isNew:true});
      state.threads.unshift(thread);state.filter='Recent';state.query='';renderGrid();renderPane();
      $('.gw-grid').scrollTop=0;$('.gw-thread-editor textarea').focus();
    }
    if(action==='file') {
      const file=getFile(id);current().imageId=id;selectTab(file.kind==='image'?'gallery':id);
    }
    if(action==='attachment')selectTab(id);
    if(action==='image'){current().imageId=id;if(state.member==='you')getFile(id).unread=false;renderBody();renderGrid();}
    if(action==='expand'){state.full=!state.full;positionPane();renderTabs();renderBody();}
    if(action==='add') {
      $('.gw-more-float').hidden=true;
      $('.gw-add-menu').hidden=!$('.gw-add-menu').hidden;
      $('.gw-add').setAttribute('aria-expanded',String(!$('.gw-add-menu').hidden));
    }
    if(action==='upload')$('.gw-file-input').click();
    if(action==='paste' || action==='new-file')fileEditor(action==='paste'?'paste':'new');
    if(action==='cancel-editor'){current().editor=null;renderBody();}
    if(action==='promote'){
      const file=getFile(id);
      if(!current().artifacts.some(f=>f.id===id))current().artifacts.unshift({...file,unread:true,fresh:true});
      current().sleeping=false;current().older=false;
      renderTabs();renderBody();renderGrid();announce(`${file.name} saved as an Artifact. The original stays attached to its Comment.`);
    }
    if(['remove-repo','invite'].includes(action) && readonly()){announce('This view is read-only.',true);return;}
    if(action==='remove-repo'){current().repos=current().repos.filter(url=>url!==button.dataset.url);renderBody();}
    if(action==='invite'){$('.gw-invite-form').hidden=false;$('.gw-invite-form input').focus();}
  });
  root.addEventListener('input',event=>{
    const el=event.target;
    if(el.matches('.gw-search')) {state.query=el.value;renderGrid();positionPane();}
    if(el.matches('.gw-composer textarea')){
      const owner=composerOwner(el.closest('form'));owner.draft=el.value;
      all('.gw-composer').filter(form=>form.dataset.owner===owner.id).forEach(form=>{
        const other=$('textarea',form);if(other!==el)other.value=owner.draft;
      });
    }
    if(el.closest('.gw-artifact-editor'))current().editor[el.name]=el.value;
    if(el.closest('.gw-description-editor'))current().descriptionDraft=el.value;
    if(el.closest('.gw-answer-form')){
      const id=el.closest('form').dataset.owner,owner=id==='project'?state.project:state.threads.find(t=>t.id===id);
      owner.questionDraft=el.value;
    }
    if(el.closest('.gw-thread-editor') && el.matches('[name="name"],[name="description"]')){
      const form=el.closest('form'),thread=state.threads.find(t=>t.id===form.dataset.id);
      thread[el.name]=el.value;
      form.querySelector('[type="submit"]').disabled=!thread.description.trim();
    }
    if(el.matches('.gw-more-search,.gw-list-search')) {
      const target=el.matches('.gw-more-search')?$('.gw-more-float .gw-file-list'):$('.gw-body .gw-file-list');
      target.outerHTML=fileList(current().artifacts.filter(f=>f.name.toLowerCase().includes(el.value.toLowerCase())));
    }
  });
  root.addEventListener('change',event=>{
    const el=event.target;
    if(el.matches('.gw-reduce-motion'))$('.gw-shell').classList.toggle('gw-no-motion',el.checked);
    if(el.matches('.gw-file-input,.gw-comment-input')) {
      const attachment=el.matches('.gw-comment-input'),owner=attachment?composerOwner(el.closest('form')):current();
      if(readonly(owner)){el.value='';announce('This view is read-only.',true);return;}
      void readFiles([...el.files],owner,attachment);el.value='';
      if($('.gw-add-menu'))$('.gw-add-menu').hidden=true;
    }
  });
  root.addEventListener('paste',event=>{
    if(!event.target.matches('.gw-composer textarea,.gw-thread-editor textarea,.gw-artifact-editor textarea,.gw-dropzone'))return;
    const attachment=event.target.matches('.gw-composer textarea,.gw-thread-editor textarea'),owner=attachment?composerOwner(event.target.closest('form')):current();
    if(readonly(owner))return;
    const files=[...event.clipboardData.files];
    if(files.length) {event.preventDefault();void readFiles(files,owner,attachment);}
  });
  root.addEventListener('dragover',event=>{if(event.target.closest('.gw-dropzone'))event.preventDefault();});
  root.addEventListener('drop',event=>{
    if(!event.target.closest('.gw-dropzone'))return;
    event.preventDefault();
    if(readonly()){announce('This view is read-only.',true);return;}
    void readFiles([...event.dataTransfer.files],current(),false);
  });
  root.addEventListener('submit',event=>{
    event.preventDefault();
    const form=event.target,owner=form.matches('.gw-composer,.gw-thread-editor')?composerOwner(form):current();
    if(form.matches('.gw-answer-form')){
      const id=form.dataset.owner;
      answerQuestion(id==='project'?state.project:state.threads.find(t=>t.id===id),form.dataset.actionKind,form.elements.answer.value.trim());return;
    }
    if(readonly(owner)){announce('This view is read-only.',true);return;}
    if(form.matches('.gw-description-editor')){
      const text=form.elements.description.value.trim();
      if(!text){announce('A description cannot be empty.',true);return;}
      owner.description=text;owner.editingDescription=false;renderBody();announce('Project description updated.');return;
    }
    if(form.matches('.gw-new-project')) {
      const name=form.elements.name.value.trim(),description=form.elements.description.value.trim();
      if(!name || !description){announce('Give the Project a name and description.',true);return;}
      reset('empty');state.project.name=name;state.project.description=description;renderShell();return;
    }
    if(form.matches('.gw-thread-editor')){
      const t=state.threads.find(t=>t.id===form.dataset.id);
      t.description=form.elements.description.value.trim();
      if(!t.description){announce('Describe what you want to work on.',true);return;}
      t.name=form.elements.name.value.trim() || t.description.slice(0,65);t.isNew=false;t.widgetIndex=0;
      t.comments.push({id:`c${++serial}`,author:'You',text:t.description,attachments:t.pending});t.pending=[];
      renderGrid();announce('Thread created. Its first checklist is ready to shape.');return;
    }
    if(form.matches('.gw-repo-form')){
      const url=form.elements.url.value.trim();
      if(!/^https?:\/\/|^ssh:\/\//.test(url)){announce('Enter an HTTP(S) or SSH repository URL.',true);return;}
      if(!owner.repos.includes(url))owner.repos.push(url);renderBody();announce('Repository reference attached locally.');return;
    }
    if(form.matches('.gw-invite-form')){owner.invited=form.elements.email.value;renderBody();announce('Example invitation recorded locally; no email was sent.');return;}
    if(form.matches('.gw-intent')) {
      owner.phase='setup';
      owner.comments.push({id:`c${++serial}`,author:'Facilitator',text:'Add a repo by URL so I can understand the code this project will work with. You can invite teammates now or later.',attachments:[]});
      renderBody();announce('Project setup started. Answer the validation Question and connect a repository.');
    }
    if(form.matches('.gw-composer')) {
      const text=form.elements.comment.value.trim();
      if(!text && !owner.pending.length){announce('Write a Comment or attach a file before posting.',true);return;}
      owner.comments.push({id:`c${++serial}`,author:'You',text,attachments:owner.pending});
      owner.pending=[];owner.draft='';owner.incomplete=true;owner.sleeping=false;owner.older=false;
      if(owner.name==='New Thread' && text)owner.name=text.slice(0,65);
      if(current()===owner)renderPane();
      renderGrid();
      if(form.classList.contains('gw-card-composer'))$(`[data-thread="${owner.id}"] .gw-slide[data-slide="${owner.widgetIndex}"] .gw-composer textarea`)?.focus({preventScroll:true});
      announce(`Comment posted to this ${owner.id==='project'?'Project':'Thread'} locally. In Workbench, this steers its agents; this demo does not contact agents.`);
    }
    if(form.matches('.gw-artifact-editor')) {
      const name=form.elements.name.value.trim(),text=form.elements.content.value;
      if(!name || !text.trim()){announce('Give the Artifact a name and some content.',true);return;}
      owner.artifacts.unshift({...doc(name,text),unread:true,fresh:true});
      owner.sleeping=false;owner.older=false;
      owner.editor=null;
      renderTabs();renderBody();renderGrid();announce(`${name} added as an Artifact. Your selected tab is unchanged.`);
    }
  });
  let hoverTimer,moreTimer;
  const leaveMore=()=>{
    clearTimeout(moreTimer);
    moreTimer=setTimeout(()=>{
      if(!$('.gw-more-float')?.matches(':hover,:focus-within') && !$('.gw-more')?.matches(':hover,:focus-visible'))$('.gw-more-float')?.setAttribute('hidden','');
    },180);
  };
  root.addEventListener('pointerover',event=>{
    if(event.pointerType==='touch')return;
    const more=event.target.closest('.gw-more');
    if(more && !more.contains(event.relatedTarget)) {
      const popup=$('.gw-more-float');
      if(popup){popup.innerHTML=`<label>All Artifacts<input type="search" class="gw-more-search" aria-label="Search all Artifacts" placeholder="Find an Artifact"></label>${fileList(current().artifacts,'hover')}`;popup.hidden=false;}
    }
    if(event.target.closest('.gw-more,.gw-more-float'))clearTimeout(moreTimer);
    if(event.target.closest('.gw-more,.gw-more-float,.gw-detail,.gw-project-return'))clearTimeout(hoverTimer);
    if(event.target.closest('.gw-collapsed .gw-project-toggle,.gw-project-return'))hoverTimer=setTimeout(()=>{open('project',false);state.projectPeek=true;},350);
  });
  root.addEventListener('pointerout',event=>{
    if(event.target.closest('.gw-more,.gw-more-float'))leaveMore();
    if(!event.target.closest('.gw-more,.gw-more-float,.gw-detail,.gw-project-return'))return;
    clearTimeout(hoverTimer);
    hoverTimer=setTimeout(()=>{
      if(state.projectPeek && !$('.gw-detail').matches(':hover,:focus-within')){state.projectPeek=false;close();}
    },180);
  });
  root.addEventListener('focusin',event=>{
    if(event.target.matches('.gw-more') && current().tab!=='more')$('.gw-more-float').hidden=false;
  });
  root.addEventListener('focusout',event=>{
    if(event.target.closest('.gw-more,.gw-more-float'))leaveMore();
  });
  window.addEventListener('blur',()=>{
    clearTimeout(hoverTimer);clearTimeout(moreTimer);
    $('.gw-more-float')?.setAttribute('hidden','');
  });
  root.addEventListener('pointerdown',event=>{if(state.projectPeek && event.target.closest('.gw-detail'))state.projectPeek=false;});
  document.addEventListener('keydown',event=>{
    if(root.contains(event.target) && event.target.matches('[role="tab"]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();
      const tabs=all('.gw-tabs [role="tab"]'),i=tabs.indexOf(event.target);
      const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      const id=tabs[next].dataset.id;selectTab(id);$(`.gw-tabs [data-id="${id}"]`).focus();return;
    }
    if(event.key!=='Escape' || !root.contains(document.activeElement))return;
    if(event.target.closest('.gw-description-editor')){current().editingDescription=false;renderBody();return;}
    if($('.gw-more-float') && !$('.gw-more-float').hidden) {$('.gw-more-float').hidden=true;return;}
    if($('.gw-add-menu') && !$('.gw-add-menu').hidden){$('.gw-add-menu').hidden=true;return;}
    if($('.gw-header').classList.contains('gw-header-expanded')){$('.gw-header').classList.remove('gw-header-expanded');$('.gw-new-thread')?.focus();return;}
    close();
  });
  root.addEventListener('scroll',event=>{
    if(event.target.matches('.gw-grid'))positionPane();
    if(event.target.matches('.gw-carousel')){
      const el=event.target,t=state.threads.find(t=>t.id===el.closest('[data-thread]').dataset.thread);
      t.widgetIndex=Math.round(el.scrollLeft/el.clientWidth);
      all('.gw-carousel-dot',el.closest('.gw-card')).forEach((dot,i)=>dot.setAttribute('aria-current',String(i===t.widgetIndex)));
    }
  },true);
  let lastWidth;
  new ResizeObserver(()=>{
    if(root.clientWidth===lastWidth)return;
    lastWidth=root.clientWidth;syncMobile();positionPane();if(!state.top)renderTabs();
    all('.gw-carousel').forEach(el=>{const t=state.threads.find(t=>t.id===el.closest('[data-thread]').dataset.thread);el.scrollLeft=el.clientWidth*t.widgetIndex;});
  }).observe(root);
  let swipe;
  root.addEventListener('touchstart',event=>{
    if(!mobile() || event.target.closest('input,textarea,.gw-carousel,.gw-tabs,.gw-people,.gw-header'))return;
    const touch=event.touches[0];swipe={x:touch.clientX,y:touch.clientY};
  },{passive:true});
  root.addEventListener('touchend',event=>{
    if(!swipe)return;
    const touch=event.changedTouches[0],dx=touch.clientX-swipe.x,dy=touch.clientY-swipe.y;swipe=null;
    if(Math.abs(dx)>60 && Math.abs(dy)<40)mobileView(Math.max(0,Math.min(2,state.mobileView+(dx<0?1:-1))));
  },{passive:true});
  root.addEventListener('touchcancel',()=>swipe=null,{passive:true});
  reset();
  }
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      observer.unobserve(entry.target);
      initializeWorkspace(entry.target);
    }
  },{rootMargin:'250px 0px'});
  document.querySelectorAll('[data-grid-mode]').forEach(root=>observer.observe(root));
  const redirectHistory=()=>{
    if(/^#(?:step-\d+|layout|features|mobile|thread-focus|earlier-concept)$/.test(location.hash))location.replace(`workbench-earlier.html${location.hash}`);
  };
  window.addEventListener('hashchange',redirectHistory);
  redirectHistory();
});
