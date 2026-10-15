var storage=(function(){var a=false;try{var t='__hhh__';localStorage.setItem(t,'1');localStorage.removeItem(t);a=true}catch(e){a=false}var m={};return{get:function(k){if(a){try{return localStorage.getItem(k)}catch(e){return m[k]||null}}return m[k]||null},set:function(k,v){if(a){try{localStorage.setItem(k,v);return}catch(e){m[k]=v;return}}m[k]=v},remove:function(k){if(a){try{localStorage.removeItem(k);return}catch(e){delete m[k];return}}delete m[k]}}})();

var MATCH_SIZE=3,TRAY_SIZE=9;
var LEVEL_VARIANTS=[25,50,100,150,200,250,300,400,500,600];
var BASE_TEXTS=['Хахах','ХАХАХ','Ха-хах','Хахаха','Ахаха','Хаханьки','Хихих','Хо-хо-хо','Хе-хе','Хихихи','Хах-хах','Хо-хо','Хахахаха','Ахахаха','Хи-хи','Ха-ха','Хохо','Хе-хе-хе','Хи-хи-хи','Ха-ха-ха','Хихихаха','Хохотание','Хихиканье','Хи-хи-хи-хи','Хо-хо-хо-хо','Смешинка','Смехотун','Хохотун','Хихиханьки','Хахахахаха'];

function generateTexts(c){var o=[];for(var i=0;i<c;i++){var b=BASE_TEXTS[i%BASE_TEXTS.length];var cy=Math.floor(i/BASE_TEXTS.length);o.push(cy===0?b:b+' '+(cy+1))}return o}
function colorFor(i){var h=(i*137.508)%360;var s=32+(i%4)*6;var l=40+(i%5)*5;return{bg:'hsl('+h+','+s+'%,'+l+'%)',fg:l<46?'#f0e8d5':'#241a10',border:'hsl('+h+','+s+'%,'+Math.max(15,l-18)+'%)',shadow:'hsl('+h+','+s+'%,'+Math.max(10,l-26)+'%)'}}
function levelConfig(v){var t=v*MATCH_SIZE;var w=Math.max(1400,Math.min(6000,Math.ceil(Math.sqrt(t)*140)));var fs,pad;if(t<=75){fs=34;pad=[17,28]}else if(t<=150){fs=28;pad=[15,24]}else if(t<=300){fs=22;pad=[12,19]}else if(t<=500){fs=19;pad=[11,16]}else if(t<=800){fs=17;pad=[10,14]}else if(t<=1200){fs=15;pad=[9,13]}else if(t<=1800){fs=14;pad=[8,11]}else{fs=12;pad=[7,10]}return{variants:v,total:t,worldSize:w,fs:fs,pad:pad}}

var K={stats:'hhh_stats_v11',ach:'hhh_ach_v11',level:'hhh_level_v11',coins:'hhh_coins_v11',theme:'hhh_theme_v11',done:'hhh_levels_done_v11',skipped:'hhh_levels_skipped_v11',hints:'hhh_hints_v11',skips:'hhh_skips_v11',refMy:'hhh_ref_my_v11',refUsed:'hhh_ref_used_v11'};

var defaultStats={gamesPlayed:0,gamesWon:0,totalPairsFound:0,totalMoves:0,bestPairsInGame:0,bestTime:0,bestMoves:0,perfectGamesNoMistakes:0,rainbowActivated:false,wordUsed:false,titleClicks:0,shufflesUsed:0,maxWinStreak:0,gamesWonWithComeback:0,highestLevel:1,maxPairsInLevel:0,purchases:0,refUsed:0};
var stats={};(function(){var s=null;try{s=JSON.parse(storage.get(K.stats)||'null')}catch(e){}for(var k in defaultStats)stats[k]=defaultStats[k];if(s)for(var k2 in s)stats[k2]=s[k2]})();
function saveStats(){try{storage.set(K.stats,JSON.stringify(stats))}catch(e){}}

var unlockedAch={};(function(){try{var a=JSON.parse(storage.get(K.ach)||'[]');a.forEach(function(id){unlockedAch[id]=true})}catch(e){}})();
function saveAch(){try{storage.set(K.ach,JSON.stringify(Object.keys(unlockedAch)))}catch(e){}}

var currentLevel=1;(function(){var l=parseInt(storage.get(K.level)||'1',10);if(l>0&&l<=LEVEL_VARIANTS.length)currentLevel=l})();
function saveLevel(){try{storage.set(K.level,String(currentLevel))}catch(e){}}

var coins=parseInt(storage.get(K.coins)||'0',10)||0;
function saveCoins(){try{storage.set(K.coins,String(coins))}catch(e){}}

var levelsDone={};(function(){try{var d=JSON.parse(storage.get(K.done)||'null');if(d)levelsDone=d}catch(e){}for(var i=1;i<stats.highestLevel;i++){if(levelsDone[i]===undefined)levelsDone[i]='done'}})();
function saveLevelsDone(){try{storage.set(K.done,JSON.stringify(levelsDone))}catch(e){}}
var levelsSkipped={};(function(){try{var d=JSON.parse(storage.get(K.skipped)||'null');if(d)levelsSkipped=d}catch(e){}})();
function saveLevelsSkipped(){try{storage.set(K.skipped,JSON.stringify(levelsSkipped))}catch(e){}}

var hintsOwned=parseInt(storage.get(K.hints)||'0',10)||0;
var skipsOwned=parseInt(storage.get(K.skips)||'0',10)||0;
function saveInv(){try{storage.set(K.hints,String(hintsOwned));storage.set(K.skips,String(skipsOwned))}catch(e){}}

var refMyCode=storage.get(K.refMy)||'';
var refUsedCodes=[];(function(){try{refUsedCodes=JSON.parse(storage.get(K.refUsed)||'[]')}catch(e){}})();
if(!refMyCode){var ch='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';refMyCode='';for(var ci=0;ci<8;ci++)refMyCode+=ch[Math.floor(Math.random()*ch.length)];storage.set(K.refMy,refMyCode)}

var theme=storage.get(K.theme)||'light';
if(theme==='dark')document.body.classList.add('dark');

var RARITY_NAME={bronze:'Бронза',silver:'Серебро',gold:'Золото'};

var ACHIEVEMENTS=[
{id:'first_game',rarity:'bronze',hidden:false,name:'Первая игра',desc:'Начни первую игру',check:function(s){return s.gamesPlayed>=1}},
{id:'first_match',rarity:'bronze',hidden:false,name:'Первая тройка',desc:'Собери первую тройку',check:function(s){return s.totalPairsFound>=1}},
{id:'winner',rarity:'bronze',hidden:false,name:'Победитель',desc:'Пройди любой уровень',check:function(s){return s.gamesWon>=1}},
{id:'level_3',rarity:'bronze',hidden:false,name:'Упорный',desc:'Дойди до 3 уровня',check:function(s){return s.highestLevel>=3}},
{id:'shuffler',rarity:'bronze',hidden:false,name:'Мешатель',desc:'Перемешай 5 раз',check:function(s){return s.shufflesUsed>=5}},
{id:'laugh_king',rarity:'bronze',hidden:false,name:'Сто троек',desc:'Собери 100 троек',check:function(s){return s.totalPairsFound>=100}},
{id:'shopper',rarity:'bronze',hidden:false,name:'Покупатель',desc:'Купи что-нибудь в магазине',check:function(s){return (s.purchases||0)>=1}},
{id:'title_secret',rarity:'bronze',hidden:true,name:'Терпеливый',desc:'Кликни 7 раз по заголовку',check:function(s){return s.titleClicks>=7}},
{id:'word_secret',rarity:'bronze',hidden:true,name:'Слово силы',desc:'Набери «хахаха»',check:function(s){return s.wordUsed===true}},

{id:'under_180',rarity:'silver',hidden:false,name:'Быстрый',desc:'Пройди за 3 минуты',check:function(s){return s.bestTime>0&&s.bestTime<=180}},
{id:'under_90',rarity:'silver',hidden:false,name:'Очень быстрый',desc:'Пройди за 90 секунд',check:function(s){return s.bestTime>0&&s.bestTime<=90}},
{id:'veteran',rarity:'silver',hidden:false,name:'Ветеран',desc:'Сыграй 10 игр',check:function(s){return s.gamesPlayed>=10}},
{id:'master',rarity:'silver',hidden:false,name:'Мастер',desc:'Выиграй 5 уровней',check:function(s){return s.gamesWon>=5}},
{id:'level_5',rarity:'silver',hidden:false,name:'Опытный',desc:'Дойди до 5 уровня',check:function(s){return s.highestLevel>=5}},
{id:'clicker',rarity:'silver',hidden:false,name:'Кликер',desc:'Сделай 2000 ходов',check:function(s){return s.totalMoves>=2000}},
{id:'rich',rarity:'silver',hidden:false,name:'Богач',desc:'Накопи 500 монет',check:function(){return coins>=500}},
{id:'konami',rarity:'silver',hidden:true,name:'Радужный режим',desc:'Код Konami: ↑↑↓↓←→←→BA',check:function(s){return s.rainbowActivated===true}},
{id:'combo_master',rarity:'silver',hidden:true,name:'В ударе',desc:'5 троек подряд без ошибок',check:function(s){return s.maxWinStreak>=5}},

{id:'level_7',rarity:'gold',hidden:false,name:'Легенда',desc:'Дойди до 7 уровня',check:function(s){return s.highestLevel>=7}},
{id:'no_mistakes',rarity:'gold',hidden:false,name:'Безупречно',desc:'Пройди без лишних ходов',check:function(s){return s.perfectGamesNoMistakes>=1}},
{id:'speed_light',rarity:'gold',hidden:false,name:'Скорость света',desc:'Пройди за 60 секунд',check:function(s){return s.bestTime>0&&s.bestTime<=60}},
{id:'level_9',rarity:'gold',hidden:false,name:'Неудержимый',desc:'Дойди до 9 уровня',check:function(s){return s.highestLevel>=9}},
{id:'referrer',rarity:'gold',hidden:false,name:'Реферер',desc:'Введи код друга',check:function(s){return (s.refUsed||0)>=1}},
{id:'hunter',rarity:'gold',hidden:true,name:'Секретоискатель',desc:'Найди 3 скрытых',check:function(){return countHidden()>=3}},
{id:'knowall',rarity:'gold',hidden:true,name:'Всезнайка',desc:'Найди все скрытые',check:function(){return countHidden()>=HIDDEN_TOTAL}},
{id:'comeback',rarity:'gold',hidden:true,name:'Камбэк',desc:'Выиграй, когда табличка полна',check:function(s){return s.gamesWonWithComeback>=1}},
{id:'perfectionist',rarity:'gold',hidden:true,name:'Совершенство',desc:'Пройди без лишних 3 раза',check:function(s){return s.perfectGamesNoMistakes>=3}}
];
var HIDDEN_TOTAL=ACHIEVEMENTS.filter(function(a){return a.hidden}).length;
function countHidden(){return ACHIEVEMENTS.filter(function(a){return a.hidden&&unlockedAch[a.id]}).length}

function $(id){return document.getElementById(id)}
var viewportEl=$('viewport'),worldEl=$('world'),trayEl=$('tray'),traySlotsEl=$('tray-slots');
var hudEl=$('hud'),hudLevelEl=$('hud-level'),hudCoinsEl=$('hud-coins'),controlsEl=$('controls');
var progressFill=$('level-progress-fill'),levelProgressEl=$('level-progress');
var levelDisplayEl=$('level-display'),coinsDisplayEl=$('coins-display');
var pairsEl=$('pairs'),movesEl=$('moves'),timeEl=$('time');
var startScreen=$('start-screen'),endScreen=$('end-screen');
var endLevelBadge=$('end-level-badge'),startLevelBadge=$('start-level-badge');
var endTitle=$('end-title'),endSubtitle=$('end-subtitle'),endStatsLabel=$('end-stats-label');
var finalMovesEl=$('final-moves'),timeResultEl=$('time-result'),coinsEarnedEl=$('coins-earned');
var rankEl=$('rank'),titleEl=$('title'),menuPanel=$('menu-panel'),menuCount=$('menu-count');
var statsGrid=$('stats-grid'),statsBest=$('stats-best');
var levelsPanel=$('levels-panel'),levelsGrid=$('levels-grid'),levelsProgressInfo=$('levels-progress-info');
var shopPanel=$('shop-panel'),shopGrid=$('shop-grid'),shopBalance=$('shop-balance');
var useHintBtn=$('use-hint-btn'),useSkipBtn=$('use-skip-btn');

var worldW=1400,worldH=1400,worldCX=700,worldCY=700,pileRadius=700;
var tiles=[],trayList=[],matchesFound=0,moves=0,totalVariants=25;
var playing=false,startTime=0,timeInterval=null,rainbowMode=false,currentWinStreak=0,maxTrayUsedThisGame=0,processingMatches=false,currentConfig=null,rafPending=false;
var camera={x:0,y:0,zoom:1},isPanning=false,panStart=null,touchState=null;

function applyCamera(){var W=window.innerWidth,H=window.innerHeight;var tx=W/2-camera.x*camera.zoom;var ty=H/2-camera.y*camera.zoom;worldEl.style.transform='translate3d('+tx+'px,'+ty+'px,0) scale('+camera.zoom+')'}
function resetCamera(){camera.x=worldCX;camera.y=worldCY;var W=window.innerWidth,H=window.innerHeight;var zx=(W*0.92)/worldW;var zy=(H*0.68)/worldH;camera.zoom=Math.max(0.15,Math.min(1.6,Math.min(zx,zy)));applyCamera()}
function zoomAt(sx,sy,f){var W=window.innerWidth,H=window.innerHeight;var wx=camera.x+(sx-W/2)/camera.zoom;var wy=camera.y+(sy-H/2)/camera.zoom;var nz=Math.max(0.15,Math.min(4,camera.zoom*f));camera.x=wx-(sx-W/2)/nz;camera.y=wy-(sy-H/2)/nz;camera.zoom=nz;applyCamera()}

viewportEl.addEventListener('mousedown',function(e){if(e.button!==0&&e.button!==1)return;if(e.target.closest('.tile'))return;isPanning=true;panStart={x:e.clientX,y:e.clientY,camX:camera.x,camY:camera.y};viewportEl.classList.add('dragging');e.preventDefault()});
document.addEventListener('mousemove',function(e){if(!isPanning)return;camera.x=panStart.camX-(e.clientX-panStart.x)/camera.zoom;camera.y=panStart.camY-(e.clientY-panStart.y)/camera.zoom;applyCamera()});
document.addEventListener('mouseup',function(){if(isPanning){isPanning=false;viewportEl.classList.remove('dragging');if(playing)scheduleAccessibility()}});
viewportEl.addEventListener('wheel',function(e){e.preventDefault();zoomAt(e.clientX,e.clientY,e.deltaY>0?0.88:1.14)},{passive:false});

viewportEl.addEventListener('touchstart',function(e){if(e.touches.length===1){var t=e.touches[0];var el=document.elementFromPoint(t.clientX,t.clientY);if(el&&el.closest('.tile'))return;touchState={type:'pan',startX:t.clientX,startY:t.clientY,startCamX:camera.x,startCamY:camera.y}}else if(e.touches.length===2){var a=e.touches[0],b=e.touches[1];var dist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);touchState={type:'pinch',startDist:dist,startZoom:camera.zoom,centerX:(a.clientX+b.clientX)/2,centerY:(a.clientY+b.clientY)/2,startCamX:camera.x,startCamY:camera.y};e.preventDefault()}},{passive:false});

viewportEl.addEventListener('touchmove',function(e){if(!touchState)return;if(touchState.type==='pan'&&e.touches.length===1){var t=e.touches[0];camera.x=touchState.startCamX-(t.clientX-touchState.startX)/camera.zoom;camera.y=touchState.startCamY-(t.clientY-touchState.startY)/camera.zoom;applyCamera();e.preventDefault()}else if(touchState.type==='pinch'&&e.touches.length===2){var a=e.touches[0],b=e.touches[1];var dist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);var nz=Math.max(0.15,Math.min(4,touchState.startZoom*(dist/touchState.startDist)));var W=window.innerWidth,H=window.innerHeight;var sx=touchState.centerX,sy=touchState.centerY;var wx=touchState.startCamX+(sx-W/2)/touchState.startZoom;var wy=touchState.startCamY+(sy-H/2)/touchState.startZoom;camera.x=wx-(sx-W/2)/nz;camera.y=wy-(sy-H/2)/nz;camera.zoom=nz;applyCamera();e.preventDefault()}},{passive:false});

viewportEl.addEventListener('touchend',function(e){if(e.touches.length===0){if(touchState&&touchState.type==='pinch'&&playing)scheduleAccessibility();touchState=null}});
window.addEventListener('resize',function(){applyCamera();if(playing)scheduleAccessibility()});

var slotEls=[];
function buildTraySlots(){traySlotsEl.innerHTML='';slotEls.length=0;var frag=document.createDocumentFragment();for(var i=0;i<TRAY_SIZE;i++){var s=document.createElement('div');s.className='slot';frag.appendChild(s);slotEls.push(s)}traySlotsEl.appendChild(frag)}

function renderTray(){for(var i=0;i<TRAY_SIZE;i++){slotEls[i].innerHTML='';slotEls[i].classList.remove('filled')}
var vc={};trayList.forEach(function(t){if(t.pending)return;vc[t.variantIndex]=(vc[t.variantIndex]||0)+1});
var idx=0;trayList.forEach(function(tile){if(tile.pending)return;if(idx>=TRAY_SIZE)return;
var slot=slotEls[idx];slot.classList.add('filled');
var el=document.createElement('div');el.className='tray-tile';el.textContent=tile.text;
el.style.setProperty('--bg',tile.color.bg);el.style.setProperty('--fg',tile.color.fg);
el.style.setProperty('--border',tile.color.border);el.style.setProperty('--shadow',tile.color.shadow);
var cnt=vc[tile.variantIndex]||0;
if(cnt>=2&&cnt<MATCH_SIZE){el.classList.add('has-two');var b=document.createElement('div');b.className='tray-counter';b.textContent=cnt+'/'+MATCH_SIZE;el.appendChild(b)}
slot.appendChild(el);idx++});
trayEl.classList.toggle('warning',trayList.length>=TRAY_SIZE-1)}

function measureTile(text,fs,padX,padY){var w=Math.ceil(text.length*fs*0.6)+padX*2+6;var h=Math.ceil(fs*1.4)+padY*2+6;return{w:w,h:h}}

function buildBoard(){worldEl.innerHTML='';tiles=[];trayList=[];matchesFound=0;moves=0;currentWinStreak=0;maxTrayUsedThisGame=0;processingMatches=false;
currentConfig=levelConfig(LEVEL_VARIANTS[currentLevel-1]);totalVariants=currentConfig.variants;
worldW=worldH=currentConfig.worldSize;worldCX=worldCY=worldW/2;pileRadius=worldW*0.5;
worldEl.style.width=worldW+'px';worldEl.style.height=worldH+'px';
pairsEl.textContent='0/'+totalVariants;movesEl.textContent='0';levelDisplayEl.textContent=String(currentLevel);progressFill.style.width='0%';
var texts=generateTexts(totalVariants);var variants=[];
for(var i=0;i<totalVariants;i++){var v={text:texts[i],color:colorFor(i),variantIndex:i};var size=measureTile(v.text,currentConfig.fs,currentConfig.pad[1],currentConfig.pad[0]);v.w=size.w;v.h=size.h;variants.push(v)}
var values=[];variants.forEach(function(v){for(var k=0;k<MATCH_SIZE;k++)values.push(v)});
for(var i2=values.length-1;i2>0;i2--){var j=Math.floor(Math.random()*(i2+1));var tmp=values[i2];values[i2]=values[j];values[j]=tmp}
var zs=[];for(var i3=1;i3<=values.length;i3++)zs.push(i3);
for(var i4=zs.length-1;i4>0;i4--){var j4=Math.floor(Math.random()*(i4+1));var t4=zs[i4];zs[i4]=zs[j4];zs[j4]=t4}
for(var i5=0;i5<values.length;i5++){var angle=Math.random()*Math.PI*2;var r=Math.sqrt(Math.random())*pileRadius;
tiles.push({id:i5,text:values[i5].text,color:values[i5].color,variantIndex:values[i5].variantIndex,w:values[i5].w,h:values[i5].h,x:worldCX+Math.cos(angle)*r,y:worldCY+Math.sin(angle)*r*0.94,z:zs[i5],rot:(Math.random()-0.5)*6,state:'world',blocked:false,el:null,pending:false})}
var cfg=currentConfig;var frag=document.createDocumentFragment();
tiles.forEach(function(t){var el=document.createElement('div');el.className='tile';el.textContent=t.text;
el.style.left=t.x+'px';el.style.top=t.y+'px';el.style.zIndex=t.z;
el.style.setProperty('--bg',t.color.bg);el.style.setProperty('--fg',t.color.fg);
el.style.setProperty('--border',t.color.border);el.style.setProperty('--shadow',t.color.shadow);
el.style.setProperty('--rot',t.rot+'deg');el.style.setProperty('--fs',cfg.fs+'px');
el.style.setProperty('--pad-y',cfg.pad[0]+'px');el.style.setProperty('--pad-x',cfg.pad[1]+'px');
el.addEventListener('click',function(e){e.stopPropagation();onTileClick(t)});
el.addEventListener('touchstart',function(e){e.stopPropagation()},{passive:true});
frag.appendChild(el);t.el=el});
worldEl.appendChild(frag);renderTray();scheduleAccessibility()}

var CELL_SIZE=220;
function updateAccessibility(){rafPending=false;var grid={};
for(var i=0;i<tiles.length;i++){var t=tiles[i];if(t.state!=='world')continue;var gx=Math.floor(t.x/CELL_SIZE);var gy=Math.floor(t.y/CELL_SIZE);var key=gx+','+gy;if(!grid[key])grid[key]=[];grid[key].push(t)}
for(var i2=0;i2<tiles.length;i2++){var t2=tiles[i2];if(t2.state!=='world')continue;
var gx2=Math.floor(t2.x/CELL_SIZE);var gy2=Math.floor(t2.y/CELL_SIZE);var blocked=false;
outer:for(var dx=-1;dx<=1;dx++){for(var dy=-1;dy<=1;dy++){var bucket=grid[(gx2+dx)+','+(gy2+dy)];if(!bucket)continue;
for(var k=0;k<bucket.length;k++){var other=bucket[k];if(other===t2||other.z<=t2.z)continue;
if(Math.abs(t2.x-other.x)<other.w/2&&Math.abs(t2.y-other.y)<other.h/2){blocked=true;break outer}}}}
if(t2.blocked!==blocked){t2.blocked=blocked;if(t2.el)t2.el.classList.toggle('blocked',blocked)}}}

function scheduleAccessibility(){if(rafPending)return;rafPending=true;requestAnimationFrame(updateAccessibility)}

function onTileClick(tile){if(!playing||tile.state!=='world')return;
if(tile.blocked){if(tile.el){tile.el.classList.add('shake');setTimeout(function(){if(tile.el)tile.el.classList.remove('shake')},360)}return}
if(trayList.length>=TRAY_SIZE)return;if(processingMatches)return;
var slotIndex=trayList.length;var el=tile.el;if(!el)return;
tile.state='flying';tile.pending=true;trayList.push(tile);
moves++;movesEl.textContent=moves;stats.totalMoves++;saveStats();renderTray();
var rect=el.getBoundingClientRect();var slotRect=slotEls[slotIndex].getBoundingClientRect();
var ghost=document.createElement('div');ghost.className='ghost';ghost.textContent=tile.text;
ghost.style.left=rect.left+'px';ghost.style.top=rect.top+'px';ghost.style.width=rect.width+'px';ghost.style.height=rect.height+'px';
ghost.style.fontSize=currentConfig.fs+'px';
ghost.style.setProperty('--bg',tile.color.bg);ghost.style.setProperty('--fg',tile.color.fg);
ghost.style.setProperty('--border',tile.color.border);ghost.style.setProperty('--shadow',tile.color.shadow);
document.body.appendChild(ghost);el.parentNode.removeChild(el);tile.el=null;
ghost.getBoundingClientRect();
requestAnimationFrame(function(){ghost.style.left=slotRect.left+'px';ghost.style.top=slotRect.top+'px';ghost.style.width=slotRect.width+'px';ghost.style.height=slotRect.height+'px';ghost.style.fontSize='11px'});
setTimeout(function(){if(ghost.parentNode)ghost.parentNode.removeChild(ghost);
tile.pending=false;tile.state='tray';renderTray();
setTimeout(function(){processMatches();scheduleAccessibility()},60)},520)}

function processMatches(){if(processingMatches)return;
var counts={};trayList.forEach(function(t){if(t.pending)return;counts[t.variantIndex]=(counts[t.variantIndex]||0)+1});
var matchVariant=null;for(var v in counts){if(counts[v]>=MATCH_SIZE){matchVariant=parseInt(v,10);break}}
if(matchVariant!==null){processingMatches=true;
var candidates=trayList.filter(function(t){return t.variantIndex===matchVariant&&!t.pending});
var toRemove=candidates.slice(0,MATCH_SIZE);
toRemove.forEach(function(t){var i=trayList.indexOf(t);if(i>=0&&i<TRAY_SIZE){var el=slotEls[i].querySelector('.tray-tile');if(el)el.classList.add('matching')}});
matchesFound++;pairsEl.textContent=matchesFound+'/'+totalVariants;progressFill.style.width=(matchesFound/totalVariants*100)+'%';
stats.totalPairsFound++;if(matchesFound>stats.bestPairsInGame)stats.bestPairsInGame=matchesFound;
currentWinStreak++;if(currentWinStreak>stats.maxWinStreak)stats.maxWinStreak=currentWinStreak;saveStats();
toRemove.forEach(function(t){t.state='matched'});
setTimeout(function(){trayList=trayList.filter(function(t){return toRemove.indexOf(t)<0});renderTray();processingMatches=false;
if(matchesFound>=totalVariants)checkWin();else setTimeout(processMatches,130)},540)}
else{if(trayList.filter(function(t){return !t.pending}).length>=TRAY_SIZE)setTimeout(gameOver,300)}
checkAchievements()}

function coinsForLevel(lv){return lv*5}

function checkWin(){if(matchesFound<totalVariants||!playing)return;playing=false;clearInterval(timeInterval);
var elapsed=Math.floor((Date.now()-startTime)/1000);var timeStr=Math.floor(elapsed/60)+':'+String(elapsed%60).padStart(2,'0');
endLevelBadge.textContent='Уровень '+currentLevel;endTitle.textContent='Уровень пройден';endSubtitle.textContent='Все '+totalVariants+' троек разобраны.';
endStatsLabel.textContent='Ходов сделано:';finalMovesEl.textContent=moves;timeResultEl.textContent='Время: '+timeStr;
var earned=coinsForLevel(currentLevel);coins+=earned;saveCoins();updateCoinsDisplay();coinsEarnedEl.textContent='+'+earned+' 🪙 монет';
var minMoves=totalVariants*MATCH_SIZE;var rank='Хороший результат';
if(moves===minMoves)rank='Идеально';else if(moves<=minMoves+5)rank='Почти идеально';else if(moves<=minMoves+20)rank='Отлично';else if(moves<=minMoves+50)rank='Неплохо';
rankEl.textContent=rank;
stats.gamesWon++;if(stats.bestTime===0||elapsed<stats.bestTime)stats.bestTime=elapsed;
if(stats.bestMoves===0||moves<stats.bestMoves)stats.bestMoves=moves;
if(moves===minMoves)stats.perfectGamesNoMistakes++;
if(maxTrayUsedThisGame>=TRAY_SIZE-1)stats.gamesWonWithComeback++;
if(totalVariants>stats.maxPairsInLevel)stats.maxPairsInLevel=totalVariants;saveStats();
levelsDone[currentLevel]='done';delete levelsSkipped[currentLevel];saveLevelsDone();saveLevelsSkipped();
if(currentLevel<LEVEL_VARIANTS.length){var next=currentLevel+1;if(next>stats.highestLevel){stats.highestLevel=next;saveStats()}}
checkAchievements();$('next-level-btn').style.display=currentLevel>=LEVEL_VARIANTS.length?'none':'';
setTimeout(function(){endScreen.classList.remove('hidden')},400)}

function gameOver(){if(!playing)return;playing=false;clearInterval(timeInterval);
var elapsed=Math.floor((Date.now()-startTime)/1000);var timeStr=Math.floor(elapsed/60)+':'+String(elapsed%60).padStart(2,'0');
endLevelBadge.textContent='Уровень '+currentLevel;endTitle.textContent='Табличка полна';endSubtitle.textContent='Больше некуда класть плитки.';
endStatsLabel.textContent='Троек собрано:';finalMovesEl.textContent=matchesFound+' / '+totalVariants;
timeResultEl.textContent='За '+timeStr;coinsEarnedEl.textContent='';
var ratio=matchesFound/totalVariants;var rank='Попробуй ещё раз';
if(ratio>=0.85)rank='Совсем чуть-чуть не хватило';else if(ratio>=0.6)rank='Хорошая попытка';
rankEl.textContent=rank;
if(matchesFound>stats.bestPairsInGame)stats.bestPairsInGame=matchesFound;saveStats();checkAchievements();
$('next-level-btn').style.display='none';setTimeout(function(){endScreen.classList.remove('hidden')},400)}

function startGame(){startScreen.classList.add('hidden');endScreen.classList.add('hidden');
menuPanel.classList.remove('open');levelsPanel.classList.remove('open');shopPanel.classList.remove('open');
buildBoard();resetCamera();playing=true;startTime=Date.now();timeEl.textContent='0:00';
stats.gamesPlayed++;saveStats();checkAchievements();updateShopItemUseUI();
clearInterval(timeInterval);
timeInterval=setInterval(function(){var elapsed=Math.floor((Date.now()-startTime)/1000);timeEl.textContent=Math.floor(elapsed/60)+':'+String(elapsed%60).padStart(2,'0')},1000);
saveLevel()}

function returnToMenu(){playing=false;clearInterval(timeInterval);isPanning=false;touchState=null;viewportEl.classList.remove('dragging');
endScreen.classList.add('hidden');menuPanel.classList.remove('open');levelsPanel.classList.remove('open');shopPanel.classList.remove('open');
startLevelBadge.textContent='Уровень '+currentLevel+' · '+LEVEL_VARIANTS[currentLevel-1]+' надписей';
startScreen.classList.remove('hidden');worldEl.innerHTML='';tiles=[];trayList=[];renderTray();updateCounters();updateShopItemUseUI()}

function nextLevel(){if(currentLevel>=LEVEL_VARIANTS.length)return;currentLevel++;saveLevel();endScreen.classList.add('hidden');startGame()}

function resetCurrentGame(){if(!confirm('Начать уровень заново?'))return;clearInterval(timeInterval);playing=false;worldEl.innerHTML='';tiles=[];trayList=[];renderTray();resetCamera();setTimeout(startGame,100)}

function reshuffle(){if(!playing)return;var active=tiles.filter(function(t){return t.state==='world'});
if(active.length<2)return;var zs=[];for(var i=1;i<=active.length;i++)zs.push(i);
for(var i2=zs.length-1;i2>0;i2--){var j=Math.floor(Math.random()*(i2+1));var t=zs[i2];zs[i2]=zs[j];zs[j]=t}
active.forEach(function(tile,i){var a=Math.random()*Math.PI*2;var r=Math.sqrt(Math.random())*pileRadius;
tile.x=worldCX+Math.cos(a)*r;tile.y=worldCY+Math.sin(a)*r*0.94;tile.z=zs[i];
if(tile.el){tile.el.style.left=tile.x+'px';tile.el.style.top=tile.y+'px';tile.el.style.zIndex=tile.z}});
scheduleAccessibility();showToast('Перемешано');stats.shufflesUsed++;saveStats();checkAchievements()}

function showGameUI(){hudEl.style.display='flex';levelProgressEl.style.display='block';controlsEl.style.display='flex';trayEl.style.display='flex'}
function hideGameUI(){hudEl.style.display='none';levelProgressEl.style.display='none';controlsEl.style.display='none';trayEl.style.display='none'}
function updateCoinsDisplay(){coinsDisplayEl.textContent=coins;shopBalance.textContent=coins+' 🪙'}
function updateShopItemUseUI(){useHintBtn.style.display=(playing&&hintsOwned>0)?'flex':'none';useSkipBtn.style.display=(playing&&skipsOwned>0)?'flex':'none'}

var toastEl=null,toastTimer=null;
function showToast(t){if(!toastEl){toastEl=document.createElement('div');toastEl.className='toast';document.body.appendChild(toastEl)}
toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toastTimer);
toastTimer=setTimeout(function(){toastEl.classList.remove('show')},2400)}

var achQueue=[],achShowing=false;
function queueAchievement(a){achQueue.push(a);if(!achShowing)showNextAch()}
function showNextAch(){if(!achQueue.length){achShowing=false;return}achShowing=true;
var ach=achQueue.shift();var el=document.createElement('div');el.className='ach-popup '+ach.rarity;el.style.position='fixed';
el.innerHTML='<div><div class="ach-label">'+(ach.hidden?'Секрет раскрыт':'Достижение')+'</div><div class="ach-name">'+ach.name+'</div><div class="ach-desc">'+ach.desc+'</div></div>';
document.body.appendChild(el);requestAnimationFrame(function(){el.classList.add('show')});
setTimeout(function(){el.classList.remove('show');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);showNextAch()},400)},2800)}

function checkAchievements(){var any=true;
while(any){any=false;ACHIEVEMENTS.forEach(function(a){if(!unlockedAch[a.id]&&a.check(stats)){unlockedAch[a.id]=true;any=true;queueAchievement(a)}})}
saveAch();saveStats();updateCounters();
if(menuPanel.classList.contains('open')){renderStats();renderAllLists()}}

function updateCounters(){var total=Object.keys(unlockedAch).length;menuCount.textContent=total+'/'+ACHIEVEMENTS.length;
var by={bronze:[0,0,0,0],silver:[0,0,0,0],gold:[0,0,0,0]};
ACHIEVEMENTS.forEach(function(a){by[a.rarity][1]++;if(unlockedAch[a.id])by[a.rarity][0]++;
if(a.hidden){by[a.rarity][3]++;if(unlockedAch[a.id])by[a.rarity][2]++}});
$('bronze-badge').textContent=by.bronze[0]+'/'+by.bronze[1];
$('silver-badge').textContent=by.silver[0]+'/'+by.silver[1];
$('gold-badge').textContent=by.gold[0]+'/'+by.gold[1];
$('hint-bronze').textContent='Скрытых: '+by.bronze[2]+'/'+by.bronze[3];
$('hint-silver').textContent='Скрытых: '+by.silver[2]+'/'+by.silver[3];
$('hint-gold').textContent='Скрытых: '+by.gold[2]+'/'+by.gold[3]}

function renderStats(){var main=[{value:stats.gamesPlayed,label:'Сыграно'},{value:stats.gamesWon,label:'Побед'},{value:coins,label:'Монет'},{value:stats.highestLevel,label:'Макс. уровень'},{value:stats.totalPairsFound,label:'Всего троек'},{value:stats.maxWinStreak,label:'Лучшая серия'}];
statsGrid.innerHTML=main.map(function(s){return '<div class="stat-card"><div class="stat-value">'+s.value+'</div><div class="stat-label">'+s.label+'</div></div>'}).join('');
var best=[{value:stats.bestTime>0?stats.bestTime+'с':'—',label:'Лучшее время'},{value:stats.bestMoves>0?stats.bestMoves:'—',label:'Лучшие ходы'},{value:stats.perfectGamesNoMistakes,label:'Идеальных'},{value:stats.gamesWonWithComeback,label:'Камбэков'}];
statsBest.innerHTML=best.map(function(s){return '<div class="stat-card"><div class="stat-value">'+s.value+'</div><div class="stat-label">'+s.label+'</div></div>'}).join('')}

function renderRow(a,si){var u=unlockedAch[a.id];var rn=RARITY_NAME[a.rarity];
if(a.hidden&&!u){return '<div class="item-row hidden-locked"><div class="row-text"><div class="name">??? #'+si+'</div><div class="desc">Условие скрыто.</div></div><div class="row-side"><span class="rarity-badge '+a.rarity+'">'+rn+'</span><span class="secret-badge">Секрет</span></div></div>'}
if(!u){return '<div class="item-row visible-locked"><div class="row-text"><div class="name">'+a.name+'</div><div class="desc">'+a.desc+'</div></div><div class="row-side"><span class="rarity-badge '+a.rarity+'">'+rn+'</span></div></div>'}
return '<div class="item-row unlocked '+a.rarity+'"><div class="row-text"><div class="name">'+a.name+'</div><div class="desc">'+a.desc+'</div></div><div class="row-side"><span class="rarity-badge '+a.rarity+'">'+rn+'</span>'+(a.hidden?'<span class="secret-badge">Секрет</span>':'')+'<span class="unlocked-check">Получено</span></div></div>'}

function renderRarityList(r){var list=ACHIEVEMENTS.filter(function(a){return a.rarity===r}).sort(function(a,b){var ua=unlockedAch[a.id]?0:1;var ub=unlockedAch[b.id]?0:1;if(ua!==ub)return ua-ub;return (a.hidden?1:0)-(b.hidden?1:0)});
var sc=0;document.getElementById('list-'+r).innerHTML=list.map(function(a){if(a.hidden&&!unlockedAch[a.id]){sc++;return renderRow(a,sc)}return renderRow(a)}).join('')}
function renderAllLists(){['bronze','silver','gold'].forEach(renderRarityList)}

function openMenu(){renderStats();renderAllLists();updateCounters();updateThemeButton();menuPanel.classList.add('open')}

function openLevels(){renderLevels();levelsPanel.classList.add('open')}
function closeLevels(){levelsPanel.classList.remove('open')}

function renderLevels(){levelsGrid.innerHTML='';var passedCount=0;
for(var i=0;i<LEVEL_VARIANTS.length;i++){var lvNum=i+1;var pairs=LEVEL_VARIANTS[i];
var isDone=!!levelsDone[lvNum];var isSkipped=!!levelsSkipped[lvNum];var isCurrent=(lvNum===currentLevel);var isUnlocked=(lvNum<=stats.highestLevel);
if(isDone)passedCount++;
var card=document.createElement('div');card.className='level-card';
if(isDone)card.className+=' done';if(isSkipped)card.className+=' skipped';if(isCurrent)card.className+=' current';if(!isUnlocked)card.className+=' locked';
var status='';if(isDone)status='✓ Пройден';else if(isSkipped)status='⏭ Пропущен';else if(isCurrent)status='▶ Играть';else if(isUnlocked)status='Открыт';else status='Закрыт';
var lockIcon=isUnlocked?'':'<div class="lv-lock">🔒</div>';
var resetBtn=(isDone||isSkipped)?'<div class="lv-reset" data-reset="'+lvNum+'">✕</div>':'';
card.innerHTML=lockIcon+resetBtn+'<div class="lv-num">'+lvNum+'</div><div class="lv-pairs">'+pairs+' надписей</div><div class="lv-status">'+status+'</div>';
if(isUnlocked){(function(n){card.addEventListener('click',function(e){if(e.target.dataset.reset)return;goToLevel(n)})})(lvNum)}
var resetEl=card.querySelector('.lv-reset');if(resetEl){(function(n){resetEl.addEventListener('click',function(e){e.stopPropagation();resetLevel(n)})})(lvNum)}
levelsGrid.appendChild(card)}
levelsProgressInfo.textContent='Пройдено: '+passedCount+' / '+LEVEL_VARIANTS.length}

function goToLevel(n){if(n<1||n>LEVEL_VARIANTS.length)return;if(n>stats.highestLevel)return;
currentLevel=n;saveLevel();closeLevels();showGameUI();startGame()}

function resetLevel(n){if(!confirm('Сбросить уровень '+n+'?'))return;
delete levelsDone[n];delete levelsSkipped[n];saveLevelsDone();saveLevelsSkipped();
var maxDone=1;for(var i=1;i<=LEVEL_VARIANTS.length;i++){if(levelsDone[i]||levelsSkipped[i])maxDone=Math.max(maxDone,i+1)}
if(currentLevel>maxDone)currentLevel=maxDone;stats.highestLevel=maxDone;saveStats();saveLevel();
renderLevels();showToast('Уровень '+n+' сброшен')}

var SHOP_ITEMS=[
{id:'hint',icon:'💡',name:'Подсказка',desc:'Подсветит доступную тройку',price:30,type:'consumable'},
{id:'skip',icon:'⏭',name:'Пропуск уровня',desc:'Пропустить текущий уровень. Монеты и ачивки за него не даются.',priceFn:function(){return 50*currentLevel},type:'consumable'},
{id:'xray',icon:'🔍',name:'Рентген',desc:'Подсветит все верхние плитки на 5 секунд',price:60,type:'instant'},
{id:'shuffle_free',icon:'🔀',name:'Бесплатное перемешивание',desc:'Перемешать без записи в статистику',price:20,type:'instant'}
];

function renderShop(){updateCoinsDisplay();shopGrid.innerHTML='';
SHOP_ITEMS.forEach(function(item){var price=item.priceFn?item.priceFn():item.price;
var canAfford=coins>=price;var ownedInfo='';
if(item.id==='hint'&&hintsOwned>0)ownedInfo='В наличии: '+hintsOwned;
if(item.id==='skip'&&skipsOwned>0)ownedInfo='В наличии: '+skipsOwned;
var el=document.createElement('div');el.className='shop-item';
el.innerHTML='<div class="icon">'+item.icon+'</div><div class="name">'+item.name+'</div><div class="desc">'+item.desc+(ownedInfo?'<br><b>'+ownedInfo+'</b>':'')+'</div><button class="buy-btn" data-id="'+item.id+'"'+(!canAfford?' disabled':'')+'>Купить — <span class="price">'+price+' 🪙</span></button>';
var btn=el.querySelector('.buy-btn');btn.addEventListener('click',function(){buyItem(item,price)});
shopGrid.appendChild(el)})}

function buyItem(item,price){if(coins<price){showToast('Не хватает монет');return}
if(item.type==='instant'&&!playing){showToast('Работает только в игре');return}
coins-=price;saveCoins();
if(item.id==='hint'){if(!playing){coins+=price;saveCoins();showToast('Только во время игры');return}hintsOwned++;saveInv();showToast('Куплено');updateShopItemUseUI()}
else if(item.id==='skip'){skipsOwned++;saveInv();showToast('Куплено');updateShopItemUseUI()}
else if(item.id==='xray'){applyXray()}
else if(item.id==='shuffle_free'){applyFreeShuffle()}
stats.purchases=(stats.purchases||0)+1;saveStats();checkAchievements();updateCoinsDisplay();renderShop()}

function applyXray(){var accessible=tiles.filter(function(t){return t.state==='world'&&!t.blocked});
accessible.forEach(function(t){if(t.el){t.el.style.transition='box-shadow 0.3s';t.el.style.boxShadow='0 0 0 3px #00e0ff, 0 0 25px rgba(0,224,255,0.9), 2px 3px 0 '+t.color.shadow}});
setTimeout(function(){accessible.forEach(function(t){if(t.el){t.el.style.boxShadow='';setTimeout(function(){if(t.el)t.el.style.transition=''},300)}})},5000);
showToast('Рентген активирован')}

function applyFreeShuffle(){var active=tiles.filter(function(t){return t.state==='world'});if(active.length<2)return;
var zs=[];for(var i=1;i<=active.length;i++)zs.push(i);
for(var i2=zs.length-1;i2>0;i2--){var j=Math.floor(Math.random()*(i2+1));var t=zs[i2];zs[i2]=zs[j];zs[j]=t}
active.forEach(function(tile,i){var a=Math.random()*Math.PI*2;var r=Math.sqrt(Math.random())*pileRadius;
tile.x=worldCX+Math.cos(a)*r;tile.y=worldCY+Math.sin(a)*r*0.94;tile.z=zs[i];
if(tile.el){tile.el.style.left=tile.x+'px';tile.el.style.top=tile.y+'px';tile.el.style.zIndex=tile.z}});
scheduleAccessibility();showToast('Перемешано')}

function useHint(){if(!playing||hintsOwned<=0)return;
var accessible=tiles.filter(function(t){return t.state==='world'&&!t.blocked});var by={};
accessible.forEach(function(t){if(!by[t.variantIndex])by[t.variantIndex]=[];by[t.variantIndex].push(t)});
var chosen=null;for(var v in by){if(by[v].length>=3){chosen=by[v].slice(0,3);break}}
if(!chosen){for(var v2 in by){if(by[v2].length>=2){chosen=by[v2].slice(0,2);break}}}
if(!chosen&&accessible.length>0)chosen=[accessible[0]];
if(!chosen||chosen.length===0){showToast('Нет доступных');return}
chosen.forEach(function(t){if(t.el)t.el.classList.add('hint')});
setTimeout(function(){chosen.forEach(function(t){if(t.el)t.el.classList.remove('hint')})},3000);
hintsOwned--;saveInv();updateShopItemUseUI();showToast('Подсказка использована')}

function useSkip(){if(!playing||skipsOwned<=0)return;
if(!confirm('Пропустить уровень '+currentLevel+'? Монеты и ачивки не будут даны.'))return;
skipsOwned--;saveInv();playing=false;clearInterval(timeInterval);
levelsSkipped[currentLevel]='skipped';delete levelsDone[currentLevel];saveLevelsSkipped();saveLevelsDone();
var next=currentLevel+1;if(next>stats.highestLevel&&next<=LEVEL_VARIANTS.length){stats.highestLevel=next;saveStats()}
showToast('Уровень пропущен');
if(currentLevel<LEVEL_VARIANTS.length){currentLevel++;saveLevel();updateShopItemUseUI();setTimeout(startGame,300)}
else{endLevelBadge.textContent='Уровень '+currentLevel+' пропущен';endTitle.textContent='Игра пройдена';endSubtitle.textContent='Все уровни позади.';
finalMovesEl.textContent='—';timeResultEl.textContent='';coinsEarnedEl.textContent='';rankEl.textContent='';
$('next-level-btn').style.display='none';endScreen.classList.remove('hidden')}}

function updateThemeButton(){var b=$('theme-toggle');if(!b)return;
b.textContent=theme==='dark'?'☀ Светлая':'🌙 Тёмная'}

function toggleTheme(){theme=theme==='dark'?'light':'dark';
document.body.classList.toggle('dark',theme==='dark');storage.set(K.theme,theme);updateThemeButton()}

var KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
var konamiBuffer=[],typedBuffer='';
document.addEventListener('keydown',function(e){var key=e.key;
konamiBuffer.push(key.length===1?key.toLowerCase():key);if(konamiBuffer.length>KONAMI.length)konamiBuffer.shift();
if(konamiBuffer.join(',')===KONAMI.join(',')){konamiBuffer=[];activateRainbow()}
if(key.length===1){typedBuffer+=key.toLowerCase();if(typedBuffer.length>20)typedBuffer=typedBuffer.slice(-20);
if(typedBuffer.slice(-6)==='хахаха'){typedBuffer='';stats.wordUsed=true;saveStats();checkAchievements();showToast('Раскрываю тройку');autoRevealTriple()}}});

function activateRainbow(){if(rainbowMode)return;rainbowMode=true;stats.rainbowActivated=true;saveStats();checkAchievements();showToast('Радужный режим');
tiles.forEach(function(t){if(t.state!=='world'||!t.el)return;var h=Math.random()*360;var sat=32+Math.random()*20;var l=40+Math.random()*15;
t.el.style.setProperty('--bg','hsl('+h+','+sat+'%,'+l+'%)');t.el.style.setProperty('--fg',l<46?'#f0e8d5':'#241a10')})}

function autoRevealTriple(){var accessible=tiles.filter(function(t){return t.state==='world'&&!t.blocked});var by={};
accessible.forEach(function(t){if(!by[t.variantIndex])by[t.variantIndex]=[];by[t.variantIndex].push(t)});
for(var v in by){if(by[v].length>=MATCH_SIZE){by[v].slice(0,MATCH_SIZE).forEach(function(t){if(!t.el)return;
var old=t.el.style.boxShadow;t.el.style.boxShadow='0 0 0 3px #8b2019, 0 0 20px rgba(139,32,25,0.7)';
setTimeout(function(){if(t.el)t.el.style.boxShadow=old},2200)});return}}}

titleEl.addEventListener('click',function(){stats.titleClicks++;saveStats();
titleEl.style.letterSpacing=(0.14+(stats.titleClicks%8)*0.02)+'em';
setTimeout(function(){titleEl.style.letterSpacing='0.14em'},200);
if(stats.titleClicks>=7)checkAchievements()});

var hudLevelClicks=0,hudLevelClickTimer=null;
hudLevelEl.addEventListener('click',function(){openLevels()});

$('hud-coins').addEventListener('click',function(){renderShop();shopPanel.classList.add('open')});

$('menu-btn').addEventListener('click',openMenu);
$('close-menu').addEventListener('click',function(){menuPanel.classList.remove('open')});
menuPanel.addEventListener('click',function(e){if(e.target===menuPanel)menuPanel.classList.remove('open')});
document.querySelectorAll('.menu-tab').forEach(function(tab){tab.addEventListener('click',function(){
document.querySelectorAll('.menu-tab').forEach(function(t){t.classList.remove('active')});tab.classList.add('active');
document.querySelectorAll('.menu-pane').forEach(function(p){p.classList.remove('active')});
document.getElementById('pane-'+tab.dataset.tab).classList.add('active')})});

$('theme-toggle').addEventListener('click',toggleTheme);
$('reset-current-level').addEventListener('click',function(){if(!confirm('Начать уровень заново?'))return;resetCurrentGame()});
$('reset-levels').addEventListener('click',function(){if(!confirm('Сбросить все уровни? Вернётесь на 1 уровень.'))return;
levelsDone={};levelsSkipped={};stats.highestLevel=1;currentLevel=1;saveLevelsDone();saveLevelsSkipped();saveStats();saveLevel();
showToast('Уровни сброшены')});
$('reset-ach').addEventListener('click',function(){if(!confirm('Сбросить все достижения?'))return;
unlockedAch={};saveAch();updateCounters();renderStats();renderAllLists();showToast('Достижения сброшены')});
$('reset-coins').addEventListener('click',function(){if(!confirm('Сбросить монеты?'))return;coins=0;saveCoins();updateCoinsDisplay();renderShop();showToast('Монеты сброшены')});
$('full-reset').addEventListener('click',function(){if(!confirm('Удалить ВСЕ данные игры?'))return;
[K.stats,K.ach,K.level,K.coins,K.done,K.skipped,K.hints,K.skips,K.refUsed].forEach(function(k){storage.remove(k)});
location.reload()});

$('shop-btn').addEventListener('click',function(){renderShop();shopPanel.classList.add('open')});
$('shop-btn-start').addEventListener('click',function(){renderShop();shopPanel.classList.add('open')});
$('close-shop').addEventListener('click',function(){shopPanel.classList.remove('open')});
shopPanel.addEventListener('click',function(e){if(e.target===shopPanel)shopPanel.classList.remove('open')});

$('levels-btn').addEventListener('click',openLevels);
$('close-levels').addEventListener('click',closeLevels);
levelsPanel.addEventListener('click',function(e){if(e.target===levelsPanel)closeLevels()});

$('ref-my-code').value=refMyCode;
$('ref-copy').addEventListener('click',function(){var inp=$('ref-my-code');inp.select();document.execCommand('copy');
try{navigator.clipboard.writeText(refMyCode)}catch(e){}showToast('Код скопирован')});
$('ref-apply').addEventListener('click',function(){var code=$('ref-friend-code').value.trim().toUpperCase();
if(!code||code.length<4){showToast('Неверный код');return}
if(code===refMyCode){showToast('Это ваш код');return}
if(refUsedCodes.indexOf(code)>=0){showToast('Уже использован');return}
coins+=100;saveCoins();stats.refUsed=(stats.refUsed||0)+1;saveStats();
refUsedCodes.push(code);storage.set(K.refUsed,JSON.stringify(refUsedCodes));
updateCoinsDisplay();renderShop();checkAchievements();showToast('+100 🪙 за код друга');$('ref-friend-code').value=''});

$('start-btn').addEventListener('click',function(){showGameUI();startGame()});
$('choose-level-btn').addEventListener('click',openLevels);
$('next-level-btn').addEventListener('click',nextLevel);
$('replay-btn').addEventListener('click',function(){endScreen.classList.add('hidden');showGameUI();startGame()});
$('back-to-menu-btn').addEventListener('click',function(){hideGameUI();returnToMenu()});
$('exit-btn').addEventListener('click',function(){if(!confirm('Выйти в главное меню?'))return;hideGameUI();returnToMenu()});
$('reset-game-btn').addEventListener('click',resetCurrentGame);
$('shuffle-btn').addEventListener('click',reshuffle);
$('view-btn').addEventListener('click',function(){resetCamera();showToast('Вид сброшен')});
useHintBtn.addEventListener('click',useHint);
useSkipBtn.addEventListener('click',useSkip);

buildTraySlots();
updateCounters();
hideGameUI();
updateCoinsDisplay();
startLevelBadge.textContent='Уровень '+currentLevel+' · '+LEVEL_VARIANTS[currentLevel-1]+' надписей';
