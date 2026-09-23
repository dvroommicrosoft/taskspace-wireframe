/* In-memory UI study. Local files never leave this browser tab. */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#grid-workbench');
  const $ = (selector, scope = root) => scope.querySelector(selector);
  const all = (selector, scope = root) => [...scope.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => WorkbenchConcept.glyph(name);
  const svg = body => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const clip = svg('<path d="m8 13 7-7a3 3 0 0 1 4 4l-9 9a5 5 0 0 1-7-7L13 2"/><path d="m6 15 8-8"/>');
  const plus = svg('<path d="M12 4v16M4 12h16"/>');
  let serial = 0;
  const objectUrls = new Set();
  const image = (name, color) => ({
    id:`f${++serial}`,name,kind:'image',unread:false,
    url:`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480"><rect width="800" height="480" fill="#15191d"/><rect x="35" y="35" width="730" height="45" rx="8" fill="#242c30"/><rect x="35" y="110" width="225" height="300" rx="12" fill="#242c30"/><rect x="285" y="110" width="480" height="300" rx="12" fill="#1c2328"/><rect x="315" y="160" width="240" height="14" rx="5" fill="${color}"/><rect x="315" y="200" width="400" height="8" fill="#414b50"/><rect x="315" y="225" width="350" height="8" fill="#414b50"/><rect x="315" y="295" width="150" height="42" rx="8" fill="${color}"/><text x="52" y="65" fill="#eff2f4" font-family="system-ui" font-size="18">${name}</text></svg>`)}`
  });
  const doc = (name, text) => ({id:`f${++serial}`,name,kind:'text',text,unread:false});
  const subject = (id, name, description, extra = {}) => ({
    id,name,description,tab:'work',draft:'',pending:[],comments:[],artifacts:[],scroll:{},incomplete:true,unread:false,sleeping:false,member:'you',question:true,...extra
  });
  let state;
  function reset(empty = false, preservedProject = null) {
    if(!preservedProject) {
      for (const url of objectUrls) URL.revokeObjectURL(url);
      objectUrls.clear();
    }
    const project=subject('project','On Deck evolution','A quieter workspace for human intent and agent-led work.',{
      artifacts:[doc('project-brief.md','# A calm place to work\n\nKeep artifacts in the foreground. Let agents move the work forward without demanding constant attention.'),image('workspace-reference.svg','#b6ff57')],
      comments:[{id:`c${++serial}`,author:'Facilitator',text:'Project context belongs here. Individual work opens from the grid.',attachments:[doc('onboarding-notes.md','Context collected during onboarding. Review and curate only the parts worth keeping.')]}]
    });
    const names=['Design the first-run experience','Research table foundations','Ship the first-run improvements','Audit keyboard accessibility','Explore the project UX','Maintain and prune tests','Find dead code','Polish empty states','Explore offline support'];
    const threads=empty ? [] : names.map((name,i)=>subject(`thread-${i}`,name,[
      'Make project setup feel like beginning the work.','Compare accessible, headless table primitives.','Review the effect of a quieter beginning.',
      'Check focus order and keyboard navigation.','Walk key journeys and record opportunities.','Keep the test suite focused and useful.',
      'Identify unused paths and propose removals.','Keep the interface calm when there is nothing to show.','Keep recent context available without a connection.'
    ][i],{member:i===3?'mira':i===7?'theo':'you',incomplete:![2,7].includes(i),unread:[1,2,4].includes(i),scheduled:[4,5,6].includes(i),question:i===0,
      artifacts:[
        doc('plan.md',`# ${name}\n\nRead the shared Project context.\n\n## Approach\n\nKeep the change small and reviewable. Preserve the user's place and drafts.\n\n## Validation\n\nCover keyboard, mobile, and artifact navigation before review.`),
        doc('research.md','# Research notes\n\nCompare the existing behavior with a focused prototype. Document the tradeoffs rather than committing to a framework too early.'),
        image('button-study.svg','#b6ff57'),image('alternate-layout.svg','#d8be7a'),
        doc('validation.md','# Validation\n\n- Keyboard navigation\n- Mobile layout\n- Draft preservation\n- Artifact ownership'),
        doc('changes.md','# Changes\n\nImplementation: +150 / -38\n\nVerification: +36 / -4'),
        doc('review.md','# Review\n\nKeep Project context visually distinct from individual Threads.')
      ],
      comments:[
        {id:`c${++serial}`,author:'You',text:'Use this reference as context, not a pixel-perfect requirement.',attachments:[image('comment-reference.svg','#7d9eda')]},
        {id:`c${++serial}`,author:'Thread agent',text:'I have gathered the initial notes. Save them as an Artifact if they should become part of the curated work.',attachments:[doc('session-notes.md','# Session notes\n\nThe grid helps monitoring. Details should preserve focus and drafts.')]}
      ]
    }));
    state={project:preservedProject || project,threads,active:empty?'project':null,filter:'Recent',member:'all',query:'',full:false,agent:false};
    renderShell();
  }
  const current = () => state.active==='project' ? state.project : state.threads.find(t=>t.id===state.active);
  const readonly = () => state.member!=='all' && state.member!=='you' || current()?.member!=='you';
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
        <header class="gw-header"><img src="workbench-logo.svg" alt="Workbench">${icon(state.project.name)}<strong>${escape(state.project.name)}</strong><span class="gw-monitor-label">Thread monitor</span><button data-g="agent" class="gw-agent-toggle">Agent</button></header>
        <div class="gw-toolbar"><div role="group" aria-label="Thread filters">${['Recent','Scheduled','Incomplete','Sleeping'].map(name=>`<button data-g="filter" data-value="${name}" aria-pressed="${state.filter===name}">${name}</button>`).join('')}</div><input class="gw-search" type="search" placeholder="Search Threads" aria-label="Search Threads"><select class="gw-member" aria-label="Filter by member"><option value="all">All members</option><option value="you">You</option><option value="mira">Mira · read-only view</option><option value="theo">Theo · read-only view</option></select><button data-g="new-thread" aria-label="Create a Thread">${plus}</button></div>
        <div class="gw-grid" aria-label="Project Threads"></div>
        <section class="gw-detail" role="dialog" aria-label="Work details" hidden></section>
        <div class="gw-checklist-float" popover="manual" role="dialog" aria-label="Thread checklist preview"></div>
        <aside class="gw-agent" aria-label="Private Agent Channel" hidden></aside>
        <div class="gw-dock-zone"><div class="gw-project-peek" hidden></div><button class="gw-project-dock" data-g="project" aria-expanded="false">${icon(state.project.name)}<span><small>PROJECT CONTEXT</small><strong>${escape(state.project.name)}</strong></span><span class="gw-project-count">${state.project.artifacts.length} Artifacts</span><span aria-hidden="true">⌃</span></button></div>
        <div class="gw-notice" role="status" aria-live="polite"></div>
      </div>`;
    renderGrid();
    renderPane();
  }
  function renderGrid() {
    const ownView=state.member==='all' || state.member==='you';
    const threads=state.threads.filter(t=>(state.member==='all' || t.member===state.member) && `${t.name} ${t.description}`.toLowerCase().includes(state.query.toLowerCase()) && (state.filter==='Sleeping' ? ownView && t.sleeping : !(ownView && t.sleeping) && (state.filter==='Incomplete' ? t.incomplete : state.filter==='Scheduled' ? t.scheduled : true)));
    $('.gw-shell').classList.toggle('gw-viewing-other',!ownView);
    $('.gw-grid').innerHTML=threads.map(t=>`<article class="gw-card ${t.unread?'unread':''} ${!t.incomplete?'complete':''} ${state.active===t.id?'selected':''}" data-thread="${t.id}">
      <div class="gw-card-heading">${icon(t.name)}<button data-g="thread" data-id="${t.id}" class="gw-thread-name">${escape(t.name)}</button><button data-g="sleep" data-id="${t.id}" aria-label="${t.sleeping?'Wake':'Sleep'} ${escape(t.name)}"${state.member!=='all' && state.member!=='you'?' disabled':''}>${t.sleeping?'☀':'☾'}</button></div>
      <p>${escape(t.description)}</p><div class="gw-card-signal"><span>${t.unread?'● Unread · ':''}${t.incomplete?'Incomplete work':'No incomplete work'}</span><span>${t.member==='you'?'You':t.member==='mira'?'Mira':'Theo'}</span></div>
      <details class="gw-card-checklist"${t.checklistOpen?' open':''}><summary aria-label="Preview or expand checklist for ${escape(t.name)}">${t.incomplete?'Checklist · 1 / 4':'Impact +186 / −42 · 4 / 4'}<span>⌄</span></summary>${WorkbenchConcept.checklist({complete:!t.incomplete,ready:true})}</details>
      <div class="gw-card-footer"><span>${t.artifacts.length} Artifacts</span><span>${t.scheduled?'Weekly · 09:00':t.question?'Question waiting':t.incomplete?'Updated 1h ago':'Updated 3h ago'}</span></div>
    </article>`).join('') || `<div class="gw-empty"><h3>${state.threads.length?'No matching Threads':'Start with the Project, not an empty backlog.'}</h3><p>${state.threads.length?'Try another filter or search.':'Describe the intent and add some context in the Project pane below.'}</p>${state.threads.length?'':'<button data-g="project">Open Project context</button>'}</div>`;
    all('[data-g="filter"]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.value===state.filter)));
  }
  function savePane() {
    const owner=current();
    if (owner && $('.gw-body')) owner.scroll[owner.tab]=$('.gw-body').scrollTop;
  }
  function open(id, focus = true) {
    savePane();
    $('.gw-checklist-float').hidePopover();
    state.active=id;state.full=false;state.agent=false;
    if(state.member==='all' || state.member==='you') current().unread=false;
    renderGrid();renderPane();
    if(focus) $('.gw-detail-heading').focus({preventScroll:true});
  }
  function close() {
    const previous=state.active;
    savePane();state.active=null;state.full=false;state.agent=false;
    $('.gw-checklist-float').hidePopover();
    renderGrid();renderPane();
    const target=previous==='project' ? $('.gw-project-dock') : $(`[data-g="thread"][data-id="${previous}"]`);
    target?.focus({preventScroll:true});
  }
  function fileList(files, context='all') {
    return `<div class="gw-file-list" data-list="${context}">${files.map(f=>`<button data-g="file" data-id="${f.id}"><span>${f.kind==='image'?'▧':'▤'} ${escape(f.name)}</span><small>${f.unread?'New · ':''}${f.kind==='image'?'Gallery':'Artifact'}</small></button>`).join('') || '<p>No Artifacts yet. Use + to upload, paste, or create one.</p>'}</div>`;
  }
  function renderTabs() {
    const owner=current();if(!owner)return;
    const width=$('.gw-detail').clientWidth || 540;
    const slots=Math.max(0,Math.floor((width-260)/125));
    const docs=owner.artifacts.filter(f=>f.kind!=='image'),visible=docs.slice(0,slots);
    const selected=docs.find(f=>f.id===owner.tab);
    if(selected && slots && !visible.includes(selected))visible[visible.length-1]=selected;
    const tabs=[['work','Work'],...visible.map(f=>[f.id,f.name])];
    if(owner.artifacts.some(f=>f.kind==='image')) tabs.push(['gallery','Gallery']);
    tabs.push(['more',`More${owner.artifacts.some(f=>f.unread)?' •':''}`]);
    $('.gw-tabs').innerHTML=`<div role="tablist" aria-label="Work and Artifact tabs">${tabs.map(([id,label])=>`<button role="tab" data-g="tab" data-id="${id}" aria-selected="${owner.tab===id}"${id==='more'?' class="gw-more"':''}>${escape(label)}</button>`).join('')}</div><button data-g="add" class="gw-add" aria-expanded="false" aria-label="Add Artifact: upload files, paste content, or create a new document"${readonly()?' disabled':''}>${plus}</button>`;
  }
  function renderPane() {
    const pane=$('.gw-detail'),owner=current();
    pane.hidden=!owner;
    $('.gw-project-dock').setAttribute('aria-expanded',String(state.active==='project'));
    $('.gw-project-count').textContent=`${state.project.artifacts.length} Artifacts`;
    $('.gw-project-peek').hidden=true;
    $('.gw-agent').hidden=true;
    if(!owner)return;
    pane.setAttribute('aria-label',`${owner.id==='project'?'Project':'Thread'} details: ${owner.name}`);
    const locked=readonly();
    pane.className=`gw-detail ${owner.id==='project'?'gw-project-detail':'gw-thread-detail'}${state.full?' gw-full':''}`;
    pane.innerHTML=`<header class="gw-detail-header"><div>${icon(owner.name)}<div><small>${owner.id==='project'?'PROJECT CONTEXT':'THREAD · '+escape(state.project.name)}</small><h3 class="gw-detail-heading" tabindex="-1">${escape(owner.name)}</h3></div></div><button data-g="close" aria-label="Close details; keep draft and selected tab">×</button></header>
      ${locked?'<div class="gw-readonly">Read-only · switch to your own view to edit your assigned work.</div>':''}
      <nav class="gw-tabs"></nav><div class="gw-add-menu" hidden><button data-g="upload">Upload files</button><button data-g="paste">Paste content</button><button data-g="new-file">New document</button></div>
      <div class="gw-more-float" hidden><label>All Artifacts<input type="search" class="gw-more-search" aria-label="Search all Artifacts" placeholder="Find an Artifact"></label>${fileList(owner.artifacts,'hover')}</div>
      <div class="gw-body"></div><input type="file" class="gw-file-input" multiple hidden><input type="file" class="gw-comment-input" multiple hidden>`;
    positionPane();renderTabs();renderBody();
    $('.gw-body').scrollTop=owner.scroll[owner.tab] || 0;
  }
  function commentMarkup(comment) {
    const owner=current();
    return `<article class="gw-comment"><strong>${escape(comment.author)}</strong><div>${markdown(comment.text)}</div><div class="gw-comment-files">${comment.attachments.map(f=>`<div><button data-g="attachment" data-id="${f.id}">${f.kind==='image'?`<img src="${escape(f.url)}" alt="">`:'▤'}<span>${escape(f.name)}</span></button><button data-g="promote" data-id="${f.id}" aria-label="Save ${escape(f.name)} as a curated Artifact"${readonly() || owner.artifacts.some(a=>a.id===f.id)?' disabled':''}>${owner.artifacts.some(a=>a.id===f.id)?'Saved as Artifact':'Save as Artifact'}</button></div>`).join('')}</div></article>`;
  }
  function renderBody() {
    const owner=current(),body=$('.gw-body'),locked=readonly();
    if(owner.editor) {renderEditor();return;}
    if(owner.tab==='work') {
      body.innerHTML=`<p class="gw-description">${escape(owner.description)}</p>
        ${!state.threads.length && owner.id==='project'?`<form class="gw-intent"><label>Project description<textarea name="description">${escape(owner.description)}</textarea></label><button class="primary" type="submit">Get Started</button></form>`:''}
        ${owner.id==='project'?'<div class="gw-project-summary"><strong>Shared across Threads</strong><p>Project intent, repository configuration, shared decisions, and curated Project Artifacts live here.</p><details><summary>Project controls</summary><p>Repository · workbench/product</p><p>Completion · merged PR</p><p>Validation · tests, CI, and review</p></details></div>':''}
        ${owner.question && owner.id!=='project'?`<section class="gw-question"><strong>Question for you</strong><p>Who should this first-run flow serve first?</p><button data-g="answer"${locked?' disabled':''}>First-time solo users</button><button data-g="answer"${locked?' disabled':''}>An existing team</button></section>`:''}
        ${owner.id!=='project'?`<details class="gw-work-checklist" open><summary>${owner.incomplete?'Planning checklist':'Completed checklist · +186 / −42'}</summary>${WorkbenchConcept.checklist({complete:!owner.incomplete,ready:true})}</details>`:''}
        <section class="gw-comments"><h4>Comments <small>Attachments stay with their message</small></h4>${owner.comments.map(commentMarkup).join('')}</section>
        <form class="gw-composer"><label>New Comment<textarea name="comment" placeholder="Write an instruction, or paste an image or file..."${locked?' disabled':''}>${escape(owner.draft)}</textarea></label><div class="gw-pending"></div><div class="gw-compose-actions"><button type="button" data-g="attach" aria-label="Attach files to this Comment; pasted images and files work too"${locked?' disabled':''}>${clip}<span>Attach</span></button><span>Shared · You</span><button type="submit" class="primary"${locked?' disabled':''}>Post Comment</button></div></form>`;
      renderPending();
    } else if(owner.tab==='more') {
      body.innerHTML=`<div class="gw-file-heading"><h4>All Artifacts · ${owner.artifacts.length}</h4><button data-g="add">+ Add Artifact</button></div><label>Find an Artifact<input type="search" class="gw-list-search" placeholder="Search files and images"></label>${fileList(owner.artifacts)}`;
    } else if(owner.tab==='gallery') {
      const images=owner.artifacts.filter(f=>f.kind==='image');
      const selected=images.find(f=>f.id===owner.imageId) || images[0];
      body.innerHTML=`<div class="gw-file-heading"><h4>Gallery · ${images.length} images</h4><button data-g="expand">${state.full?'Restore pane':'Expand'}</button></div>${selected?`<figure class="gw-gallery-view"><img src="${escape(selected.url)}" alt="${escape(selected.name)}"><figcaption>${escape(selected.name)}</figcaption></figure><div class="gw-gallery">${images.map(f=>`<button data-g="image" data-id="${f.id}" aria-label="View ${escape(f.name)}" aria-pressed="${f.id===selected.id}"><img src="${escape(f.url)}" alt=""><span>${escape(f.name)}</span></button>`).join('')}</div>`:'<p>No images yet.</p>'}`;
    } else {
      const file=getFile(owner.tab);
      if(!file) {announce('This file is no longer available.',true);owner.tab='more';renderTabs();renderBody();return;}
      const attachment=!owner.artifacts.some(f=>f.id===file.id);
      body.innerHTML=`<div class="gw-file-heading"><div><small>${attachment?'COMMENT ATTACHMENT':'ARTIFACT'}</small><h4>${escape(file.name)}</h4></div><button data-g="expand">${state.full?'Restore pane':'Expand'}</button></div>${file.kind==='image'?`<img class="gw-file-image" src="${escape(file.url)}" alt="${escape(file.name)}">`:file.kind==='text'?`<div class="gw-document">${markdown(file.text)}</div>`:`<p>No inline viewer for this file type. ${escape(file.size || 0)} bytes are held locally in this tab.</p>`}`;
    }
  }
  function renderPending() {
    const target=$('.gw-pending');
    if(target)target.innerHTML=current().pending.map(f=>`<span>${escape(f.name)}<button type="button" data-g="remove-pending" data-id="${f.id}" aria-label="Remove ${escape(f.name)} from the draft">×</button></span>`).join('');
  }
  function positionPane() {
    const pane=$('.gw-detail');if(pane.hidden)return;
    pane.classList.toggle('gw-full',state.full);
    const shell=$('.gw-shell'),width=shell.clientWidth,height=shell.clientHeight;
    const owner=current();
    if(width<700 || state.full) {Object.assign(pane.style,{left:'8px',top:'8px',width:`${width-16}px`,height:`${height-16}px`});return;}
    const paneWidth=Math.min(620,width-48),paneHeight=height-210;
    if(owner.id==='project') {Object.assign(pane.style,{left:`${(width-paneWidth)/2}px`,top:`${height-paneHeight-80}px`,width:`${paneWidth}px`,height:`${paneHeight}px`});return;}
    const card=$(`[data-thread="${owner.id}"]`),frame=shell.getBoundingClientRect(),rect=card?.getBoundingClientRect();
    if(!rect) {Object.assign(pane.style,{left:`${(width-paneWidth)/2}px`,top:'100px',width:`${paneWidth}px`,height:`${paneHeight}px`});return;}
    const rightSpace=width-(rect.right-frame.left)-16,leftSpace=rect.left-frame.left-16;
    const right=rightSpace>=360 && (rightSpace>=leftSpace || leftSpace<360);
    const space=right?rightSpace:leftSpace;
    const actualWidth=space>=360?Math.min(paneWidth,space):paneWidth;
    const x=space>=360?(right?rect.right-frame.left+10:rect.left-frame.left-actualWidth-10):(width-actualWidth)/2;
    const y=Math.max(124,Math.min(rect.top-frame.top,height-paneHeight-26));
    Object.assign(pane.style,{left:`${x}px`,top:`${y}px`,width:`${actualWidth}px`,height:`${paneHeight}px`});
  }
  function selectTab(id) {
    savePane();current().tab=id;
    current().editor=null;
    if(id==='gallery') current().artifacts.filter(f=>f.kind==='image').forEach(f=>f.unread=false);
    const file=getFile(id);if(file)file.unread=false;
    $('.gw-more-float').hidden=true;$('.gw-add-menu').hidden=true;
    renderTabs();renderBody();$('.gw-body').scrollTop=current().scroll[id] || 0;
    ($(`.gw-tabs [data-id="${id}"]`) || $('.gw-detail-heading')).focus({preventScroll:true});
  }
  async function readFiles(files, owner, attachment) {
    const workspace=state;
    const results=[];
    const failures=[];
    for(const file of files) {
      if(file.size>10*1024*1024) {failures.push(`${file.name} exceeds this local study's 10 MB file limit.`);continue;}
      try {
        const isImage=file.type.startsWith('image/');
        const entry={id:`f${++serial}`,name:file.name || 'pasted-image.png',kind:isImage?'image':/^text\/|json|javascript|xml/.test(file.type) || /\.(md|txt|csv|json|js|ts|css|html)$/i.test(file.name)?'text':'binary',size:file.size,unread:true};
        if(isImage) {entry.url=URL.createObjectURL(file);objectUrls.add(entry.url);}
        else if(entry.kind==='text') entry.text=await file.text();
        results.push(entry);
      } catch(error) {failures.push(`Could not read ${file.name}: ${error.message}`);}
    }
    if(state!==workspace) {
      for(const entry of results) if(entry.url){URL.revokeObjectURL(entry.url);objectUrls.delete(entry.url);}
      return;
    }
    if(!results.length){if(failures.length)announce(failures.join(' '),true);return;}
    (attachment?owner.pending:owner.artifacts).push(...results);
    if(current()===owner) {
      if(attachment)renderPending();else {renderTabs();if(['more','gallery'].includes(owner.tab))renderBody();}
    }
    renderGrid();
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
    $('.gw-body').innerHTML=`<form class="gw-artifact-editor"><h4>${mode==='paste'?'Paste an Artifact':'New Artifact'}</h4><label>File name<input name="name" value="${escape(name)}" required maxlength="120"${readonly()?' disabled':''}></label><label>Content<textarea name="content" placeholder="${mode==='paste'?'Paste text here, or paste an image/file directly.':'Write a document...'}" required${readonly()?' disabled':''}>${escape(content)}</textarea></label><button class="primary" type="submit"${readonly()?' disabled':''}>Add Artifact</button><button type="button" data-g="cancel-editor">Cancel</button></form>`;
  }
  root.addEventListener('click',event=>{
    const legacyFile=event.target.closest('[data-checklist-file]');
    if(legacyFile) {
      event.stopImmediatePropagation();
      const card=legacyFile.closest('[data-thread]');
      if(card)open(card.dataset.thread,false);
      const name=legacyFile.dataset.checklistFile;
      const match=current().artifacts.find(f=>f.name===name || name==='button-study.png' && f.kind==='image');
      if(match)selectTab(match.kind==='image'?'gallery':match.id);
      return;
    }
    const button=event.target.closest('[data-g]');
    if(!button) {
      if(event.target.closest('.gw-card-checklist>summary'))$('.gw-checklist-float').hidePopover();
      const card=event.target.closest('.gw-card');
      if(card && !event.target.closest('button,summary,details')){open(card.dataset.thread);return;}
      if(!event.target.closest('.gw-detail,.gw-dock-zone,.gw-agent,.gw-toolbar,.gw-header,.gw-card,.gw-checklist-float'))close();
      return;
    }
    const action=button.dataset.g,id=button.dataset.id;
    if(!event.target.closest('.gw-add-menu,[data-g="add"]') && $('.gw-add-menu'))$('.gw-add-menu').hidden=true;
    if(!event.target.closest('.gw-more-float,.gw-more') && $('.gw-more-float'))$('.gw-more-float').hidden=true;
    if(['attach','upload','paste','new-file','promote','remove-pending'].includes(action) && readonly()){announce('This view is read-only.',true);return;}
    if(action==='thread')open(id);
    if(action==='project')open('project');
    if(action==='close')close();
    if(action==='tab')selectTab(id);
    if(action==='filter') {state.filter=button.dataset.value;renderGrid();positionPane();}
    if(action==='sleep') {const t=state.threads.find(t=>t.id===id);t.sleeping=!t.sleeping;renderGrid();positionPane();}
    if(action==='new-thread') {
      if(state.member!=='all' && state.member!=='you'){announce('Switch to your own view to create a Thread.',true);return;}
      const thread=subject(`thread-${++serial}`,'New Thread','Describe this subject in a Comment to begin.',{question:false});
      state.threads.unshift(thread);state.filter='Recent';state.query='';$('.gw-search').value='';open(thread.id);
      $('.gw-composer textarea').focus();
    }
    if(action==='file') {
      const file=getFile(id);current().imageId=id;selectTab(file.kind==='image'?'gallery':id);
    }
    if(action==='attachment')selectTab(id);
    if(action==='image'){current().imageId=id;renderBody();}
    if(action==='expand'){state.full=!state.full;positionPane();renderTabs();renderBody();}
    if(action==='add') {
      $('.gw-more-float').hidden=true;
      $('.gw-add-menu').hidden=!$('.gw-add-menu').hidden;
      $('.gw-add').setAttribute('aria-expanded',String(!$('.gw-add-menu').hidden));
    }
    if(action==='upload')$('.gw-file-input').click();
    if(action==='attach')$('.gw-comment-input').click();
    if(action==='paste' || action==='new-file')fileEditor(action==='paste'?'paste':'new');
    if(action==='cancel-editor'){current().editor=null;renderBody();}
    if(action==='remove-pending'){current().pending=current().pending.filter(f=>f.id!==id);renderPending();}
    if(action==='promote'){
      const file=getFile(id);
      if(!current().artifacts.some(f=>f.id===id))current().artifacts.unshift({...file,unread:true});
      renderTabs();renderBody();renderGrid();announce(`${file.name} saved as an Artifact. The original stays attached to its Comment.`);
    }
    if(action==='answer') {
      if(readonly())return;
      current().question=false;
      current().comments.push({id:`c${++serial}`,author:'You',text:`Audience: ${button.textContent}`,attachments:[]});
      renderBody();renderGrid();announce('Answer recorded in this local example.');
    }
    if(action==='agent') {
      const panel=$('.gw-agent');
      panel.hidden=!panel.hidden;
      panel.innerHTML=state.member!=='all' && state.member!=='you'?'<h4>Agents unavailable</h4><p>You can only use agents when in your own view.</p>':`<h4>Your private ${current()?.id==='project' || !current()?'Project':'Thread'} channel</h4><p>Only you can see this conversation. Shared Comments and Artifacts stay in the work.</p><div class="gw-comment"><strong>Agent</strong><p>${current()?.incomplete?'Planning from the shared context. Questions appear on Work.':'The latest work is ready for review.'}</p></div><p class="gw-study-label">Illustrative conversation · no agent is running.</p>`;
    }
  });
  root.addEventListener('input',event=>{
    const el=event.target;
    if(el.matches('.gw-search')) {state.query=el.value;renderGrid();positionPane();}
    if(el.matches('.gw-composer textarea'))current().draft=el.value;
    if(el.closest('.gw-artifact-editor'))current().editor[el.name]=el.value;
    if(el.matches('.gw-more-search,.gw-list-search')) {
      const target=el.matches('.gw-more-search')?$('.gw-more-float .gw-file-list'):$('.gw-body .gw-file-list');
      target.outerHTML=fileList(current().artifacts.filter(f=>f.name.toLowerCase().includes(el.value.toLowerCase())));
    }
  });
  root.addEventListener('change',event=>{
    const el=event.target;
    if(el.matches('.gw-member')) {state.member=el.value;renderGrid();renderPane();}
    if(el.matches('.gw-file-input,.gw-comment-input')) {
      const owner=current(),attachment=el.matches('.gw-comment-input');
      void readFiles([...el.files],owner,attachment);el.value='';
      if($('.gw-add-menu'))$('.gw-add-menu').hidden=true;
    }
  });
  root.addEventListener('paste',event=>{
    if(!event.target.matches('.gw-composer textarea,.gw-artifact-editor textarea') || readonly())return;
    const files=[...event.clipboardData.files];
    if(files.length) {event.preventDefault();void readFiles(files,current(),event.target.matches('.gw-composer textarea'));}
  });
  root.addEventListener('submit',event=>{
    event.preventDefault();
    const form=event.target,owner=current();
    if(readonly()){announce('This view is read-only.',true);return;}
    if(form.matches('.gw-intent')) {
      const description=form.elements.description.value;
      const previous=state.project;
      reset(false,previous);state.project.description=description;state.project.question=false;
      renderShell();announce('Sample Threads created. Select a card to open its work.');
    }
    if(form.matches('.gw-composer')) {
      const text=form.elements.comment.value.trim();
      if(!text && !owner.pending.length){announce('Write a Comment or attach a file before posting.',true);return;}
      owner.comments.push({id:`c${++serial}`,author:'You',text,attachments:owner.pending});
      owner.pending=[];owner.draft='';owner.incomplete=true;
      if(owner.name==='New Thread' && text)owner.name=text.slice(0,65);
      renderPane();renderGrid();announce('Comment posted locally. Attachments stay with this Comment.');
    }
    if(form.matches('.gw-artifact-editor')) {
      const name=form.elements.name.value.trim(),text=form.elements.content.value;
      if(!name || !text.trim()){announce('Give the Artifact a name and some content.',true);return;}
      owner.artifacts.unshift({...doc(name,text),unread:true});
      owner.editor=null;
      renderTabs();renderBody();renderGrid();announce(`${name} added as an Artifact. Your selected tab is unchanged.`);
    }
  });
  let hoverTimer;
  root.addEventListener('pointerover',event=>{
    if(event.pointerType==='touch')return;
    if(event.target.closest('.gw-more')) {
      const popup=$('.gw-more-float');
      if(popup){popup.innerHTML=`<label>All Artifacts<input type="search" class="gw-more-search" aria-label="Search all Artifacts" placeholder="Find an Artifact"></label>${fileList(current().artifacts,'hover')}`;popup.hidden=false;}
    }
    const summary=event.target.closest('.gw-card-checklist>summary');
    if(summary && !summary.parentElement.open && !summary.contains(event.relatedTarget)) {
      const thread=state.threads.find(t=>t.id===summary.closest('[data-thread]').dataset.thread);
      const popup=$('.gw-checklist-float');
      popup.dataset.thread=thread.id;
      popup.innerHTML=`<strong>${escape(thread.name)}</strong>${WorkbenchConcept.checklist({complete:!thread.incomplete,ready:true})}`;
      popup.showPopover();
      const r=summary.getBoundingClientRect();
      popup.style.left=`${Math.max(12,Math.min(r.left,innerWidth-popup.offsetWidth-12))}px`;
      popup.style.top=`${Math.max(12,Math.min(r.bottom+6,innerHeight-popup.offsetHeight-12))}px`;
    }
    if(event.target.closest('.gw-more,.gw-more-float,.gw-dock-zone'))clearTimeout(hoverTimer);
    if(event.target.closest('.gw-project-dock') && state.active!=='project') {
      const peek=$('.gw-project-peek');
      peek.innerHTML=`<small>PROJECT CONTEXT</small><strong>${escape(state.project.name)}</strong><p>${escape(state.project.description)}</p><span>${state.threads.length} Threads · ${state.project.artifacts.length} curated Artifacts</span><p>Click the dock to open. The Thread draft and tab will be kept.</p>`;peek.hidden=false;
    }
  });
  root.addEventListener('pointerout',event=>{
    if(event.target.closest('.gw-card-checklist>summary,.gw-checklist-float')) {
      setTimeout(()=>{if(!$('.gw-checklist-float').matches(':hover,:focus-within') && !all('.gw-card-checklist>summary').some(el=>el.matches(':hover')))$('.gw-checklist-float').hidePopover();},200);
    }
    if(!event.target.closest('.gw-more,.gw-more-float,.gw-dock-zone'))return;
    hoverTimer=setTimeout(()=>{
      if(!$('.gw-more-float')?.matches(':hover,:focus-within') && !$('.gw-more')?.matches(':hover')){$('.gw-more-float')?.setAttribute('hidden','');}
      if(!$('.gw-dock-zone').matches(':hover'))$('.gw-project-peek').hidden=true;
    },180);
  });
  root.addEventListener('focusin',event=>{
    if(event.target.matches('.gw-more') && current().tab!=='more')$('.gw-more-float').hidden=false;
  });
  document.addEventListener('pointerdown',event=>{
    if(!root.contains(event.target) && state.active && !event.target.closest('.control-tooltip'))close();
  });
  document.addEventListener('keydown',event=>{
    if(root.contains(event.target) && event.target.matches('[role="tab"]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();
      const tabs=all('.gw-tabs [role="tab"]'),i=tabs.indexOf(event.target);
      const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      const id=tabs[next].dataset.id;selectTab(id);$(`.gw-tabs [data-id="${id}"]`).focus();return;
    }
    if(event.key!=='Escape' || !(root.contains(document.activeElement) || current() && document.activeElement===document.body))return;
    if($('.gw-checklist-float').matches(':popover-open')){$('.gw-checklist-float').hidePopover();return;}
    if($('.gw-more-float') && !$('.gw-more-float').hidden) {$('.gw-more-float').hidden=true;return;}
    if($('.gw-add-menu') && !$('.gw-add-menu').hidden){$('.gw-add-menu').hidden=true;return;}
    if(!$('.gw-agent').hidden){$('.gw-agent').hidden=true;return;}
    close();
  });
  root.addEventListener('scroll',event=>{if(event.target.matches('.gw-grid'))positionPane();},true);
  root.addEventListener('toggle',event=>{
    if(event.target.matches('.gw-card-checklist')) {
      const thread=state.threads.find(t=>t.id===event.target.closest('[data-thread]').dataset.thread);
      if(thread)thread.checklistOpen=event.target.open;
      positionPane();
    }
  },true);
  new ResizeObserver(()=>{positionPane();if(current())renderTabs();}).observe(root);
  document.querySelectorAll('[data-grid-scenario]').forEach(button=>button.addEventListener('click',()=>{
    const mode=button.dataset.gridScenario;
    reset(mode==='empty');
    if(mode==='thread')open(state.threads[0].id);
    if(mode==='artifacts'){open(state.threads[0].id);selectTab('gallery');}
    if(mode==='project')open('project');
  }));
  // Old deep links remain usable without presenting the superseded layout first.
  const revealHistory = () => {
    const target=document.getElementById(location.hash.slice(1));
    if(target?.closest('#earlier-concept')){
      document.querySelector('#earlier-concept').open=true;
      requestAnimationFrame(()=>target.scrollIntoView());
    }
  };
  window.addEventListener('hashchange',revealHistory);
  reset();revealHistory();
});
