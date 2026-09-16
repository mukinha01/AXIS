export const TOPICS = {digital:'TECNOLOGIA',art:'ARTE & DESIGN',everyday:'DIA A DIA',all:'SURPREENDA-ME'};

export const IDEAS = [
  {id:'d1',topic:'digital',title:'uma página tivesse a cor do seu humor?',why:'Transforme uma sensação em uma pequena experiência visual.',step:'Escolha três emoções e desenhe uma tela com uma cor para cada uma.'},
  {id:'d2',topic:'digital',title:'uma playlist fosse um lugar para visitar?',why:'Imagine a música como uma paisagem que a pessoa pode explorar.',step:'Escolha uma música. Escreva três palavras sobre o lugar que ela te faz imaginar.'},
  {id:'d3',topic:'digital',title:'um botão convidasse você a fazer uma pausa?',why:'Uma interação curta pode mudar o ritmo de um dia inteiro.',step:'Desenhe um botão e descreva o que aconteceria nos dez segundos depois do clique.'},
  {id:'d4',topic:'digital',title:'seu bairro tivesse um mapa de pequenos tesouros?',why:'Lugares comuns ganham outro significado quando alguém conta uma história.',step:'Marque três lugares que você gosta e escreva uma frase sobre cada um.'},
  {id:'d5',topic:'digital',title:'uma tarefa chata virasse uma pequena missão?',why:'Um pouco de jogo pode tornar um começo mais convidativo.',step:'Escolha uma tarefa de cinco minutos. Dê um nome à missão e invente uma recompensa simples.'},
  {id:'d6',topic:'digital',title:'seu cursor deixasse uma ideia pelo caminho?',why:'A interação mais simples também pode ser matéria de criação.',step:'Rabisque três rastros diferentes: um feito de letras, um de cores e um de formas.'},
  {id:'a1',topic:'art',title:'uma palavra tivesse seu próprio movimento?',why:'Tipografia também pode dançar, respirar e criar ritmo.',step:'Escolha um verbo e faça três desenhos de como suas letras poderiam se mover.'},
  {id:'a2',topic:'art',title:'você desenhasse um mascote para uma sensação?',why:'Dar um rosto a uma ideia abstrata é um jeito de começar a entendê-la.',step:'Escolha curiosidade, coragem ou calma. Desenhe dois olhos e uma silhueta em dois minutos.'},
  {id:'a3',topic:'art',title:'um objeto comum tivesse uma identidade inesperada?',why:'Um novo contexto pode mudar o jeito de olhar para algo conhecido.',step:'Pegue um objeto perto de você. Dê um nome a ele e escolha duas cores para uma embalagem.'},
  {id:'a4',topic:'art',title:'uma foto sua virasse um cartaz?',why:'Uma imagem pessoal pode ganhar outra história com poucas palavras.',step:'Escolha uma foto, uma frase de até cinco palavras e uma única cor de destaque.'},
  {id:'a5',topic:'art',title:'você criasse algo usando só três formas?',why:'Um limite pequeno pode abrir um caminho que você ainda não tentou.',step:'Use um círculo, um quadrado e uma linha para desenhar cinco coisas diferentes.'},
  {id:'a6',topic:'art',title:'uma lembrança pudesse virar uma textura?',why:'Memórias têm temperatura, cor e ritmo. Experimente dar uma superfície a elas.',step:'Escreva três detalhes de uma lembrança e transforme cada um em um padrão de linhas.'},
  {id:'e1',topic:'everyday',title:'o caminho de sempre escondesse uma descoberta?',why:'A curiosidade cresce quando você muda uma pequena parte da rotina.',step:'No próximo passeio, procure três detalhes de uma única cor e anote o que encontrou.'},
  {id:'e2',topic:'everyday',title:'você resolvesse um incômodo de cinco minutos?',why:'Ideias úteis podem começar com coisas pequenas que se repetem.',step:'Liste três incômodos do seu dia e desenhe uma solução simples para um deles.'},
  {id:'e3',topic:'everyday',title:'uma conversa começasse com uma pergunta diferente?',why:'Perguntas abrem histórias que às vezes passam despercebidas.',step:'Escreva três perguntas começando com “qual foi a última vez que...” e escolha uma.'},
  {id:'e4',topic:'everyday',title:'algo que você já tem ganhasse uma segunda função?',why:'Recombinar é um jeito de inventar usando o que já está por perto.',step:'Escolha um objeto e liste cinco usos possíveis, incluindo dois bem improváveis.'},
  {id:'e5',topic:'everyday',title:'seu dia tivesse um ritual de curiosidade?',why:'Um momento reservado para observar pode alimentar outras ideias.',step:'Escolha um horário e reserve dois minutos para anotar uma coisa que você nunca tinha notado.'},
  {id:'e6',topic:'everyday',title:'um cantinho da casa contasse uma história?',why:'Um espaço pequeno pode guardar intenção e identidade.',step:'Escolha três objetos que combinam entre si e escreva a história que eles contariam juntos.'}
];

export function pickIdea(topic,previousId,random=Math.random) {
  const eligible=IDEAS.filter(idea => (topic==='all'||idea.topic===topic)&&idea.id!==previousId);
  if(!eligible.length)throw new Error('Território inválido');
  return eligible[Math.min(eligible.length-1,Math.max(0,Math.floor(random()*eligible.length)))];
}

export function normalizeMural(value) {
  if(!Array.isArray(value))return [];
  const seen=new Set();
  return value.filter(item => item&&typeof item.id==='string'&&typeof item.title==='string'&&item.title.trim()&&['digital','art','everyday'].includes(item.topic)).filter(item => {
    if(seen.has(item.id))return false;seen.add(item.id);return true;
  }).map(item => ({id:item.id.slice(0,100),title:item.title.slice(0,180),topic:item.topic,note:typeof item.note==='string'?item.note.slice(0,280):'',step:typeof item.step==='string'?item.step.slice(0,400):''}));
}
