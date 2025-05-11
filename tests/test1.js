
(function(){
  // Remove previous instance
  let r=document.getElementById('l'),b=document.getElementById('lshow');
  if(r)r.remove();
  if(b)b.remove();

  // Tab and section/toggle data ("tables")
  const tabs = [
    {
      name: "Auto",
      sections: [
        {
          title: "Auto Farm",
          toggles: [
            {label: "Target Food", desc: "Target food when auto farming", key: "targetFood"},
            {label: "Target Mobs", desc: "Target mobs when auto farming", key: "targetMobs"},
            {label: "Target NPCs (Fake Players)", desc: "Target NPCs (Fake Players) when auto farming.", key: "targetNPCs"},
            {label: "Target Players", desc: "Automatically target real players when auto farming.", key: "targetPlayers"},
            {label: "Farm AD XP Automatically", desc: "Automatically farm AD XP when possible.", key: "farmAdXP"}
          ]
        },
        {
          title: "Other Gameplay Features",
          toggles: [
            {label: "Auto Respawn", desc: "Automatically respawn after death.", key: "autoRespawn"}
          ]
        }
      ]
    },
    {name: "Tab 2", sections:[]},
    {name: "Tab 3", sections:[]},
    {name: "Tab 4", sections:[]},
    {name: "Tab 5", sections:[]}
  ];

  // State for toggles (no functionality yet)
  let toggleState = {};
  tabs.forEach(tab=>tab.sections.forEach(sec=>sec.toggles.forEach(tg=>toggleState[tg.key]=false)));

  // Style
  let s=document.createElement('style');
  s.textContent=`
/* Only show scrollbars in the menu, always visible */
#l, #l .c, .section-content {
  scrollbar-width: thin;
  scrollbar-color: #5ecbff #232b3a;
  overflow: auto !important;
}

/* Firefox */
#l, #l .c, .section-content {
  scrollbar-width: thin;
  scrollbar-color: #5ecbff #232b3a;
}

/* Webkit */
#l::-webkit-scrollbar, #l .c::-webkit-scrollbar, .section-content::-webkit-scrollbar {
  width: 8px;
  background: #232b3a;
  display: block;
}
#l::-webkit-scrollbar-thumb, #l .c::-webkit-scrollbar-thumb, .section-content::-webkit-scrollbar-thumb {
  background: #5ecbff;
  border-radius: 8px;
  display: block;
}

/* Hide scrollbars everywhere else */
body, *:not(#l):not(#l *):not(.section-content) {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
body::-webkit-scrollbar, *:not(#l):not(#l *):not(.section-content)::-webkit-scrollbar {
  display: none !important;
}

/* Menu styles (unchanged) */
#l{
  font-family:'Inter',Roboto,system-ui,sans-serif;
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  z-index:999999;
  background:#181c24;
  color:#e3e9f7;
  border-radius:22px;
  box-shadow:0 12px 48px #000b;
  width:800px;
  height:480px;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  transition:transform .38s cubic-bezier(.77,0,.18,1);
}
#l .h{display:flex;flex-direction:column;align-items:center;gap:0;padding:0 0 0 0;background:#151922;height:auto;justify-content:center;}
#l .svg{width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-left:18px;align-self:flex-start;}
#l .svg svg{display:block;}
#l .b{flex:1;text-align:center;font-size:28px;font-weight:800;letter-spacing:1.5px;color:#8ab4f8;margin-top:18px;}
#l .alpha{font-size:13px;color:#8a8fa7;margin-top:2px;letter-spacing:1.2px;margin-bottom:10px;}
#l .main{display:flex;flex:1;min-height:0;}
#l .tabs{display:flex;flex-direction:column;justify-content:stretch;align-items:stretch;background:#1b2230;width:90px;min-width:70px;max-width:120px;}
#l .tab{flex:1;display:flex;align-items:center;justify-content:center;padding:0 8px;font-size:16px;font-weight:600;color:#8ab4f8;background:none;border:none;outline:none;cursor:pointer;transition:.18s;border-left:4px solid transparent;}
#l .tab.sel{background:#22304a;color:#fff;border-left:4px solid #5ecbff;}
#l .tab:not(:last-child){border-bottom:1px solid #232b3a;}
#l .tab:active{background:#2e3e5c;}
#l .c{
  flex:1;
  padding:38px 36px 38px 36px;
  overflow:auto;
  font-size:17px;
  line-height:1.7;
}
#l.hide{pointer-events:none;transform:translate(-120vw,-50%)!important;}
#l.show{transform:translate(-50%,-50%)!important;}
#lshow{position:fixed;top:50%;left:0;transform:translateY(-50%) translateX(0);z-index:1000000;background:#181c24;border-radius:0 18px 18px 0;box-shadow:2px 4px 18px #0007;display:flex;align-items:center;justify-content:center;width:44px;height:64px;cursor:pointer;transition:background .18s,opacity .3s,transform .4s cubic-bezier(.77,0,.18,1);}
#lshow:hover{background:#22304a;}
#lshow svg{display:block;}
#lshow.hidebtn{opacity:0.1;transform:translateY(-50%) translateX(-90%);}
#lshow.showbtn{opacity:1;transform:translateY(-50%) translateX(0);}
.section{background:#232b3a;border-radius:14px;border:1px solid #2e3e5c;padding:22px 26px 18px 26px;margin-bottom:24px;margin-top:6px;box-shadow:0 2px 8px #0002;transition:box-shadow .2s;}
.section:hover{box-shadow:0 4px 18px #0004;}
.section-header{user-select:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 0 0 0;font-size:18px;font-weight:700;color:#8ab4f8;}
.section-title{font-weight:700;font-size:18px;color:#8ab4f8;}
.section-arrow{display:inline-flex;align-items:center;transition:transform .25s cubic-bezier(.77,0,.18,1);}
.section-arrow.open{transform:rotate(180deg);}
.section-content{
  overflow:hidden;
  max-height:0;
  transition:max-height .35s cubic-bezier(.77,0,.18,1),padding .2s;
  padding:0 0 0 0;
  margin-top:0;
  /* For scrolling when open */
  max-width:100%;
}
.section-content.open{
  max-height:320px;
  padding:16px 0 0 0;
  margin-top:0;
  overflow-y:auto;
}
.toggle-row{display:flex;align-items:center;gap:16px;padding:18px 18px 14px 18px;background:#181c24;border-radius:10px;margin-bottom:14px;box-shadow:0 1px 4px #0002;}
.toggle-row:last-child{margin-bottom:0;}
.toggle-btn-wrap{flex-shrink:0;display:flex;align-items:center;}
.toggle-label-wrap{display:flex;flex-direction:column;align-items:flex-start;}
.toggle-label{font-size:16px;font-weight:700;color:#e3e9f7;}
.toggle-desc{font-size:13px;color:#8a8fa7;font-weight:400;margin-top:2px;}
.toggle-switch{position:relative;width:38px;height:22px;background:#181c24;border-radius:22px;transition:background .2s;box-shadow:0 1px 4px #0002;border:1.5px solid #5ecbff;cursor:pointer;}
.toggle-switch.on{background:#5ecbff;}
.toggle-switch .knob{position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#5ecbff;transition:transform .2s,background .2s;box-shadow:0 1px 4px #0003;}
.toggle-switch.on .knob{transform:translateX(16px);background:#fff;}
@media (max-width:900px){
  #l{width:99vw;height:99vh;}
  #l .tabs{width:60px;min-width:50px;}
  #l .c{padding:18px 10px;}
  #l .b{font-size:20px;}
}
  `;
  document.head.appendChild(s);

  // Section/Toggle HTML builder
  function buildSection(sec, idx) {
    let secId = `section${idx}`;
    let arrowId = `arrow${idx}`;
    let contentId = `content${idx}`;
    let rows = sec.toggles.map((tg,i)=>`
      <div class="toggle-row">
        <span class="toggle-btn-wrap">
          <span class="toggle-switch${toggleState[tg.key]?' on':''}" data-key="${tg.key}" tabindex="0" role="checkbox" aria-checked="${toggleState[tg.key]}" aria-label="${tg.label}">
            <span class="knob"></span>
          </span>
        </span>
        <span class="toggle-label-wrap">
          <span class="toggle-label">${tg.label}</span>
          <span class="toggle-desc">${tg.desc}</span>
        </span>
      </div>
    `).join('');
    return `
      <div class="section">
        <div class="section-header" id="${secId}">
          <span class="section-title">${sec.title}</span>
          <span class="section-arrow" id="${arrowId}">
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M6 7l3 3 3-3" stroke="#5ecbff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          </span>
        </div>
        <div class="section-content" id="${contentId}">
          ${rows}
        </div>
      </div>
    `;
  }

  // Tab content builder
  function buildTabContent(tab) {
    return tab.sections.map(buildSection).join('');
  }

  // HTML
  let h=document.createElement('div');
  h.id='l';
  h.className='show';
  h.innerHTML=
    `<div class="h">
      <span class="b">Libs Mods</span>
      <span class="alpha">[ALPHA]</span>
      <span class="svg" id="lba" style="align-self:flex-start;margin-top:-36px;margin-bottom:10px;">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M18.5 22L10.5 14L18.5 6" stroke="#5ecbff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <div class="main">
      <div class="tabs">
        ${tabs.map((x,i)=>`<button class="tab${i==0?' sel':''}" data-i="${i}">${x.name}</button>`).join('')}
      </div>
      <div class="c">${buildTabContent(tabs[0])}</div>
    </div>`;
  document.body.appendChild(h);

  // Slide-in button
  let sh=document.createElement('div');
  sh.id='lshow';
  sh.style.display='none';
  sh.className='showbtn';
  sh.innerHTML=`<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M9.5 22L17.5 14L9.5 6" stroke="#5ecbff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(sh);

  // Tab logic
  let bs=h.querySelectorAll('.tab'),c=h.querySelector('.c');
  bs.forEach((btn,i)=>{
    btn.onclick=function(){
      bs.forEach(b=>b.classList.remove('sel'));
      this.classList.add('sel');
      c.innerHTML=buildTabContent(tabs[i]);
      setupSectionsAndToggles(tabs[i]);
    };
  });

  // Section collapse/expand and toggle logic
  function setupSectionsAndToggles(tab) {
    tab.sections.forEach((sec, idx)=>{
      let secId = `section${idx}`;
      let arrowId = `arrow${idx}`;
      let contentId = `content${idx}`;
      let header = document.getElementById(secId);
      let arrow = document.getElementById(arrowId);
      let content = document.getElementById(contentId);
      if(header && arrow && content) {
        arrow.classList.remove('open');
        content.classList.remove('open');
        header.onclick = function() {
          let open = content.classList.contains('open');
          if(open) {
            content.classList.remove('open');
            arrow.classList.remove('open');
          } else {
            content.classList.add('open');
            arrow.classList.add('open');
          }
        };
      }
    });
    // Toggle logic
    let switches = c.querySelectorAll('.toggle-switch');
    switches.forEach(sw=>{
      sw.onclick=function(e){
        let key = this.getAttribute('data-key');
        toggleState[key]=!toggleState[key];
        this.classList.toggle('on',toggleState[key]);
        this.setAttribute('aria-checked',toggleState[key]);
        e.stopPropagation();
      };
      sw.onkeydown=function(e){
        if(e.key===" "||e.key==="Enter"){
          this.click();
          e.preventDefault();
        }
      };
    });
  }
  setupSectionsAndToggles(tabs[0]);

  // Back arrow
  h.querySelector('#lba').onclick=function(){
    h.classList.remove('show');
    h.classList.add('hide');
    setTimeout(()=>{sh.style.display='flex';startHideTimer();},400);
  };

  // Show menu
  sh.onclick=function(){
    h.classList.remove('hide');
    h.classList.add('show');
    sh.style.display='none';
    clearHideTimer();
  };

  // Auto-hide logic for slide-in button
  let hideTimer=null, isHidden=false;
  function startHideTimer(){
    clearHideTimer();
    hideTimer=setTimeout(hideBtn,3500);
  }
  function clearHideTimer(){
    if(hideTimer){clearTimeout(hideTimer);hideTimer=null;}
  }
  function hideBtn(){
    sh.classList.remove('showbtn');
    sh.classList.add('hidebtn');
    isHidden=true;
  }
  function showBtn(){
    sh.classList.remove('hidebtn');
    sh.classList.add('showbtn');
    isHidden=false;
  }
  sh.addEventListener('mouseenter',function(){
    showBtn();
    clearHideTimer();
  });
  sh.addEventListener('mouseleave',function(){
    startHideTimer();
  });
  sh.addEventListener('click',function(){
    showBtn();
    clearHideTimer();
  });
  function onShowBtn(){
    showBtn();
    startHideTimer();
  }

  // Optional: Load Inter font if not present
  if(!document.getElementById('lfont')){
    let f=document.createElement('link');
    f.id='lfont';f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap';
    document.head.appendChild(f);
  }
  if(h.classList.contains('hide')){
    sh.style.display='flex';
    onShowBtn();
  }
})();
