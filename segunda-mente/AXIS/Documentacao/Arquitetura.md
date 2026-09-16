# Arquitetura

HTML, CSS e JavaScript, servidos estaticamente a partir de dist. Three.js 0.186.0 é a única dependência de produto, fixada no package-lock.json.

`scene.js` cria geometria, material metálico, iluminação e ambiente RoomEnvironment local. Renderiza apenas quando o objeto está visível e a aba ativa. Pixel ratio limitado para reduzir custo. Não há downloads de modelos ou HDRI.

`app.js` gerencia tema, menu, seletores e progresso. `experience.js` gerencia revelações, rolagem, dialogs de conceitos e cursor contextual. Motion usa requestAnimationFrame e IntersectionObserver. A rolagem nativa permanece ativa; não há scroll hijacking.

`npm ci` prepara Three.js em dist/vendor pelo postinstall. `npm run dev` usa o servidor Node local. A hospedagem utiliza os arquivos já presentes em dist; não exige runtime Node.

`idea-engine.mjs` contém catálogo, seleção sem repetição imediata e normalização. `ideas.js` controla dicas e mural. Notas são renderizadas com textContent. LocalStorage contém `axis-theme` e `axis-ideas-v1`. Falhas de armazenamento usam memória da sessão. Fonts externas têm alternativas locais. Imagem autoral de LOOP é local. Anotações permanecem neste navegador, sem backend.

[Índice](../AXIS.md) · [Decisões](Decisoes.md)

## Colisão

Implementada no módulo ideas.js existente, sem dependência adicional. Composição determinística de universos e formatos. Resultado usa o mesmo mural. Plano em dialog nativo com Escape e retorno de foco; exportação via Blob de texto, URL revogada após uso. Campos do plano são temporários e não enviados. Tilt do mascote somente com mouse e sem movimento reduzido.

## Controle direto da escultura

scene.js usa Pointer Events com captura apenas quando Raycaster intersecta a geometria. Limiar de 6px evita iniciar rotação em um clique; gesto vertical inicial de toque libera captura. pointercancel, perda de captura e blur encerram o gesto. Rotação manual pausa movimentos automáticos até reinício ou troca de forma. Teclado e botões usam o mesmo estado; movimento reduzido mantém somente comandos diretos. Não há inércia ou nova dependência. Tests em Node usam geometria/raycast reais de Three.js e DOM/renderer simulados; não validam WebGL ou gestos em hardware.
