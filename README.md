# AXIS® — Ideias fora do eixo

Laboratório de ideias autoral em uma experiência digital: escultura 3D interativa, temas escuro/verde ácido e claro/azul elétrico, revelações de scroll, tipografia em movimento e navegação em tela cheia.

## Executar

Requer Node.js 24+ para os testes. Three.js é a única dependência, com versão fixada.

```sh
npm ci
npm run dev
npm run check
npm test
```

Abra o endereço exibido no terminal. ES modules e WebGL exigem servidor HTTP; abrir o HTML diretamente não é suportado.

## Organização

- [Protocolo do Codex](AGENTS.md)
- [Segunda mente atual](segunda-mente/AXIS/AXIS.md)
- [Mapa](segunda-mente/AXIS/Documentacao/Mapa-do-projeto.md)

Abra segunda-mente como cofre no Obsidian. Organização inspirada no método do ECHO; AXIS é a fonte de verdade atual. Cafe guarda a direção anterior como histórico.

## Experiência

Três formas selecionáveis, dois experimentos com detalhes, rolagem nativa, dialogs acessíveis, Escape, foco visível e respeito a movimento reduzido. A escultura utiliza geometria local, ambiente de estúdio e material metálico; conteúdo permanece disponível sem WebGL.

IXI é uma estrela cromada original que acompanha 18 provocações, cada uma com um primeiro passo. Há dicas criativas e um mural pessoal com anotação opcional e desfazer remoção.

Sem banco, backend ou autenticação. LocalStorage guarda tema e mural (axis-ideas-v1), apenas neste navegador. Falhas de armazenamento usam a sessão. Fonts usam Google Fonts com alternativas de sistema. LOOP contém uma arte original gerada por ImageGen; PULSO explora tipografia nativa.

A referência de motion é o [case oficial Lando Norris / OFF+BRAND](https://www.itsoffbrand.com/our-work/lando-norris). AXIS, projetos e arte são conceituais e autorais; não representam clientes reais.

## Colisão e primeiro experimento

Combine seis universos e quatro formatos (24 encontros). Guarde a combinação no mural ou use Tirar do papel para definir público, protótipo e sinal de continuidade. O plano pode ser baixado em texto; os campos não são enviados nem persistidos. IXI responde ao ponteiro com inclinação suave, além das reações existentes. Tudo permanece sem banco.

## Manipular o 3D

Arraste a superfície da escultura com o mouse para girá-la. No celular, deslize sobre ela para os lados; o gesto vertical continua destinado à rolagem. Ao manipular, a rotação automática pausa. Use os botões ← / → para girar e ↺ para voltar à posição inicial. Com foco no canvas, as setas giram nos dois eixos e Home reinicia. Trocar de forma também reinicia a posição. Movimento reduzido desativa o movimento automático, mantendo comandos diretos.

## Atualizar pelo GitHub

O projeto está preparado para Git, com branch main. O repositório remoto ainda precisa ser criado: o conector disponível não oferece essa operação nesta sessão. Recomenda-se um repositório privado chamado axis, inicialmente vazio, sem README ou licença gerados pelo GitHub. Após conectar o remoto:

```sh
git remote add origin https://github.com/SEU-USUARIO/axis.git
git push -u origin main
```

Para alterações seguintes, atualize a segunda mente, execute npm run check e npm test, revise git diff, faça commit e envie com git push. Em PowerShell com scripts bloqueados, use npm.cmd. O workflow .github/workflows/check.yml executa instalação, check e testes em pushes e pull requests; não publica o site. Arquivos .env, metadados locais .openai, node_modules, logs e pacotes zip ficam fora do Git. Three.js e sua licença local permanecem incluídos em dist/vendor.
