import {IDEAS,TOPICS,pickIdea,normalizeMural} from './idea-engine.mjs';

const storageKey='axis-ideas-v1';
const topicButtons=[...document.querySelectorAll('[data-topic]')];
const board=document.querySelector('#idea-board');
const generateButton=document.querySelector('#generate-idea');
const note=document.querySelector('#idea-note');
const mascot=document.querySelector('.ixi-character');
const speech=document.querySelector('#ixi-speech');
const status=document.querySelector('#idea-status');
const list=document.querySelector('#mural-list');
const undoButton=document.querySelector('#undo-idea');
let topic='digital',current=IDEAS[0],counter=1,mural=[],removed=null,memoryOnly=false;
let revealTimer,mascotTimer,tipIndex=-1;
try { mural=normalizeMural(JSON.parse(localStorage.getItem(storageKey)||'[]')); } catch { memoryOnly=true; }

const tips=[
  'Faça três rascunhos de dois minutos. Escolha um detalhe de cada.',
  'Troque uma regra: e se isso fosse menor, mais lento ou feito com outra coisa?',
  'Mostre o primeiro rascunho a alguém e pergunte o que chamou atenção.',
  'Combine duas coisas que você gosta. O que nasce quando elas se encontram?',
  'Escolha um detalhe do seu dia que quase passou despercebido. Comece por ele.',
  'Dê dez minutos à ideia. Você pode decidir o próximo passo depois.'
];
function react(message) {
  speech.textContent=message;
  clearTimeout(mascotTimer);
  mascot.classList.remove('celebrate');
  void mascot.offsetWidth;
  mascot.classList.add('celebrate');
  mascotTimer=setTimeout(()=>mascot.classList.remove('celebrate'),850);
}
mascot.addEventListener('click',()=>{tipIndex=(tipIndex+1)%tips.length;react(tips[tipIndex]);});

function displayIdea() {
  document.querySelector('#idea-category').textContent=TOPICS[current.topic];
  document.querySelector('#idea-counter').textContent=`FAÍSCA / ${String(counter).padStart(3,'0')}`;
  document.querySelector('#idea-title').textContent=current.title;
  document.querySelector('#idea-why').textContent=current.why;
  document.querySelector('#idea-step').textContent=current.step;
  board.classList.remove('changing');
}
function generate() {
  if(mixing){generateCollision();return;}
  current=pickIdea(topic,current.id);counter++;
  clearTimeout(revealTimer);
  board.classList.add('changing');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  revealTimer=setTimeout(displayIdea,reduced?0:120);
  status.textContent='';
  react(['Essa merece um rascunho.','E se você colocasse um detalhe seu?','Um pequeno teste já dá movimento.'][(counter-2)%3]);
}
topicButtons.forEach(button=>button.addEventListener('click',()=>{
  topic=button.dataset.topic;
  topicButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  generate();
}));
generateButton.addEventListener('click',generate);

function persist() {
  try { localStorage.setItem(storageKey,JSON.stringify(mural));memoryOnly=false; }
  catch { memoryOnly=true; }
}
function renderMural() {
  list.replaceChildren();
  document.querySelector('#mural-empty').hidden=mural.length>0;
  document.querySelector('#mural-count').textContent=`${mural.length} ${mural.length===1?'GUARDADA':'GUARDADAS'}`;
  document.querySelector('.mural-privacy').textContent=memoryOnly?'Seu mural fica disponível nesta sessão.':'Seu mural fica só neste navegador.';
  mural.forEach((item,index)=>{
    const card=document.createElement('li');card.className='mural-card';
    const meta=document.createElement('span');meta.className='mural-card-meta';meta.textContent=`${String(index+1).padStart(2,'0')} / ${TOPICS[item.topic]}`;
    const title=document.createElement('h4');title.textContent=`E se ${item.title}`;
    const text=document.createElement('p');text.textContent=item.note||item.step;
    const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.dataset.remove=item.id;remove.setAttribute('aria-label',`Remover do mural: ${item.title}`);
    card.append(meta,title,text,remove);list.append(card);
  });
}
document.querySelector('#save-idea').addEventListener('click',()=>{
  // Finish a pending reveal so the saved idea always matches the visible result.
  clearTimeout(revealTimer);displayIdea();
  const draft=note.value.trim();
  if(mural.some(item=>item.title===current.title&&item.note===draft)){status.textContent='Esta faísca já está no seu mural.';react('Ela já tem um lugar. Você pode experimentar outra.');return;}
  mural.unshift({id:crypto.randomUUID(),title:current.title,topic:current.topic,step:current.step,note:draft});
  persist();renderMural();note.value='';
  status.textContent=memoryOnly?'Ideia guardada nesta sessão. O navegador não permitiu salvar para depois.':'Ideia guardada. Você pode voltar a ela no seu mural.';
  react('Boa. Agora ela tem um lugar pra voltar.');
});
list.addEventListener('click',event=>{
  const button=event.target.closest('[data-remove]');if(!button)return;
  const index=mural.findIndex(item=>item.id===button.dataset.remove);if(index<0)return;
  removed={item:mural[index],index};mural.splice(index,1);persist();renderMural();
  undoButton.hidden=false;undoButton.focus({preventScroll:true});status.textContent='Ideia removida. Você pode desfazer.';
});
undoButton.addEventListener('click',()=>{
  if(!removed)return;
  if(!mural.some(item=>item.id===removed.item.id))mural.splice(Math.min(removed.index,mural.length),0,removed.item);
  removed=null;undoButton.hidden=true;persist();renderMural();document.querySelector('#mural-title').tabIndex=-1;document.querySelector('#mural-title').focus({preventScroll:true});status.textContent='Ideia de volta ao mural.';
});
window.addEventListener('storage',event=>{if(event.key!==storageKey)return;try{mural=normalizeMural(JSON.parse(event.newValue||'[]'));renderMural();}catch{/* Keep the current mural if another tab writes invalid data. */}});
renderMural();

// Two independently chosen dimensions create 24 actionable combinations.
const worlds=[['Música','sons que você costuma ignorar','grave três sons do seu dia'],['Natureza','pequenos detalhes da natureza','observe três formas ou texturas ao seu redor'],['Memórias','lembranças que merecem outro formato','escreva três detalhes de uma lembrança'],['Cidade','descobertas escondidas no seu bairro','encontre três detalhes em um caminho conhecido'],['Jogos','regras divertidas para o cotidiano','invente uma regra simples com uma recompensa simbólica'],['Culinária','sabores que contam uma história','escolha um ingrediente e uma história ligada a ele']];
const lenses=[['uma experiência digital','digital','desenhe uma tela interativa'],['um objeto de papel','art','faça um protótipo com uma folha'],['um encontro entre pessoas','everyday','convide alguém para experimentar por dez minutos'],['um ritual de cinco minutos','everyday','teste uma sequência de três pequenos gestos']];
let mixing=false;const collision=document.querySelector('#collision');
function setMode(value){mixing=value;document.querySelector('#mode-spark').setAttribute('aria-pressed',String(!value));document.querySelector('#mode-mix').setAttribute('aria-pressed',String(value));collision.hidden=!value;document.querySelector('.topic-picker').hidden=value;generateButton.firstChild.textContent=value?'CRIAR COLISÃO ':'OUTRA FAÍSCA ';if(value)generateCollision();else generate();}
document.querySelector('#mode-spark').addEventListener('click',()=>setMode(false));document.querySelector('#mode-mix').addEventListener('click',()=>setMode(true));
function generateCollision(){const wi=Number(document.querySelector('#mix-world').value),li=Number(document.querySelector('#mix-lens').value),w=worlds[wi],l=lenses[li];current={id:'mix-'+wi+'-'+li,topic:l[1],title:w[1]+' virassem '+l[0]+'?',why:'Uma colisão entre '+w[0].toLowerCase()+' e '+l[0]+'. Use o encontro como ponto de partida, acrescente seu jeito.',step:'Primeiro, '+w[2]+'. Depois, '+l[2]+'. Mostre a alguém e pergunte o que despertou curiosidade.'};counter++;clearTimeout(revealTimer);displayIdea();collision.classList.remove('colliding');void collision.offsetWidth;collision.classList.add('colliding');react('Dois mundos acabaram de se encontrar. O próximo detalhe é seu.');status.textContent='Colisão criada. Você pode guardar ou tirar do papel.';}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
mascot.addEventListener('pointermove',event=>{if(reducedMotion.matches||event.pointerType!=='mouse')return;const r=mascot.getBoundingClientRect();mascot.style.setProperty('--ixi-x',((event.clientX-r.left)/r.width-.5)*12+'deg');mascot.style.setProperty('--ixi-y',-((event.clientY-r.top)/r.height-.5)*12+'deg');});
mascot.addEventListener('pointerleave',()=>{mascot.style.setProperty('--ixi-x','0deg');mascot.style.setProperty('--ixi-y','0deg');});
const launchDialog=document.querySelector('#launch-dialog'),launchButton=document.querySelector('#launch-idea');
launchButton.addEventListener('click',()=>{clearTimeout(revealTimer);displayIdea();document.querySelector('#launch-source').textContent='E se '+current.title;document.querySelector('#plan-test').value=note.value.trim()||current.step;document.querySelector('#plan-person').value='';document.querySelector('#plan-signal').value='';document.querySelector('#plan-help').textContent='Seu plano vira um arquivo de texto. Sem cadastro, sem envio.';launchDialog.showModal();});
document.querySelector('#launch-close').addEventListener('click',()=>launchDialog.close());launchDialog.addEventListener('close',()=>launchButton.focus({preventScroll:true}));
document.querySelector('#download-plan').addEventListener('click',()=>{const person=document.querySelector('#plan-person').value.trim(),test=document.querySelector('#plan-test').value.trim(),signal=document.querySelector('#plan-signal').value.trim();if(!test){document.querySelector('#plan-help').textContent='Escolha um primeiro experimento para levar com você.';document.querySelector('#plan-test').focus();return;}const text=['AXIS / DO E SE AO VAMOS','','E se '+current.title,'','PARA QUEM',person||'Ainda vou descobrir.','','PRIMEIRO EXPERIMENTO',test,'','SINAL PARA CONTINUAR',signal||'Mostrar a alguém e observar o que desperta curiosidade.','','Comece pequeno. Faça do seu jeito. — IXI'].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='axis-meu-primeiro-experimento.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);document.querySelector('#plan-help').textContent='Plano preparado para download. Sua ideia já tem um próximo passo.';});
